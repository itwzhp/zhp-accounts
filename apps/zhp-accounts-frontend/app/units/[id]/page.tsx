'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getZhpUsers, ZhpUser } from '@/lib/zhp-user';
import { normalizeText } from '@/lib/utils';
import { getZhpUnit } from '@/lib/zhp-unit';

export default function UnitPage() {
  const { id: zhpUnitId } = useParams<{ id: string }>();
  const zhpUnitQuery = useQuery({
    queryKey: ['units', zhpUnitId],
    queryFn: () => getZhpUnit(zhpUnitId),
  });
  const zhpUsersQuery = useQuery({
    queryKey: ['users', zhpUnitId],
    queryFn: () => getZhpUsers(zhpUnitId),
  });

  return (
    <div className="container mx-auto my-12 flex flex-col">
      <div className="max-w-none">
        <div className="prose">
          {zhpUnitQuery.isLoading ? (
            <div>loading...</div>
          ) : (
            <div>
              <h1 className="mb-2">{zhpUnitQuery.data?.district}</h1>
              <span className="text-xl">{zhpUnitQuery.data?.region}</span>
            </div>
          )}

          <h2 className="mt-8">Członkowie jednostki</h2>
        </div>

        {zhpUsersQuery.isLoading ? (
          <div>loading...</div>
        ) : (
          <ZhpUserDataTable data={zhpUsersQuery.data ?? []} />
        )}
      </div>
    </div>
  );
}

export function ZhpUserDataTable({ data }: { data: ZhpUser[] }) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const columns = [
    {
      accessorKey: 'membershipNumber',
      header: 'Numer członkowski',
    },
    {
      accessorKey: 'name',
      header: 'Imię',
    },
    {
      accessorKey: 'surname',
      header: 'Nazwisko',
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (rows, columnId, filterValue) => {
      const rowValue = rows.getValue<string>(columnId);
      return normalizeText(rowValue).includes(normalizeText(filterValue));
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Szukaj..."
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-4 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer"
                  onClick={() => router.push(`/users/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
