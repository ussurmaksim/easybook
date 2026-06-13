export default function Footer() {
    return (
        <footer className="border-t border-border bg-muted mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">💅 EasyBook</h3>
                        <p className="text-muted-foreground">
                            Онлайн-запись в салон красоты.
                            Быстро, удобно и без очередей.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Контакты</h3>
                        <p className="text-muted-foreground">📞 +7 (999) 123-45-67</p>
                        <p className="text-muted-foreground">📧 info@easybook.ru</p>
                        <p className="text-muted-foreground">⏰ Ежедневно 9:00 - 21:00</p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Адрес</h3>
                        <p className="text-muted-foreground">
                            📍 г. Москва, ул. Примерная, д. 123
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
                    <p>© 2026 EasyBook. Все права защищены.</p>
                </div>
            </div>
        </footer>
    )
}