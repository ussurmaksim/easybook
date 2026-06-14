"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBooking } from "@/actions/booking";

// ✅ Тип мастера из Prisma
interface Master {
    id: string;
    name: string;
    specialization: string | null;
}

const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00",
];

interface BookingFormProps {
    user?: {
        name?: string | null;
        email?: string | null;
    } | null;
    masters: Master[]; // ✅ Передаем мастеров из БД
}

export default function BookingForm({ user, masters }: BookingFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceId = searchParams.get("serviceId") || "";

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [master, setMaster] = useState<string>("");
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: "",
        email: user?.email || "",
        comment: "",
    });

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        const result = await createBooking({
            serviceId,
            masterId: master,
            date: date ? format(date, "yyyy-MM-dd") : "",
            timeSlot,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            comment: formData.comment,
        });

        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/booking/success");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-center mb-8">Запись на услугу</h1>

            {/* Индикатор шагов */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Выберите мастера"}
                        {step === 2 && "Выберите дату и время"}
                        {step === 3 && "Ваши данные"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Выберите специалиста для записи"}
                        {step === 2 && "Найдите удобное время для визита"}
                        {step === 3 && user
                            ? "Данные подставлены из профиля (можно изменить)"
                            : "Заполните контактную информацию"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <Select value={master} onValueChange={setMaster}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите мастера" />
                                </SelectTrigger>
                                <SelectContent>
                                    {masters.length > 0 ? (
                                        masters.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>
                                                {m.name} {m.specialization && `— ${m.specialization}`}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            Мастера не найдены
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Button
                                className="w-full"
                                onClick={() => setStep(2)}
                                disabled={!master}
                            >
                                Продолжить
                            </Button>
                        </div>
                    )}

                    {/* Остальные шаги без изменений... */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Дата</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "dd MMMM yyyy", { locale: ru }) : "Выберите дату"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Время</Label>
                                <Select value={timeSlot} onValueChange={setTimeSlot}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите время" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    Назад
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="flex-1"
                                    disabled={!date || !timeSlot}
                                >
                                    Продолжить
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Имя *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ваше имя"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Телефон *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+7 (___) ___-__-__"
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
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comment">Комментарий</Label>
                                <Input
                                    id="comment"
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Пожелания к услуге"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                    Назад
                                </Button>
                                <Button
                                    className="flex-1"
                                    disabled={!formData.name || !formData.phone || loading}
                                    onClick={handleSubmit}
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Запись...
                                        </>
                                    ) : (
                                        "Подтвердить запись"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}