"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DeleteServiceButton({ serviceId, serviceName }: {
    serviceId: string
    serviceName: string
}) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Вы уверены, что хотите удалить услугу "${serviceName}"?`)) {
            return
        }

        setLoading(true)

        const { deleteService } = await import("@/actions/admin/services")
        await deleteService(serviceId)

        setLoading(false)
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={handleDelete}
            disabled={loading}
            title="Удалить"
        >
            {loading ? "⏳" : "🗑️"}
        </Button>
    )
}