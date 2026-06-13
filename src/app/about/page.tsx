import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero секция */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-6">О салоне <span className="text-primary">EasyBook</span></h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Мы создаём красоту с 2020 года. Наша миссия — сделать услуги салонов красоты
                    доступными и удобными для каждого клиента.
                </p>
            </section>

            {/* Преимущества */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Почему выбирают нас</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-4xl mb-4">👩‍🎨</div>
                            <h3 className="font-bold text-lg mb-2">Опытные мастера</h3>
                            <p className="text-muted-foreground">
                                Все специалисты прошли обучение и имеют сертификаты
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-4xl mb-4">💎</div>
                            <h3 className="font-bold text-lg mb-2">Премиум материалы</h3>
                            <p className="text-muted-foreground">
                                Используем только проверенную косметику мировых брендов
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-4xl mb-4">⏰</div>
                            <h3 className="font-bold text-lg mb-2">Удобный график</h3>
                            <p className="text-muted-foreground">
                                Работаем ежедневно с 9:00 до 21:00 без выходных
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="font-bold text-lg mb-2">Гарантия качества</h3>
                            <p className="text-muted-foreground">
                                Если результат не понравится — переделаем бесплатно
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Команда */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Наша команда</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-4xl">
                                👩‍
                            </div>
                            <h3 className="font-bold text-lg">Анна Иванова</h3>
                            <p className="text-primary text-sm mb-2">Парикмахер-стилист</p>
                            <p className="text-muted-foreground text-sm">
                                Опыт 8 лет. Специализация: сложные окрашивания, стрижки.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-4xl">
                                👩‍🦱
                            </div>
                            <h3 className="font-bold text-lg">Мария Петрова</h3>
                            <p className="text-primary text-sm mb-2">Мастер маникюра</p>
                            <p className="text-muted-foreground text-sm">
                                Опыт 5 лет. Специализация: художественная роспись, nail-дизайн.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-4xl">
                                👩‍
                            </div>
                            <h3 className="font-bold text-lg">Елена Сидорова</h3>
                            <p className="text-primary text-sm mb-2">Колорист</p>
                            <p className="text-muted-foreground text-sm">
                                Опыт 10 лет. Специализация: сложные техники окрашивания.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA секция */}
            <section className="bg-primary/10 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Готовы записаться?</h2>
                <p className="text-muted-foreground mb-6">
                    Выберите услугу и забронируйте удобное время прямо сейчас
                </p>
                <Link href="/services">
                    <Button size="lg">Выбрать услугу</Button>
                </Link>
            </section>
        </div>
    );
}