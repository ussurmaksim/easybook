"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, Status } from "@prisma/client";

function SubmitButton({ status }: { status: Status }) {
    const { pending } = useFormStatus();

    return (
        <Button
            variant="outline"
            size="sm"
            type="submit"
            disabled={pending}
        >
            {pending ? (
                <>
                    <span className="animate-spin mr-2">⏳</span>
                    Обработка...
                </>
            ) : (
                status === "PENDING" ? "Подтвердить" : "Снять"
            )}
        </Button>
    );
}

export function BookingActions({ booking, updateStatus }: {
    booking: Booking & { user: any; service: any },
    updateStatus: (id: string, newStatus: Status) => Promise<void>
}) {
    return (
        <form action={async () => {
            const newStatus = booking.status === "PENDING" ? "CONFIRMED" : "PENDING";
            await updateStatus(booking.id, newStatus);
        }}>
            <SubmitButton status={booking.status} />
        </form>
    );
}