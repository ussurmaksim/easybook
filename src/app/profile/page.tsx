import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileForm from "@/components/profile/ProfileForm"
import PasswordForm from "@/components/profile/PasswordForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    // Получаем актуальные данные пользователя из БД
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Личный профиль</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Редактирование данных */}
                <Card>
                    <CardHeader>
                        <CardTitle>👤 Данные профиля</CardTitle>
                        <CardDescription>
                            Измените вашу личную информацию
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm user={user} />
                    </CardContent>
                </Card>

                {/* Смена пароля */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔒 Безопасность</CardTitle>
                        <CardDescription>
                            Измените пароль от аккаунта
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasswordForm />
                    </CardContent>
                </Card>
            </div>

            {/* Информация об аккаунте */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>ℹ️ Информация об аккаунте</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Роль</p>
                        <p className="font-medium">
                            {user.role === "ADMIN" ? "👑 Администратор" : "👤 Пользователь"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Дата регистрации</p>
                        <p className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Всего записей</p>
                        <p className="font-medium">
                            {/* Можно добавить подсчёт записей */}
                            —
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Статус</p>
                        <p className="font-medium text-green-600">✅ Активен</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}