import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ś/g, 's')
    .replace(/[ćç]/g, 'c')
    .replace(/[ęèéêë]/g, 'e')
    .replace(/[óòôõöø]/g, 'o')
    .replace(/[źż]/g, 'z');
