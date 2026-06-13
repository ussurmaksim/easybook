"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function DeleteUserButton({ userId, userEmail, disabled }: {
    userId: string
    userEmail: string
    disabled?: boolean
}) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Удалить пользователя ${userEmail}?`)) {
            return
        }

        setLoading(true)

        const { deleteUser } = await import("@/actions/admin/users")
        const result = await deleteUser(userId)

        setLoading(false)

        // ✅ Показываем результат пользователю
        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            toast.success("Пользователь удалён")
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={handleDelete}
            disabled={disabled || loading}
            title="Удалить"
        >
            {loading ? "⏳" : "🗑️"}
        </Button>
    )
}