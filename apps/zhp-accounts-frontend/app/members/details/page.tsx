'use client';

import MemberProfile from '@/components/member-profile';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getZhpMember } from '@/lib/zhp-member';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MemberProfilePage() {
  const searchParams = useSearchParams();
  const zhpUnitId = searchParams.get('unitId') ?? '';
  const zhpUserId = searchParams.get('id') ?? '';
  const zhpUserQuery = useQuery({
    queryKey: ['users', zhpUserId],
    queryFn: () => getZhpMember(zhpUserId),
  });

  return (
    <div className="container mx-auto my-12 flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <Link
          href={`/members?id=${zhpUnitId}`}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Powrót do listy członków</span>
        </Link>
      </div>

      {zhpUserQuery.isLoading ? (
        <div>loading...</div>
      ) : (
        zhpUserQuery.data && <MemberProfile member={zhpUserQuery.data} />
      )}
    </div>
  );
}
