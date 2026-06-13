import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// Server Action для быстрого изменения статуса
async function updateBookingStatus(bookingId: string, newStatus: "CONFIRMED" | "PENDING" | "CANCELLED") {
    "use server";
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
    });
    revalidatePath("/admin");
}

export default async function AdminDashboardPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    // Получаем всю статистику параллельно
    const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalUsers,
        totalMasters,
        totalServices,
        totalReviews,
        pendingReviews,
        recentBookings
    ] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.booking.count({ where: { status: "CONFIRMED" } }),
        prisma.user.count(),
        prisma.master.count(),
        prisma.service.count(),
        prisma.review.count(),
        prisma.review.count({ where: { isApproved: false } }),
        prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                service: true,
                master: true,
            },
        }),
    ]);

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Панель администратора</h1>
                    <p className="text-muted-foreground mt-1">
                        Добро пожаловать, {session.user.name || session.user.email}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard">
                        <Button variant="outline">👤 Личный кабинет</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost">🏠 На сайт</Button>
                    </Link>
                </div>
            </div>

            {/* Карточки статистики */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего записей</CardTitle>
                        <span className="text-2xl">📅</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingBookings} ожидают подтверждения
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Подтверждено</CardTitle>
                        <span className="text-2xl">✅</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            Активных записей
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                        <span className="text-2xl">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <Link href="/admin/users">
                            <p className="text-xs text-primary hover:underline cursor-pointer">
                                Управление →
                            </p>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Мастера</CardTitle>
                        <span className="text-2xl">👨‍🎨</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMasters}</div>
                        <Link href="/admin/masters">
                            <p className="text-xs text-primary hover:underline cursor-pointer">
                                Управление →
                            </p>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Дополнительные карточки (услуги и отзывы) */}
            <div className="grid gap-4 md:grid-cols-2 mb-8">
                <Card className="hover:shadow-md transition">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Услуги</p>
                                <h3 className="text-lg font-bold">{totalServices} услуг</h3>
                            </div>
                            <Link href="/admin/services">
                                <Button variant="outline" size="sm">✏️ Управление</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Отзывы</p>
                                <h3 className="text-lg font-bold">
                                    {totalReviews} всего / {pendingReviews} на модерации
                                </h3>
                            </div>
                            <Link href="/admin/reviews">
                                <Button variant="outline" size="sm">⭐ Модерация</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Последние записи */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Последние записи</CardTitle>
                        <Link href="/admin/bookings">
                            <Button variant="ghost" size="sm">Показать все →</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Клиент</TableHead>
                                <TableHead>Услуга</TableHead>
                                <TableHead>Мастер</TableHead>
                                <TableHead>Дата/время</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{booking.user.name || "Гость"}</p>
                                            <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{booking.service.title}</TableCell>
                                    <TableCell>{booking.master?.name || "—"}</TableCell>
                                    <TableCell>{formatDate(booking.date)}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            booking.status === "CONFIRMED" ? "default" :
                                                booking.status === "CANCELLED" ? "destructive" : "secondary"
                                        }>
                                            {booking.status === "CONFIRMED" ? "✅ Подтверждено" :
                                                booking.status === "CANCELLED" ? "❌ Отменено" : "⏳ Ожидает"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {booking.status === "PENDING" && (
                                            <form action={async () => {
                                                "use server";
                                                await updateBookingStatus(booking.id, "CONFIRMED");
                                            }}>
                                                <Button variant="outline" size="sm" type="submit">
                                                    ✔️ Подтвердить
                                                </Button>
                                            </form>
                                        )}
                                        {booking.status === "CONFIRMED" && (
                                            <form action={async () => {
                                                "use server";
                                                await updateBookingStatus(booking.id, "PENDING");
                                            }}>
                                                <Button variant="ghost" size="sm" type="submit">
                                                    ↩️ Вернуть
                                                </Button>
                                            </form>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {recentBookings.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            Записей пока нет
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Быстрые ссылки на все разделы */}
            <div className="grid gap-4 md:grid-cols-3 mt-8">
                <Link href="/admin/users">
                    <Card className="hover:shadow-md transition cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <span className="text-3xl">👥</span>
                                <h3 className="font-bold mt-2">Пользователи</h3>
                                <p className="text-sm text-muted-foreground">Управление аккаунтами</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/services">
                    <Card className="hover:shadow-md transition cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <span className="text-3xl">✂️</span>
                                <h3 className="font-bold mt-2">Услуги</h3>
                                <p className="text-sm text-muted-foreground">Цены и описание</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/reviews">
                    <Card className="hover:shadow-md transition cursor-pointer">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <span className="text-3xl">⭐</span>
                                <h3 className="font-bold mt-2">Отзывы</h3>
                                <p className="text-sm text-muted-foreground">{pendingReviews} ждут модерации</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}