import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

export default async function ReviewsPage() {
    const reviews = await prisma.review.findMany({
        where: { isApproved: true },
        include: {
            user: {
                select: { name: true },
            },
            service: {
                select: { title: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    // Считаем средний рейтинг
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0"

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-4">Отзывы клиентов</h1>
            <p className="text-center text-muted-foreground mb-8">
                Средний рейтинг: <span className="text-primary font-bold">⭐ {averageRating}</span> из 5
            </p>

            {reviews.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <p className="text-xl">Отзывов пока нет</p>
                        <p className="text-sm mt-2">Будьте первым, кто оставит отзыв!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{review.user.name || "Аноним"}</p>
                                        {review.service && (
                                            <p className="text-sm text-muted-foreground">
                                                Услуга: {review.service.title}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${
                                                    star <= review.rating
                                                        ? "fill-primary text-primary"
                                                        : "text-muted-foreground"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{review.comment}</p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}