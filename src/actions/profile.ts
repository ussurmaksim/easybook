"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Схема валидации
const ProfileSchema = z.object({
    name: z.string().min(2, "Имя должно быть не менее 2 символов"),
    email: z.string().email("Некорректный email"),
    phone: z.string().min(10, "Введите корректный телефон"),
})

const PasswordSchema = z.object({
    currentPassword: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    newPassword: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string().min(6, "Пароль должен быть не менее 6 символов"),
})

// Обновление данных профиля
export async function updateProfile(formData: z.infer<typeof ProfileSchema>) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return { error: "Необходимо авторизоваться" }
        }

        const validation = ProfileSchema.safeParse(formData)

        if (!validation.success) {
            // ✅ Безопасное получение первой ошибки
            const firstError = validation.error.errors?.[0]
            return { error: firstError?.message || "Ошибка валидации данных" }
        }

        // Проверка: не занят ли email другим пользователем
        const existing = await prisma.user.findFirst({
            where: {
                email: formData.email,
                id: { not: session.user.id },
            },
        })

        if (existing) {
            return { error: "Этот email уже зарегистрирован" }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: formData.name,
                    email: formData.email,
                phone: formData.phone,
            },
    })

        revalidatePath("/profile")
        revalidatePath("/dashboard")

        return { success: true, message: "Профиль обновлён" }
    } catch (error: any) {
        console.error("Profile update error:", error)
        // ✅ Возвращаем понятное сообщение вместо падения
        return { error: error?.message || "Произошла ошибка при обновлении профиля" }
    }
}

// Смена пароля
export async function changePassword(formData: z.infer<typeof PasswordSchema>) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return { error: "Необходимо авторизоваться" }
        }

        const validation = PasswordSchema.safeParse(formData)

        if (!validation.success) {
            const firstError = validation.error.errors?.[0]
            return { error: firstError?.message || "Ошибка валидации пароля" }
        }

        if (formData.newPassword !== formData.confirmPassword) {
            return { error: "Новые пароли не совпадают" }
        }

        // Получаем пользователя
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!user?.password) {
            return { error: "У вас нет пароля (возможно, вход через соцсеть)" }
        }

        // Проверяем текущий пароль
        const isPasswordValid = await bcrypt.compare(
            formData.currentPassword,
            user.password
        )

        if (!isPasswordValid) {
            return { error: "Неверный текущий пароль" }
        }

        // Хешируем новый пароль
        const hashedPassword = await bcrypt.hash(formData.newPassword, 10)

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
    })

        return { success: true, message: "Пароль изменён" }
    } catch (error) {
        console.error("Password change error:", error)
        return { error: "Произошла ошибка при смене пароля" }
    }
}