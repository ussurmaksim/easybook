"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cancelBooking } from "@/actions/cancel-booking"

export function CancelBooking({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false)

    const handleCancel = async () => {
        setLoading(true)
        await cancelBooking(bookingId)
        setLoading(false)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
        >
            {loading ? "⏳ Отмена..." : "Отменить"}
        </Button>
    )
}