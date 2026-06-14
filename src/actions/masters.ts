"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveMasters() {
    try {
        const masters = await prisma.master.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return masters;
    } catch (error) {
        console.error("Error fetching masters:", error);
        return [];
    }
}