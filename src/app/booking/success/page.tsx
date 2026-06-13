import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BookingSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
            <Card className="text-center">
                <CardHeader>
                    <div className="text-6xl mb-4">✅</div>
                    <CardTitle className="text-2xl">Вы успешно записаны!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Ваша заявка создана и ожидает подтверждения администратора.
                    </p>
                    <p className="text-muted-foreground">
                        Мы свяжемся с вами для подтверждения времени.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <Link href="/dashboard" className="flex-1">
                            <Button className="w-full">В личный кабинет</Button>
                        </Link>
                        <Link href="/services" className="flex-1">
                            <Button variant="outline" className="w-full">Ещё услуги</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}