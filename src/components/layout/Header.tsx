import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { MobileMenu } from "./MobileMenu";

export default async function Header() {
    const session = await auth();

    const handleSignOut = async () => {
        "use server";
        await signOut({ redirectTo: "/" });
    };

    return (
        <header className="border-b border-border bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Логотип */}
                    <Link href="/" className="text-2xl font-bold text-primary shrink-0">
                        💅 EasyBook
                    </Link>

                    {/* ДЕСКТОПНАЯ НАВИГАЦИЯ */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/services" className="text-foreground hover:text-primary transition font-medium">
                            Услуги
                        </Link>
                        <Link href="/about" className="text-foreground hover:text-primary transition font-medium">
                            О нас
                        </Link>
                        <Link href="/reviews" className="text-foreground hover:text-primary transition font-medium">
                            Отзывы
                        </Link>
                        <Link href="/contact" className="text-foreground hover:text-primary transition font-medium">
                            Контакты
                        </Link>
                    </nav>

                    {/* ДЕСКТОПНЫЕ КНОПКИ */}
                    <div className="hidden md:flex items-center gap-3">
                        {session?.user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm">Записи</Button>
                                </Link>
                                <Link href="/profile">
                                    <Button variant="outline" size="sm">Профиль</Button>
                                </Link>

                                {session.user.role === "ADMIN" && (
                                    <Link href="/admin">
                                        <Button variant="secondary" size="sm">Админка</Button>
                                    </Link>
                                )}

                                <form action={handleSignOut}>
                                    <Button type="submit" variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        Выйти
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" size="sm">Войти</Button>
                                </Link>
                                <Link href="/services">
                                    <Button size="sm">Записаться</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* МОБИЛЬНОЕ МЕНЮ - ТОЛЬКО НА МОБИЛЬНЫХ */}
                    <div className="md:hidden">
                        <MobileMenu session={session} logoutAction={handleSignOut} />
                    </div>
                </div>
            </div>
        </header>
    );
}