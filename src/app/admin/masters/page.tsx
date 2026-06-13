import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { deleteMaster } from "@/actions/admin/masters"
import Link from "next/link"

export default async function AdminMastersPage() {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const masters = await prisma.master.findMany({
        orderBy: { name: "asc" },
    })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Управление мастерами</h1>
                <Link href="/admin/masters/new">
                    <Button>➕ Добавить мастера</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Список мастеров</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Имя</TableHead>
                                <TableHead>Специализация</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Записей</TableHead>
                                <TableHead>Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {masters.map((master) => (
                                <TableRow key={master.id}>
                                    <TableCell className="font-medium">{master.name}</TableCell>
                                    <TableCell>{master.specialization || "—"}</TableCell>
                                    <TableCell>
                                        <Badge variant={master.isActive ? "default" : "secondary"}>
                                            {master.isActive ? "✅ Активен" : "❌ Неактивен"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {/* Можно добавить подсчёт записей */}
                                        —
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Link href={`/admin/masters/${master.id}/edit`}>
                                            <Button variant="outline" size="sm">✏️</Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server"
                                            await deleteMaster(master.id)
                                        }}>
                                            <Button variant="destructive" size="sm" type="submit">🗑️</Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {masters.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                            Мастера пока не добавлены
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}