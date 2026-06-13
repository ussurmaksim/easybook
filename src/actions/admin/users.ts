"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const UserSchema = z.object({
    name: z.string().min(2, "Имя должно быть не менее 2 символов"),
    email: z.string().email("Некорректный email"),
    phone: z.string().optional(),
    role: z.enum(["USER", "ADMIN"]),
})

const PasswordSchema = z.object({
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
})

// Получение всех пользователей
export async function getAllUsers() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Доступ запрещён")
    }

    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            bookings: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    })
}

// Обновление данных пользователя
export async function updateUser(id: string, formData: z.infer<typeof UserSchema>) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        // Нельзя удалить админ-роль у последнего админа
        if (formData.role === "USER") {
            const adminCount = await prisma.user.count({
                where: { role: "ADMIN" },
            })
            if (adminCount <= 1) {
                return { error: "Должен остаться хотя бы один администратор" }
            }
        }

        // Проверка: не занят ли email другим пользователем
        const existing = await prisma.user.findFirst({
            where: {
                email: formData.email,
                id: { not: id },
            },
        })

        if (existing) {
            return { error: "Этот email уже зарегистрирован" }
        }

        await prisma.user.update({
            where: { id },
            data: {
                name: formData.name,
                    email: formData.email,
                phone: formData.phone,
                role: formData.role,
            },
    })

        revalidatePath("/admin/users")
        return { success: true, message: "Пользователь обновлён" }
    } catch (error: any) {
        console.error("Update user error:", error)
        return { error: error?.message || "Ошибка при обновлении пользователя" }
    }
}

// Смена пароля пользователя
export async function changeUserPassword(id: string, formData: z.infer<typeof PasswordSchema>) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        const validation = PasswordSchema.safeParse(formData)
        if (!validation.success) {
            return { error: validation.error.errors?.[0]?.message || "Ошибка валидации" }
        }

        const hashedPassword = await bcrypt.hash(formData.password, 10)

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        })

        return { success: true, message: "Пароль изменён" }
    } catch (error: any) {
        console.error("Change password error:", error)
        return { error: error?.message || "Ошибка при смене пароля" }
    }
}

// Удаление пользователя
// Удаление пользователя
export async function deleteUser(id: string) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        // Нельзя удалить себя
        if (id === session.user.id) {
            return { error: "Нельзя удалить свой аккаунт" }
        }

        // Проверяем, есть ли записи у пользователя
        const hasBookings = await prisma.booking.count({
            where: { userId: id },
        })

        if (hasBookings > 0) {
            // ✅ Вариант 1: Показываем понятную ошибку
            return {
                error: `У пользователя есть записей: ${hasBookings}. Сначала удалите или перенесите их.`
            }

            // ✅ Вариант 2 (альтернатива): Удаляем записи каскадом
            // Раскомментируй этот код, если хочешь удалять с записями:
            /*
            await prisma.booking.deleteMany({
              where: { userId: id },
            })
            */
        }

        await prisma.user.delete({
            where: { id },
        })

        revalidatePath("/admin/users")
        return { success: true, message: "Пользователь удалён" }
    } catch (error: any) {
        console.error("Delete user error:", error)
        return { error: error?.message || "Ошибка при удалении пользователя" }
    }
}