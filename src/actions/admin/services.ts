"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ServiceSchema = z.object({
    title: z.string().min(2, "Название должно быть не менее 2 символов"),
    description: z.string().optional(),
    price: z.number().int().positive("Цена должна быть положительной"),
    duration: z.number().int().positive("Длительность должна быть положительной"),
})

// Создание услуги
export async function createService(formData: z.infer<typeof ServiceSchema>) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        const validation = ServiceSchema.safeParse(formData)
        if (!validation.success) {
            return { error: validation.error.errors?.[0]?.message || "Ошибка валидации" }
        }

        await prisma.service.create({
        data: { ...validation.data },
    })

        revalidatePath("/admin/services")
        revalidatePath("/services")
        return { success: true, message: "Услуга добавлена" }
    } catch (error: any) {
        console.error("Create service error:", error)
        return { error: error?.message || "Ошибка при создании услуги" }
    }
}

// Обновление услуги
export async function updateService(id: string, formData: z.infer<typeof ServiceSchema>) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        const validation = ServiceSchema.safeParse(formData)
        if (!validation.success) {
            return { error: validation.error.errors?.[0]?.message || "Ошибка валидации" }
        }

        await prisma.service.update({
            where: { id },
            data: { ...validation.data },
    })

        revalidatePath("/admin/services")
        revalidatePath("/services")
        return { success: true, message: "Услуга обновлена" }
    } catch (error: any) {
        console.error("Update service error:", error)
        return { error: error?.message || "Ошибка при обновлении услуги" }
    }
}

// Удаление услуги
export async function deleteService(id: string) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        // Проверяем, есть ли записи на эту услугу
        const hasBookings = await prisma.booking.count({
            where: { serviceId: id },
        })

        if (hasBookings > 0) {
            return { error: "Нельзя удалить услугу с активными записями" }
        }

        await prisma.service.delete({
            where: { id },
        })

        revalidatePath("/admin/services")
        revalidatePath("/services")
        return { success: true, message: "Услуга удалена" }
    } catch (error: any) {
        console.error("Delete service error:", error)
        return { error: error?.message || "Ошибка при удалении услуги" }
    }
}