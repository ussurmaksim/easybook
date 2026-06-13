import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Контакты</h1>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Свяжитесь с нами любым удобным способом. Мы всегда рады ответить на ваши вопросы!
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Контактная информация */}
                <Card>
                    <CardHeader>
                        <CardTitle>📞 Свяжитесь с нами</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className="font-medium">Адрес</p>
                                <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 123</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📱</span>
                            <div>
                                <p className="font-medium">Телефон</p>
                                <Link href="tel:+79991234567" className="text-primary hover:underline">
                                    +7 (999) 123-45-67
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📧</span>
                            <div>
                                <p className="font-medium">Email</p>
                                <Link href="mailto:info@easybook.ru" className="text-primary hover:underline">
                                    info@easybook.ru
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⏰</span>
                            <div>
                                <p className="font-medium">Режим работы</p>
                                <p className="text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl"></span>
                            <div>
                                <p className="font-medium">Метро</p>
                                <p className="text-muted-foreground">5 минут от м. Примерная</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Форма обратной связи */}
                <Card>
                    <CardHeader>
                        <CardTitle>✉️ Напишите нам</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ваше имя</Label>
                                <Input id="name" placeholder="Иван Иванов" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="example@mail.ru" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Сообщение</Label>
                                <textarea
                                    id="message"
                                    className="w-full min-h-[120px] p-3 border border-input rounded-md bg-background"
                                    placeholder="Ваш вопрос или предложение..."
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Отправить сообщение
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Мы ответим в течение рабочего дня
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>


            {/* FAQ */}
            <section>
                <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-bold mb-2">❓ Нужно ли предоплата?</h3>
                            <p className="text-muted-foreground">
                                Нет, предоплата не требуется. Вы оплачиваете услуги после их оказания.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-bold mb-2">❓ Можно ли отменить запись?</h3>
                            <p className="text-muted-foreground">
                                Да, вы можете отменить запись в личном кабинете не позднее чем за 24 часа.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-bold mb-2">❓ Есть ли парковка?</h3>
                            <p className="text-muted-foreground">
                                Да, у нас есть бесплатная парковка для клиентов на 10 мест.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}