"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const MasterSchema = z.object({
    name: z.string().min(2, "Имя обязательно"),
    specialization: z.string().min(2, "Специализация обязательна"),
    description: z.string().optional(),
    photoUrl: z.string().url("Некорректный URL").optional().or(z.literal("")),
    isActive: z.boolean().default(true),
})

// Создание мастера
export async function createMaster(formData: z.infer<typeof MasterSchema>) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        const validation = MasterSchema.safeParse(formData)
        if (!validation.success) {
            return { error: validation.error.issues?.[0]?.message || "Ошибка валидации" }
        }

        await prisma.master.create({
            data: { ...validation.data },
        })

        revalidatePath("/admin/masters")
        return { success: true, message: "Мастер добавлен" }
    } catch (error: any) {
        console.error("Create master error:", error)
        return { error: error?.message || "Ошибка при создании мастера" }
    }
}

// Обновление мастера
export async function updateMaster(id: string, formData: z.infer<typeof MasterSchema>) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        const validation = MasterSchema.safeParse(formData)
        if (!validation.success) {
            return { error: validation.error.issues?.[0]?.message || "Ошибка валидации" }
        }

        await prisma.master.update({
            where: { id },
            data: { ...validation.data },
    })

        revalidatePath("/admin/masters")
        return { success: true, message: "Мастер обновлён" }
    } catch (error: any) {
        console.error("Update master error:", error)
        return { error: error?.message || "Ошибка при обновлении мастера" }
    }
}

// Удаление мастера
export async function deleteMaster(id: string) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        // Проверяем, есть ли записи у мастера
        const hasBookings = await prisma.booking.count({
            where: { masterId: id },
        })

        if (hasBookings > 0) {
            return { error: "Нельзя удалить мастера с активными записями" }
        }

        await prisma.master.delete({
            where: { id },
        })

        revalidatePath("/admin/masters")
        return { success: true, message: "Мастер удалён" }
    } catch (error: any) {
        console.error("Delete master error:", error)
        return { error: error?.message || "Ошибка при удалении мастера" }
    }
}

// Получение всех мастеров
export async function getMasters() {
    return await prisma.master.findMany({
        orderBy: { name: "asc" },
    })
}