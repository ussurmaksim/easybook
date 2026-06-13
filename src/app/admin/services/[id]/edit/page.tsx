import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateService } from "@/actions/admin/services"
import Link from "next/link"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await params

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const service = await prisma.service.findUnique({
        where: { id },
    })

    if (!service) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/services">
                    <Button variant="outline">← Назад</Button>
                </Link>
                <h1 className="text-3xl font-bold">Редактировать услугу</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ServiceEditForm service={service} />
                </CardContent>
            </Card>
        </div>
    )
}

function ServiceEditForm({ service }: { service: any }) {
    return (
        <form action={async (formData) => {
            "use server"
            const result = await updateService(service.id, {
                title: formData.get("title") as string,
                description: formData.get("description") as string || undefined,
                price: Number(formData.get("price")),
                duration: Number(formData.get("duration")),
            })

            if (result.success) {
                redirect("/admin/services")
            }
        }} className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="title">Название услуги *</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={service.title}
                    placeholder="Стрижка женская"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={service.description || ""}
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
                        defaultValue={service.price}
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
                        defaultValue={service.duration}
                        placeholder="60"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">💾 Сохранить изменения</Button>
                <Link href="/admin/services" className="flex-1">
                    <Button variant="outline" className="w-full">Отмена</Button>
                </Link>
            </div>
        </form>
    )
}