import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createMaster } from "@/actions/admin/masters"
import Link from "next/link"

export default async function NewMasterPage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/masters">
                    <Button variant="outline">← Назад</Button>
                </Link>
                <h1 className="text-3xl font-bold">Добавить мастера</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Информация о мастере</CardTitle>
                </CardHeader>
                <CardContent>
                    <MasterForm />
                </CardContent>
            </Card>
        </div>
    )
}

// Клиентский компонент формы
function MasterForm() {
    return (
        <form action={async (formData) => {
            "use server"
            const result = await createMaster({
                name: formData.get("name") as string,
                specialization: formData.get("specialization") as string,
                description: formData.get("description") as string || undefined,
                photoUrl: formData.get("photoUrl") as string || undefined,
                isActive: formData.get("isActive") === "on",
            })

            if (result.success) {
                redirect("/admin/masters")
            }
            // В реальном проекте здесь можно показать ошибку
        }} className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="name">Имя мастера *</Label>
                <Input id="name" name="name" placeholder="Иванова Анна" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="specialization">Специализация *</Label>
                <Input id="specialization" name="specialization" placeholder="Парикмахер-стилист" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Опыт работы, достижения, особенности..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="photoUrl">Фото (URL)</Label>
                <Input id="photoUrl" name="photoUrl" type="url" placeholder="https://example.com/photo.jpg" />
                <p className="text-xs text-muted-foreground">
                    Ссылка на изображение мастера (опционально)
                </p>
            </div>

            <div className="flex items-center gap-3 py-2">
                <Switch id="isActive" name="isActive" defaultChecked />
                <Label htmlFor="isActive">Мастер активен</Label>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">💾 Сохранить мастера</Button>
                <Link href="/admin/masters" className="flex-1">
                    <Button variant="outline" className="w-full">Отмена</Button>
                </Link>
            </div>
        </form>
    )
}