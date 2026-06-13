import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createService } from "@/actions/admin/services"
import Link from "next/link"

export default async function NewServicePage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/services">
                    <Button variant="outline">← Назад</Button>
                </Link>
                <h1 className="text-3xl font-bold">Добавить услугу</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Информация об услуге</CardTitle>
                </CardHeader>
                <CardContent>
                    <ServiceForm />
                </CardContent>
            </Card>
        </div>
    )
}

function ServiceForm() {
    return (
        <form action={async (formData) => {
            "use server"
            const result = await createService({
                title: formData.get("title") as string,
                description: formData.get("description") as string || undefined,
                price: Number(formData.get("price")),
                duration: Number(formData.get("duration")),
            })

            if (result.success) {
                redirect("/admin/services")
            }
            // В реальном проекте здесь можно показать ошибку через toast
        }} className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="title">Название услуги *</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="Стрижка женская"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Подробное описание услуги..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        placeholder="1500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="duration">Длительность (мин) *</Label>
                    <Input
                        id="duration"
                        name="duration"
                        type="number"
                        min="1"
                        placeholder="60"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">💾 Сохранить услугу</Button>
                <Link href="/admin/services" className="flex-1">
                    <Button variant="outline" className="w-full">Отмена</Button>
                </Link>
            </div>
        </form>
    )
}