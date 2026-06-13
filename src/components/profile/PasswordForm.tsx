"use client"

import { useState } from "react"
import { changePassword } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PasswordForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const result = await changePassword(formData)

        setLoading(false)

        if (result.error) {
            setMessage({ type: "error", text: result.error })
        } else if (result.success) {
            setMessage({ type: "success", text: result.message || "Пароль изменён" })
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>

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

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Изменение..." : "Изменить пароль"}
            </Button>
        </form>
    )
}