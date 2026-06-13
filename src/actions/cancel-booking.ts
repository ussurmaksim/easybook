"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function cancelBooking(bookingId: string) {
    await prisma.booking.update({
        where: { id: bookingId },
        data:{ status: "CANCELLED" },
})
    revalidatePath("/dashboard")
}