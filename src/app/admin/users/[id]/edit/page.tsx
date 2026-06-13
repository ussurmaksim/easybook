import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser, changeUserPassword } from "@/actions/admin/users";
import Link from "next/link";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        notFound();
    }

    const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
    });

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users">
                    <Button variant="outline">← Назад</Button>
                </Link>
                <h1 className="text-3xl font-bold">Редактировать пользователя</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Редактирование данных */}
                <Card>
                    <CardHeader>
                        <CardTitle>👤 Данные профиля</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserEditForm user={user} adminCount={adminCount} />
                    </CardContent>
                </Card>

                {/* Смена пароля */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔒 Сменить пароль</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PasswordChangeForm userId={user.id} />
                    </CardContent>
                </Card>
            </div>

            {/* Информация об аккаунте */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>ℹ️ Информация</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Дата регистрации</p>
                        <p className="font-medium">{new Date(user.createdAt).toLocaleDateString("ru-RU")}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Последнее обновление</p>
                        <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString("ru-RU")}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">ID пользователя</p>
                        <p className="font-mono text-sm">{user.id}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function UserEditForm({ user, adminCount }: { user: any; adminCount: number }) {
    return (
        <form action={async (formData) => {
            "use server";
            const result = await updateUser(user.id, {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string || undefined,
                role: formData.get("role") as "USER" | "ADMIN",
            });

            if (result.success) {
                redirect("/admin/users");
            }
        }} className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={user.name || ""}
                    placeholder="Имя пользователя"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                    id="phone"
                    name="phone"
                    defaultValue={user.phone || ""}
                    placeholder="+7 (___) ___-__-__"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select name="role" defaultValue={user.role}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">👤 Пользователь</SelectItem>
                        <SelectItem value="ADMIN" disabled={adminCount <= 1}>
                            👑 Администратор {adminCount <= 1 && "(нельзя удалить последнего)"}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">💾 Сохранить</Button>
                <Link href="/admin/users">
                    <Button variant="outline" className="w-full">Отмена</Button>
                </Link>
            </div>
        </form>
    );
}

function PasswordChangeForm({ userId }: { userId: string }) {
    return (
        <form action={async (formData) => {
            "use server";
            const result = await changeUserPassword(userId, {
                password: formData.get("password") as string,
            });

            if (result.success) {
                redirect("/admin/users");
            }
        }} className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="password">Новый пароль *</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Минимум 6 символов
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                />
            </div>

            <Button type="submit" className="w-full">
                🔑 Изменить пароль
            </Button>
        </form>
    );
}