'use client';

import {
  ColumnDef,
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
import { getZhpUnits, ZhpUnit } from '@/lib/zhp-unit';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeText } from '@/lib/utils';

export default function UnitsPage() {
  const zhpUnitsQuery = useQuery({
    queryKey: ['units'],
    queryFn: getZhpUnits,
  });

  return (
    <div className="container mx-auto my-12 flex flex-col">
      <div className="max-w-none">
        <div className="prose">
          <h1>Jednostki organizacyjne</h1>
        </div>

        {zhpUnitsQuery.isLoading ? (
          <div>loading...</div>
        ) : (
          <ZhpUnitDataTable data={zhpUnitsQuery.data ?? []} />
        )}
      </div>
    </div>
  );
}

export function ZhpUnitDataTable({ data }: { data: ZhpUnit[] }) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const columns = [
    {
      accessorKey: 'district',
      header: 'Hufiec',
    },
    {
      accessorKey: 'region',
      header: 'Chorągiew',
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
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => router.push(`/units/${row.original.id}`)}
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
