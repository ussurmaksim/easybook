"use server";

import { prisma } from "@/lib/prisma";

export async function seedServices() {
    const services = [
        { title: "💇 Стрижка женская", description: "Профессиональная стрижка любой сложности", price: 1500, duration: 60 },
        { title: "💇 Стрижка мужская", description: "Классическая или модельная стрижка", price: 1200, duration: 45 },
        { title: "💅 Маникюр классический", description: "Обработка ногтей, покрытие лаком", price: 1200, duration: 90 },
        { title: "💅 Маникюр с гель-лаком", description: "Стойкое покрытие на 2-3 недели", price: 1800, duration: 120 },
        { title: "🎨 Окрашивание волос", description: "Окрашивание в один тон", price: 3500, duration: 180 },
        { title: "✨ Мелирование", description: "Частичное или полное мелирование", price: 4500, duration: 240 },
    ];

    await prisma.service.createMany({
        data: services,
        skipDuplicates: true,
    });

    return { success: true, message: "Услуги добавлены!" };
}