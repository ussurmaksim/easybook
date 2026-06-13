import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteServiceButton } from "@/components/admin/DeleteServiceButton";
import Link from "next/link";

export default async function AdminServicesPage() {
    const session = await auth();

    // Проверка прав администратора
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    // Получаем все услуги из базы
    const services = await prisma.service.findMany({
        orderBy: { title: "asc" },
    });

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Заголовок страницы */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Управление услугами</h1>
                    <p className="text-muted-foreground mt-1">
                        Добавляйте, редактируйте и удаляйте услуги салона
                    </p>
                </div>
                <Link href="/admin/services/new">
                    <Button>➕ Добавить услугу</Button>
                </Link>
            </div>

            {/* Карточка со списком услуг */}
            <Card>
                <CardHeader>
                    <CardTitle>Список услуг ({services.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Описание</TableHead>
                                <TableHead>Цена</TableHead>
                                <TableHead>Длительность</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">
                                        {service.title}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                                        {service.description || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            {service.price} ₽
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono">
                                            ⏱ {service.duration} мин
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Кнопка редактирования */}
                                            <Link href={`/admin/services/${service.id}/edit`}>
                                                <Button variant="outline" size="sm" title="Редактировать">
                                                    ✏️
                                                </Button>
                                            </Link>

                                            {/* ✅ Исправлено: клиентский компонент для удаления */}
                                            <DeleteServiceButton
                                                serviceId={service.id}
                                                serviceName={service.title}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Сообщение, если услуг нет */}
                    {services.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">📋</div>
                            <p className="text-muted-foreground mb-4">
                                Услуги пока не добавлены
                            </p>
                            <Link href="/admin/services/new">
                                <Button>Добавить первую услугу</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Быстрые ссылки на другие разделы админки */}
            <div className="flex gap-4 mt-8">
                <Link href="/admin">
                    <Button variant="ghost">← На главную админки</Button>
                </Link>
                <Link href="/admin/masters">
                    <Button variant="ghost">👨‍ Мастера</Button>
                </Link>
                <Link href="/admin/users">
                    <Button variant="ghost">👥 Пользователи</Button>
                </Link>
            </div>
        </div>
    );
}