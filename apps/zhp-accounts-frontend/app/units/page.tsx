'use client';

import UnitsList from '@/components/units-list';
import { getZhpUnits } from '@/lib/zhp-unit';
import { ZhpUnit } from 'zhp-accounts-types';
import { useQuery } from '@tanstack/react-query';

export default function UnitsPage() {
  const zhpUnitsQuery = useQuery({
    queryKey: ['units'],
    queryFn: getZhpUnits,
  });

  return (
    <div className="container mx-auto my-12 flex flex-col">
      <h1 className="mb-6 text-2xl font-bold">Lista jednostek</h1>

      {zhpUnitsQuery.isLoading ? (
        <div>loading...</div>
      ) : (
        <UnitsList
          units={zhpUnitsQuery.data ?? []}
          regions={getZhpRegions(zhpUnitsQuery.data)}
        />
      )}
    </div>
  );
}

function getZhpRegions(units?: ZhpUnit[]): string[] {
  if (!units) {
    return [];
  }

  return Array.from(
    new Set(
      units
        .map((unit) => unit.region)
        .filter((region): region is string => !!region),
    ),
  ).sort();
}
