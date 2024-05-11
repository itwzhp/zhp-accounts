'use client';

import clsx from 'clsx';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikProps,
} from 'formik';
import { ComponentProps, PropsWithChildren, useState } from 'react';
import { z } from 'zod';

interface CreateAccount {
  consents: { rodo: boolean; ageGT13: boolean };
  firstName: string;
  lastName: string;
  membershipNumber: string;
  privateEmail: string;
}

const MEMBERSHIP_NUMBER_REGEX = /^[A-Za-z]{2}[0-9]{9}$/;

const AccountSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane.'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane.'),
  membershipNumber: z
    .string()
    .min(1, 'Numer ewidencyjny jest wymagany.')
    .regex(MEMBERSHIP_NUMBER_REGEX, 'Numer ewidencyjny jest niepoprawny.'),
  privateEmail: z
    .string({ required_error: 'E-mail jest wymagany.' })
    .email('Niepoprawny adres email.'),
});

export default function CreateAccountPage() {
  return (
    <main className="container mx-auto px-4">
      <div className="my-12 flex flex-col">
        <div className="prose max-w-none pb-12">
          <h1>Aktywacja konta Microsoft 365 w ZHP</h1>

          <p>
            Związek Harcerstwa Polskiego daje możliwość bezpłatnego korzystania
            z pakietu Microsoft 365, w tym poczty ZHP, każdemu członkowi
            organizacji.
          </p>
        </div>

        <Formik
          initialValues={{
            consents: { rodo: false, ageGT13: false },
            firstName: '',
            lastName: '',
            membershipNumber: '',
            privateEmail: '',
          }}
          validateOnChange={true}
          validate={(values) => {
            const validation = AccountSchema.safeParse(values);

            if (!validation.success) {
              const errors = validation.error.flatten().fieldErrors;

              return Object.entries(errors).reduce<any>(
                (acc, [field, messages]) => {
                  acc[field] = messages[0];
                  return acc;
                },
                {},
              );
            }

            return {};
          }}
          onSubmit={(values, helpers) => {
            setTimeout(() => {
              console.log(values);
              helpers.setSubmitting(false);
            }, 5000);
          }}
        >
          {(formik: FormikProps<CreateAccount>) => (
            <form
              className="relative flex flex-col gap-2"
              onSubmit={formik.handleSubmit}
            >
              <Consent
                label="Mam zaznaczone wymagane zgody RODO w systemie Tipi."
                name="consents.rodo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.consents.rodo}
                required
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                commodi porro, ullam nam vitae perferendis id? Quasi quia
                impedit a numquam quidem! Harum animi ab illo tenetur officia
                perferendis! Nam.
              </Consent>

              <Consent
                label="Mam co najmniej 13 lat LUB mam zaznaczoną w systemie Tipi zgodę na utworzenie konta Microsoft 365 dla osoby poniżej 13 roku życia."
                name="consents.ageGT13"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.consents.ageGT13}
                required
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                commodi porro, ullam nam vitae perferendis id? Quasi quia
                impedit a numquam quidem! Harum animi ab illo tenetur officia
                perferendis! Nam.
              </Consent>

              <div className="mt-4 flex flex-col items-center gap-2">
                <label className="form-control w-full max-w-md">
                  <div className="label">
                    <span className="label-text">Imię</span>
                  </div>
                  <Field
                    type="text"
                    name="firstName"
                    className={clsx('input input-bordered w-full max-w-md', {
                      'border-error':
                        formik.touched.firstName && formik.errors.firstName,
                    })}
                    required
                  />
                  <div className="label flex-col items-start">
                    <ErrorMessage name="firstName">
                      {(error) => (
                        <div className="label-text-alt text-error">{error}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </label>

                <label className="form-control w-full max-w-md">
                  <div className="label">
                    <span className="label-text">Nazwisko</span>
                  </div>
                  <Field
                    type="text"
                    name="lastName"
                    className={clsx('input input-bordered w-full max-w-md', {
                      'border-error':
                        formik.touched.lastName && formik.errors.lastName,
                    })}
                    required
                  />
                  <div className="label flex-col items-start">
                    <ErrorMessage name="lastName">
                      {(error) => (
                        <div className="label-text-alt text-error">{error}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </label>

                <label className="form-control w-full max-w-md">
                  <div className="label">
                    <span className="label-text">Numer ewidencyjny</span>
                  </div>
                  <Field
                    type="text"
                    name="membershipNumber"
                    className={clsx('input input-bordered w-full max-w-md', {
                      'border-error':
                        formik.touched.membershipNumber &&
                        formik.errors.membershipNumber,
                    })}
                    pattern="^[A-Za-z]{2}[0-9]{9}$"
                    required
                  />
                  <div className="label flex-col items-start">
                    <div className="label-text-alt">AM123456789</div>
                    <ErrorMessage name="membershipNumber">
                      {(error) => (
                        <div className="label-text-alt text-error">{error}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </label>

                <label className="form-control w-full max-w-md">
                  <div className="label">
                    <span className="label-text">Prywatny adres e-mail</span>
                  </div>
                  <Field
                    type="email"
                    name="privateEmail"
                    className={clsx('input input-bordered w-full max-w-md', {
                      'border-error':
                        formik.touched.privateEmail &&
                        formik.errors.privateEmail,
                    })}
                    required
                  />
                  <div className="label">
                    <ErrorMessage name="privateEmail">
                      {(error) => (
                        <div className="label-text-alt text-error">{error}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </label>

                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <button
                    type="submit"
                    className={clsx('btn btn-primary btn-wide', {
                      'btn-disabled': formik.isSubmitting,
                    })}
                  >
                    {formik.isSubmitting && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Aktywuj konto ZHP
                  </button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </main>
  );
}

function Consent({
  label,
  children,
  ...inputProps
}: PropsWithChildren<{ label: string } & ComponentProps<'input'>>) {
  return (
    <div className="w-full">
      <div className="form-control">
        <label className="label cursor-pointer justify-start">
          <input
            type="checkbox"
            className="checkbox-primary checkbox mr-3"
            {...inputProps}
          />
          <span className="label-text text-lg">{label}</span>
        </label>
      </div>

      <div
        className={clsx(
          'ml-10 grid transition-[grid-template-rows]',
          inputProps.value ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
