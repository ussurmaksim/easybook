import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Функция для объединения классов (нужна для Shadcn)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Функция форматирования даты (для отображения в русском формате)
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Простая функция для форматирования только времени
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Простая функция для форматирования только даты
export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}