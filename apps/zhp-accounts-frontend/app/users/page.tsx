'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getZhpUser, ZhpUser } from '@/lib/zhp-user';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function UserPage() {
  const searchParams = useSearchParams();
  const zhpUserId = searchParams.get('id') ?? '';
  const zhpUsersQuery = useQuery({
    queryKey: ['users', zhpUserId],
    queryFn: () => getZhpUser(zhpUserId),
  });

  return (
    <div className="container mx-auto my-12 flex flex-col">
      <div className="max-w-none">
        {zhpUsersQuery.isLoading ? (
          <div>loading...</div>
        ) : (
          zhpUsersQuery.data && <UserProfile {...zhpUsersQuery.data} />
        )}
      </div>
    </div>
  );
}

function UserProfile({
  name,
  surname,
  membershipNumber,
  region,
  district,
}: ZhpUser) {
  const [open, setOpen] = useState(false);
  const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

  const email = 'b.kowalski@poczta.pl';
  const phone = '+48 555 123 567';
  const birthdate = 'Sty 15, 1995';
  const checks = [
    'Weryfikacja danych osobowych',
    'Sprawdzenie płatności składek',
    'Weryfikacja zgód RODO',
  ];

  return (
    <div className="container mx-auto max-w-5xl py-6">
      {/* Header Section */}
      <div className="mb-6 rounded-lg bg-primary/5 p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {name} {surname}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    {membershipNumber}
                  </Badge>
                </div>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">Aktywuj konto Microsoft</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Aktywacja konta Microsoft</DialogTitle>
                    <DialogDescription>
                      Poniżej znajdują się wyniki weryfikacji dla {name}{' '}
                      {surname}.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <h3 className="mb-3 font-medium">
                      Przeprowadzone kontrole:
                    </h3>
                    <ul className="space-y-3">
                      {checks.map((check, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => setOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Zamknij
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{birthdate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Information Section */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">
          Informacje o członkostwie
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Membership ID Column */}
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Numer członkowski
                  </p>
                  <p className="text-lg font-medium">{membershipNumber}</p>
                </div>
              </div>

              {/* Region Column */}
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chorągiew</p>
                  <p className="text-lg font-medium">{region}</p>
                </div>
              </div>

              {/* District Column */}
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hufiec</p>
                  <p className="text-lg font-medium">{district}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections (can be expanded as needed) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnia aktywność</CardTitle>
            <CardDescription>
              Najnowsze działania i aktualizacje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Członkostwo odnowione</p>
                  <p className="text-sm text-muted-foreground">2 dni temu</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Profil zaktualizowany</p>
                  <p className="text-sm text-muted-foreground">
                    1 tydzień temu
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status członkostwa</CardTitle>
            <CardDescription>Aktualny status i szczegóły</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-primary">Aktywny</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data odnowienia</span>
                <span>15 stycznia 2024</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Typ konta</span>
                <span>Członek ZHP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
