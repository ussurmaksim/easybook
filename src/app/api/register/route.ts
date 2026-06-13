import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Валидация
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Все поля обязательны" },
                { status: 400 }
            );
        }

        // Проверка: есть ли уже пользователь
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Пользователь с таким email уже существует" },
                { status: 400 }
            );
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание пользователя
        const user = await prisma.user.create({
        data: {
            name,
                email,
                password: hashedPassword,
            role: "USER",
        },
    });

        return NextResponse.json(
            { success: true, userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Ошибка регистрации" },
            { status: 500 }
        );
    }
}