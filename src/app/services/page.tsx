import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { title: "asc" },
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Наши услуги</h1>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Выберите услугу и запишитесь на удобное время. Все мастера имеют большой опыт работы.
            </p>

            {services.length === 0 ? (
                <div className="text-center text-muted-foreground">
                    <p className="text-xl">Услуги пока не добавлены</p>
                    <Link href="/admin/services">
                        <Button variant="outline" className="mt-4">Добавить услуги</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <Card key={service.id} className="hover:shadow-lg transition flex flex-col">
                            <CardHeader>
                                <CardTitle>
                                    {/* ✅ Ссылка на страницу услуги */}
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
                                    {/* ✅ Кнопка "Подробнее" */}
                                    <Link href={`/services/${service.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            📖 Подробнее
                                        </Button>
                                    </Link>
                                    {/* ✅ Кнопка "Записаться" */}
                                    <Link href={`/booking?serviceId=${service.id}`} className="flex-1">
                                        <Button className="w-full">Записаться</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}