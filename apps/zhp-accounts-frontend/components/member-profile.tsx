'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from 'lucide-react';
import { ZhpMember } from '@/lib/zhp-member';

export default function MemberProfile({ member }: { member: ZhpMember }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activationStep, setActivationStep] = useState<
    'confirmation' | 'processing' | 'success' | 'failure'
  >('confirmation');
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Function to handle the activation process
  const handleActivation = () => {
    setActivationStep('processing');

    // Simulate processing time (5 seconds)
    setTimeout(() => {
      if (simulateFailure) {
        setActivationStep('failure');
      } else {
        setActivationStep('success');
      }
    }, 5000);
  };

  // Reset dialog state when closed
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset to confirmation step when dialog is closed
      setTimeout(() => {
        setActivationStep('confirmation');
      }, 300); // Small delay to avoid visual glitch during closing animation
    }
  };

  // Toggle between success and failure for demo purposes
  const toggleSimulateFailure = () => {
    setSimulateFailure(!simulateFailure);
  };

  const { name, surname, membershipNumber, region, district } = member;
  const email = 'b.kowalski@poczta.pl';
  const phone = '+48 555 123 567';
  const birthdate = 'Sty 15, 1995';

  const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

  const checks = [
    { name: 'Weryfikacja danych osobowych', status: 'success' },
    { name: 'Sprawdzenie płatności składek', status: 'success' },
    {
      name: 'Weryfikacja zgód RODO',
      status: simulateFailure ? 'error' : 'success',
    },
  ];

  return (
    <>
      {/* Header Section */}
      <div className="mb-6 rounded-lg bg-primary/5 p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={undefined} alt={`${name} ${surname}`} />
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

              <div className="flex items-center gap-2">
                {/* Toggle for demo purposes - would be removed in production */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSimulateFailure}
                  className="text-xs"
                >
                  {simulateFailure ? 'Symuluj sukces' : 'Symuluj błąd'}
                </Button>

                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                  <DialogTrigger asChild>
                    <Button size="lg">Aktywuj konto Microsoft</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    {activationStep === 'confirmation' && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Potwierdź aktywację</DialogTitle>
                          <DialogDescription>
                            Czy na pewno chcesz aktywować konto Microsoft dla{' '}
                            {name} {surname}?
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-0">
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="order-1 w-full sm:order-none sm:w-auto"
                          >
                            Anuluj
                          </Button>
                          <Button
                            onClick={handleActivation}
                            className="w-full sm:w-auto"
                          >
                            Potwierdź aktywację
                          </Button>
                        </DialogFooter>
                      </>
                    )}

                    {activationStep === 'processing' && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <DialogTitle className="mb-2 text-center">
                          Przetwarzanie...
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          Trwa aktywacja konta Microsoft dla {name} {surname}.
                        </DialogDescription>
                      </div>
                    )}

                    {activationStep === 'success' && (
                      <>
                        <div className="flex flex-col items-center justify-center py-6">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                          </div>
                          <DialogTitle className="mb-2 text-center">
                            Aktywacja zakończona
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Konto Microsoft dla {name} {surname} zostało
                            pomyślnie aktywowane.
                          </DialogDescription>
                        </div>

                        <div className="border-t py-4">
                          <h3 className="mb-3 font-medium">
                            Przeprowadzone kontrole:
                          </h3>
                          <ul className="space-y-3">
                            {checks.map((check, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>{check.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <DialogFooter>
                          <Button
                            onClick={() => setDialogOpen(false)}
                            className="w-full sm:w-auto"
                          >
                            Zamknij
                          </Button>
                        </DialogFooter>
                      </>
                    )}

                    {activationStep === 'failure' && (
                      <>
                        <div className="flex flex-col items-center justify-center py-6">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-10 w-10 text-red-600" />
                          </div>
                          <DialogTitle className="mb-2 text-center">
                            Aktywacja nieudana
                          </DialogTitle>
                          <DialogDescription className="text-center">
                            Wystąpił błąd podczas aktywacji konta Microsoft dla{' '}
                            {name} {surname}.
                          </DialogDescription>
                        </div>

                        <div className="border-t py-4">
                          <h3 className="mb-3 font-medium">Wyniki kontroli:</h3>
                          <ul className="space-y-3">
                            {checks.map((check, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                {check.status === 'success' ? (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span
                                  className={
                                    check.status === 'error'
                                      ? 'font-medium text-red-600'
                                      : ''
                                  }
                                >
                                  {check.name}
                                  {check.status === 'error' &&
                                    ' - Weryfikacja nieudana'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="order-1 w-full sm:order-none sm:w-auto"
                          >
                            Zamknij
                          </Button>
                          <Button
                            onClick={() => setActivationStep('confirmation')}
                            className="w-full sm:w-auto"
                          >
                            Spróbuj ponownie
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
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
                <Badge
                  className={
                    activationStep === 'success' ? 'bg-primary' : 'bg-gray-500'
                  }
                >
                  {activationStep === 'success' ? 'Aktywny' : 'Nieaktywny'}
                </Badge>
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
    </>
  );
}
