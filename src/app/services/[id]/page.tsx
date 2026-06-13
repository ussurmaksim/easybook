import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Banknote, User } from "lucide-react";
import Link from "next/link";
import ReviewForm from "@/components/services/ReviewForm";

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    // Получаем услугу с мастерами и отзывами
    const service = await prisma.service.findUnique({
        where: { id },
        include: {
            masters: {
                where: { isActive: true },
            },
            reviews: {
                where: { isApproved: true },
                include: {
                    user: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!service) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">❌ Услуга не найдена</h1>
                <Link href="/services">
                    <Button>← Вернуться к услугам</Button>
                </Link>
            </div>
        );
    }

    // Считаем средний рейтинг
    const averageRating = service.reviews.length > 0
        ? (service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length).toFixed(1)
        : "0";

    // Проверяем права пользователя для отзыва
    let canLeaveReview = false;
    let hasAlreadyReviewed = false;

    if (session?.user?.id) {
        // 1. Проверяем завершённую запись
        const completedBooking = await prisma.booking.findFirst({
            where: {
                userId: session.user.id,
                serviceId: id,
                status: "CONFIRMED",
                date: { lt: new Date() },
            },
        });

        // 2. Проверяем существующий отзыв
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: session.user.id,
                serviceId: id,
            },
        });

        canLeaveReview = !!completedBooking;
        hasAlreadyReviewed = !!existingReview;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Link href="/services">
                <Button variant="outline" className="mb-6">← Назад к услугам</Button>
            </Link>

            {/* Заголовок и основная информация */}
            <Card className="mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-8">
                    <h1 className="text-4xl font-bold mb-2">{service.title}</h1>
                    <div className="flex items-center gap-4 flex-wrap mt-4">
                        <div className="flex items-center gap-2">
                            <Banknote  className="w-5 h-5 text-primary" />
                            <span className="text-2xl font-bold text-primary">{service.price} ₽</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <span className="text-lg">{service.duration} минут</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-primary text-primary" />
                            <span className="text-lg font-bold">{averageRating}</span>
                            <span className="text-muted-foreground">({service.reviews.length} отзывов)</span>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8">
                    <h2 className="text-xl font-bold mb-4">📋 Описание услуги</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {service.description || "Описание отсутствует"}
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Link href={`/booking?serviceId=${service.id}`}>
                            <Button size="lg" className="px-8">
                                📅 Записаться на услугу
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Мастера, которые выполняют эту услугу */}
            {service.masters.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Мастера услуги ({service.masters.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {service.masters.map((master) => (
                                <Card key={master.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            {master.photoUrl ? (
                                                <img
                                                    src={master.photoUrl}
                                                    alt={master.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                                    👨‍🎨
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold">{master.name}</p>
                                                <p className="text-sm text-primary">{master.specialization}</p>
                                                <Badge variant="secondary" className="mt-1">
                                                    ✅ Активен
                                                </Badge>
                                            </div>
                                        </div>
                                        {master.description && (
                                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                                {master.description}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Форма отзыва (с проверками) */}
            {session?.user ? (
                hasAlreadyReviewed ? (
                    /* ✅ Уже есть отзыв */
                    <Card className="mb-8 bg-primary/10 border-primary/50">
                        <CardContent className="py-6">
                            <div className="text-center">
                                <p className="text-lg mb-2">✅ Вы уже оставили отзыв</p>
                                <p className="text-sm text-muted-foreground">
                                    Спасибо за ваш отзыв! Он появится после модерации.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : canLeaveReview ? (
                    /* ✅ Может оставить отзыв */
                    <Card className="mb-8 border-primary/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-6 h-6 fill-primary text-primary" />
                                Оставить отзыв об услуге
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReviewForm serviceId={service.id} />
                            <p className="text-xs text-muted-foreground mt-4">
                                ✅ У вас есть завершённая запись на эту услугу
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    /* ❌ Нет завершённой записи */
                    <Card className="mb-8 bg-muted/50">
                        <CardContent className="py-6">
                            <div className="text-center text-muted-foreground">
                                <p className="text-lg mb-2">🔒 Отзыв могут оставить только клиенты</p>
                                <p className="text-sm">
                                    Вы ещё не завершали запись на эту услугу. После посещения салона вы сможете оставить отзыв.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )
            ) : (
                /* ❌ Не авторизован */
                <Card className="mb-8 bg-muted/50">
                    <CardContent className="py-6">
                        <div className="text-center text-muted-foreground">
                            <p className="text-lg mb-2">🔐 Авторизация требуется</p>
                            <p className="text-sm mb-4">
                                Чтобы оставить отзыв, необходимо войти в аккаунт
                            </p>
                            <Link href="/login">
                                <Button variant="outline">Войти в аккаунт</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Отзывы клиентов */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-primary text-primary" />
                        Отзывы клиентов ({service.reviews.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {service.reviews.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-4xl mb-4">💬</p>
                            <p className="text-lg">Отзывов об этой услуге пока нет</p>
                            <p className="text-sm mt-2">Будьте первым, кто оставит отзыв!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {service.reviews.map((review) => (
                                <Card key={review.id} className="bg-muted/30">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                                    👤
                                                </div>
                                                <div>
                                                    <p className="font-medium">{review.user.name || "Аноним"}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
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
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}