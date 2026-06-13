import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { moderateReview, deleteReview } from "@/actions/reviews"
import { Star } from "lucide-react"

export default async function AdminReviewsPage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const reviews = await prisma.review.findMany({
        include: {
            user: { select: { name: true, email: true } },
            service: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    const pendingCount = reviews.filter((r) => !r.isApproved).length
    const approvedCount = reviews.filter((r) => r.isApproved).length

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Модерация отзывов</h1>
                    <p className="text-muted-foreground mt-1">
                        Одобрение и управление отзывами клиентов
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary">⏳ Ожидают: {pendingCount}</Badge>
                    <Badge variant="default">✅ Одобрено: {approvedCount}</Badge>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Все отзывы ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Клиент</TableHead>
                                <TableHead>Услуга</TableHead>
                                <TableHead>Рейтинг</TableHead>
                                <TableHead>Отзыв</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Дата</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{review.user.name || "Аноним"}</p>
                                            <p className="text-xs text-muted-foreground">{review.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{review.service?.title || "—"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= review.rating
                                                            ? "fill-primary text-primary"
                                                            : "text-muted-foreground"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate">
                                        {review.comment}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={review.isApproved ? "default" : "secondary"}>
                                            {review.isApproved ? "✅ Одобрен" : "⏳ На модерации"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {!review.isApproved && (
                                                <form action={async () => {
                                                    "use server"
                                                    await moderateReview(review.id, true)
                                                }}>
                                                    <Button variant="default" size="sm" type="submit">
                                                        ✔️
                                                    </Button>
                                                </form>
                                            )}
                                            <form action={async () => {
                                                "use server"
                                                await deleteReview(review.id)
                                            }}>
                                                <Button variant="destructive" size="sm" type="submit">
                                                    🗑️
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {reviews.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            Отзывов пока нет
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}