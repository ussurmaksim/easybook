import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    // Получаем 3 популярные услуги из базы
    const popularServices = await prisma.service.findMany({
        take: 3,
        orderBy: { title: "asc" },
    });

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero секция */}
            <section className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Онлайн-запись в <span className="text-primary">салон красоты</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Выберите услугу и запишитесь в удобное время. Быстро, удобно и без очередей.
                </p>
                <Link href="/services">
                    <Button size="lg" className="text-lg px-8">
                        Записаться онлайн
                    </Button>
                </Link>
            </section>

            {/* Популярные услуги (из БД) */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Популярные услуги</h2>

                {popularServices.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        <p>Услуги пока не добавлены</p>
                        <Link href="/admin">
                            <Button variant="outline" className="mt-4">Добавить услуги</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {popularServices.map((service) => (
                            <Card key={service.id} className="hover:shadow-lg transition flex flex-col">
                                <CardHeader>
                                    <CardTitle>
                                        <Link href={`/services/${service.id}`} className="hover:text-primary transition">
                                            {service.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription>{service.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-bold text-primary">
                                      {service.price} ₽
                                    </span>
                                                                    <span className="text-muted-foreground">
                                      ⏱ {service.duration} мин
                                    </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/services/${service.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                📖 Подробнее
                                            </Button>
                                        </Link>
                                        <Link href={`/booking?serviceId=${service.id}`} className="flex-1">
                                            <Button className="w-full">Записаться</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Преимущества */}
            <section className="bg-muted rounded-lg p-8 mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Почему выбирают нас</h2>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="text-4xl mb-4">⏰</div>
                        <h3 className="font-bold text-lg mb-2">Удобное время</h3>
                        <p className="text-muted-foreground">Записывайтесь онлайн 24/7 без звонков</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">👩‍🎨</div>
                        <h3 className="font-bold text-lg mb-2">Опытные мастера</h3>
                        <p className="text-muted-foreground">Профессионалы с многолетним стажем</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">💎</div>
                        <h3 className="font-bold text-lg mb-2">Качественные материалы</h3>
                        <p className="text-muted-foreground">Используем только проверенную косметику</p>
                    </div>
                </div>
            </section>
        </div>
    );
}