"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Пароль должен быть не менее 6 символов");
            setLoading(false);
            return;
        }

        try {
            // Создаём пользователя через API
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Ошибка регистрации");
            }

            // Автоматический вход после регистрации
            await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Произошла ошибка");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>Регистрация</CardTitle>
                    <CardDescription>Создайте аккаунт для записи</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Имя</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ваше имя"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="example@mail.ru"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Регистрация..." : "Зарегистрироваться"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Уже есть аккаунт?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Войти
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}