"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
    session: any;
    logoutAction: () => Promise<void>;
}

export function MobileMenu({ session, logoutAction }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Определяем мобильное устройство
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const closeMenu = () => {
        setIsOpen(false);
        document.body.style.overflow = "";
    };

    const openMenu = () => {
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    // Закрытие при смене страницы
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
        document.body.style.overflow = "";
    }, [pathname]);

    // Если не мобильное устройство - не рендерим ничего
    if (!isMobile) {
        return null;
    }

    return (
        <>
            {/* Кнопка гамбургера */}
            <button
                onClick={openMenu}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Открыть меню"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Оверлей */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeMenu}
            />
        )}

        {/* Сайдбар */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: '280px',
                    backgroundColor: 'white',
                    zIndex: 50,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 300ms ease-in-out',
                }}
            >
                {/* Шапка */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-pink-500">Меню</h2>
                    <button
                        onClick={closeMenu}
                        className="p-2 hover:bg-gray-100 rounded-md"
                        aria-label="Закрыть меню"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Навигация */}
                <nav className="flex flex-col p-4">
                    <Link
                        href="/services"
                        onClick={closeMenu}
                        className="py-3 text-lg font-medium hover:text-pink-500 transition-colors"
                    >
                        Услуги
                    </Link>
                    <Link
                        href="/about"
                        onClick={closeMenu}
                        className="py-3 text-lg font-medium hover:text-pink-500 transition-colors"
                    >
                        О нас
                    </Link>
                    <Link
                        href="/reviews"
                        onClick={closeMenu}
                        className="py-3 text-lg font-medium hover:text-pink-500 transition-colors"
                    >
                        Отзывы
                    </Link>
                    <Link
                        href="/contact"
                        onClick={closeMenu}
                        className="py-3 text-lg font-medium hover:text-pink-500 transition-colors"
                    >
                        Контакты
                    </Link>
                </nav>

                {/* Кнопки внизу */}
                <div className="flex flex-col gap-3 p-4 border-t mt-auto">
                    {session?.user ? (
                        <>
                            <Link href="/dashboard" onClick={closeMenu} className="block">
                                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50">
                                    Записи
                                </button>
                            </Link>
                            <Link href="/profile" onClick={closeMenu} className="block">
                                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-50">
                                    Профиль
                                </button>
                            </Link>
                            {session.user.role === "ADMIN" && (
                                <Link href="/admin" onClick={closeMenu} className="block">
                                    <button className="w-full text-left px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                        Админка
                                    </button>
                                </Link>
                            )}
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Выйти
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={closeMenu} className="block">
                                <button className="w-full px-4 py-2 border rounded-md hover:bg-gray-50">
                                    Войти
                                </button>
                            </Link>
                            <Link href="/services" onClick={closeMenu} className="block">
                                <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600">
                                    Записаться
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}