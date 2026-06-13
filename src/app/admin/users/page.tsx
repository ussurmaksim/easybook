import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import Link from "next/link";

export default async function AdminUsersPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            bookings: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });

    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const userCount = users.filter((u) => u.role === "USER").length;

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Управление пользователями</h1>
                    <p className="text-muted-foreground mt-1">
                        Просмотр, редактирование и управление аккаунтами
                    </p>
                </div>
                <Link href="/admin">
                    <Button variant="outline">← На главную</Button>
                </Link>
            </div>

            {/* Статистика */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Всего пользователей</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Администраторы</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{adminCount}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Клиенты</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{userCount}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Таблица пользователей */}
            <Card>
                <CardHeader>
                    <CardTitle>Список пользователей</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Имя</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Телефон</TableHead>
                                <TableHead>Роль</TableHead>
                                <TableHead>Записей</TableHead>
                                <TableHead>Дата регистрации</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name || "—"}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || "—"}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                            {user.role === "ADMIN" ? "👑 Админ" : "👤 Пользователь"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.bookings.length}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/users/${user.id}/edit`}>
                                                <Button variant="outline" size="sm" title="Редактировать">
                                                    ✏️
                                                </Button>
                                            </Link>
                                            {/* ✅ Исправлено: клиентский компонент */}
                                            <DeleteUserButton
                                                userId={user.id}
                                                userEmail={user.email}
                                                disabled={user.id === session.user.id}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {users.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            Пользователи пока не зарегистрированы
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}