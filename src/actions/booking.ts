"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Схема валидации
const BookingSchema = z.object({
    serviceId: z.string().min(1, "Услуга обязательна"),
    masterId: z.string().min(1, "Мастер обязателен"),
    date: z.string().min(1, "Дата обязательна"),
    timeSlot: z.string().min(1, "Время обязательно"),
    name: z.string().min(2, "Имя должно быть не менее 2 символов"),
    phone: z.string().min(10, "Введите корректный телефон"),
    email: z.string().email().optional().or(z.literal("")),
    comment: z.string().optional(),
});

export async function createBooking(formData: z.infer<typeof BookingSchema>) {
    try {
        const validation = BookingSchema.safeParse(formData);
        if (!validation.success) {
            return { error: validation.error.issues?.[0]?.message || "Ошибка валидации" }
        }

        const { serviceId, masterId, date, timeSlot, name, phone, email, comment } = validation.data;

        const bookingDateTime = new Date(`${date}T${timeSlot}:00`);

        // Проверка на занятость
        const existing = await prisma.booking.findFirst({
            where: {
                date: bookingDateTime,
                serviceId: serviceId,
                status: { not: "CANCELLED" },
            },
        });

        if (existing) {
            return { error: "Это время уже занято. Выберите другое." };
        }

        // Получаем пользователя
        const session = await auth();
        let userId = session?.user?.id;

        if (!userId) {
            const guest = await prisma.user.create({
            data: {
                email: `guest_${Date.now()}@temp.com`,
                    name: name,
            },
        });
            userId = guest.id;
        }

        // Создаём запись
        await prisma.booking.create({
        data: {
            date: bookingDateTime,
                status: "PENDING",
            userId: userId,
            serviceId: serviceId,
        },
    });

        // ✅ Обновляем кэш всех страниц
        revalidatePath("/admin");
        revalidatePath("/dashboard");
        revalidatePath("/booking");
        revalidatePath("/services");

        return { success: true, message: "Вы успешно записаны!" };
    } catch (error) {
        console.error("Booking error:", error);
        return { error: "Произошла ошибка. Попробуйте позже." };
    }
}