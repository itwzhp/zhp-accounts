'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getZhpUnit } from '@/lib/zhp-unit';
import { getZhpMembers } from '@/lib/zhp-member';
import UnitMembers from '@/components/unit-members';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function UnitMembersPage() {
  const searchParams = useSearchParams();
  const zhpUnitId = +(searchParams.get('id') ?? 0);

  const zhpUnitQuery = useQuery({
    queryKey: ['units', zhpUnitId],
    queryFn: () => getZhpUnit(zhpUnitId),
  });
  const zhpMembersQuery = useQuery({
    queryKey: ['members', zhpUnitId],
    queryFn: () => getZhpMembers(zhpUnitId),
  });

  return (
    <div className="container mx-auto my-12 flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <Link
          href="/units"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Powrót do listy jednostek</span>
        </Link>
      </div>

      <div>
        {zhpUnitQuery.isLoading ? (
          <div>loading...</div>
        ) : (
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">{zhpUnitQuery.data?.name}</h1>
              <p className="text-muted-foreground">
                {zhpUnitQuery.data?.region}
              </p>
            </div>
          </div>
        )}
      </div>

      {zhpMembersQuery.isLoading ? (
        <div>loading...</div>
      ) : (
        zhpUnitQuery.data &&
        zhpMembersQuery.data && (
          <UnitMembers
            members={zhpMembersQuery.data}
            unit={zhpUnitQuery.data}
          />
        )
      )}
    </div>
  );
}
