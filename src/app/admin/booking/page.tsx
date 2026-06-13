import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminBookingPage() {

    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Управление записями</h1>
            <p>Страница в разработке</p>
        </div>
    );
}