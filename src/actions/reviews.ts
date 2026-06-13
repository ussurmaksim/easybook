"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10, "Отзыв должен быть не менее 10 символов"),
    serviceId: z.string().optional(),
})

const ApproveSchema = z.object({
    reviewId: z.string(),
    isApproved: z.boolean(),
})

// Создание отзыва
export async function createReview(formData: z.infer<typeof ReviewSchema>) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return { error: "Необходимо авторизоваться" }
        }

        const validation = ReviewSchema.safeParse(formData)
        if (!validation.success) {
            return { error: validation.error.errors?.[0]?.message || "Ошибка валидации" }
        }

        // ✅ ПРОВЕРКА 1: есть ли завершённая запись на эту услугу
        if (formData.serviceId) {
            const hasCompletedBooking = await prisma.booking.findFirst({
                where: {
                    userId: session.user.id,
                    serviceId: formData.serviceId,
                    status: "CONFIRMED",
                    date: { lt: new Date() },
                },
            })

            if (!hasCompletedBooking) {
                return { error: "Вы можете оставить отзыв только после завершения услуги" }
            }

            // ✅ ПРОВЕРКА 2: нет ли уже отзыва от этого пользователя на эту услугу
            const existingReview = await prisma.review.findFirst({
                where: {
                    userId: session.user.id,
                    serviceId: formData.serviceId,
                },
            })

            if (existingReview) {
                return { error: "Вы уже оставляли отзыв на эту услугу" }
            }
        }

        await prisma.review.create({
            data: {
                rating: formData.rating,
                    comment: formData.comment,
                userId: session.user.id,
                serviceId: formData.serviceId,
                isApproved: false,
            },
        })

        revalidatePath("/reviews")
        revalidatePath("/services")
        return { success: true, message: "Отзыв отправлен на модерацию" }
    } catch (error: any) {
        console.error("Create review error:", error)
        return { error: error?.message || "Ошибка при создании отзыва" }
    }
}

// Одобрение/отклонение отзыва (админ)
export async function moderateReview(reviewId: string, isApproved: boolean) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        await prisma.review.update({
            where: { id: reviewId },
            data: { isApproved },
    })

        revalidatePath("/admin/reviews")
        revalidatePath("/reviews")
        return { success: true, message: isApproved ? "Отзыв одобрен" : "Отзыв отклонён" }
    } catch (error: any) {
        console.error("Moderate review error:", error)
        return { error: error?.message || "Ошибка при модерации" }
    }
}

// Удаление отзыва
export async function deleteReview(reviewId: string) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "Доступ запрещён" }
        }

        await prisma.review.delete({
            where: { id: reviewId },
        })

        revalidatePath("/admin/reviews")
        revalidatePath("/reviews")
        return { success: true, message: "Отзыв удалён" }
    } catch (error: any) {
        console.error("Delete review error:", error)
        return { error: error?.message || "Ошибка при удалении отзыва" }
    }
}

// Получение одобренных отзывов
export async function getApprovedReviews(serviceId?: string) {
    return await prisma.review.findMany({
        where: {
            isApproved: true,
            serviceId: serviceId || undefined,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            service: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    })
}

// Получение всех отзывов для админки
export async function getAllReviews() {
    return await prisma.review.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            service: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    })
}