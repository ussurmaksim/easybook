"use client"

import { useState } from "react"
import { updateProfile } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@prisma/client"

interface ProfileFormProps {
    user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const result = await updateProfile(formData)

        setLoading(false)

        if (result.error) {
            setMessage({ type: "error", text: result.error })
        } else if (result.success) {
            setMessage({ type: "success", text: result.message || "Профиль обновлён" })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`p-3 rounded text-sm ${
                        message.type === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-destructive/10 text-destructive"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ваше имя"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.ru"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
        </form>
    )
}