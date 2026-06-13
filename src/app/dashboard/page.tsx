import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {CancelBooking} from "@/components/dashboard/CancelBooking";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Получаем записи пользователя
    const bookings = await prisma.booking.findMany({
        where: { userId: session.user.id },
        include: { service: true },
        orderBy: { date: "desc" },
    });

    // Разделяем на активные и прошедшие
    const now = new Date();
    const activeBookings = bookings.filter((b) =>
        b.date >= now && b.status !== "CANCELLED"
    );
    const pastBookings = bookings.filter((b) => b.date < now || b.status === "CANCELLED");

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Личный кабинет</h1>
                <div className="text-muted-foreground">
                    👋 {session.user.name || session.user.email}
                </div>
            </div>

            {/* Активные записи */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Предстоящие записи</h2>

                {activeBookings.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>У вас пока нет активных записей</p>
                            <Link href="/services">
                                <Button className="mt-4">Записаться на услугу</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {activeBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{booking.service.title}</h3>
                                            <p className="text-muted-foreground">
                                                📅 {formatDate(booking.date)}
                                            </p>
                                            <p className="text-muted-foreground">
                                                💰 {booking.service.price} ₽
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                                                {booking.status === "CONFIRMED" ? "✅ Подтверждено" : "⏳ Ожидает"}
                                            </Badge>
                                            {booking.status !== "CANCELLED" && (
                                                <CancelBooking bookingId={booking.id} />
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* История записей */}
            <section>
                <h2 className="text-2xl font-bold mb-4">История</h2>

                {pastBookings.length === 0 ? (
                    <p className="text-muted-foreground">История пуста</p>
                ) : (
                    <div className="space-y-3">
                        {pastBookings.map((booking) => (
                            <Card key={booking.id} className="opacity-70">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{booking.service.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(booking.date)}
                                            </p>
                                        </div>
                                        <Badge variant="outline">
                                            {booking.status === "CANCELLED" ? "❌ Отменено" : "✅ Завершено"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}