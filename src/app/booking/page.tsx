import { auth } from "@/lib/auth";
import BookingForm from "@/components/booking/BookingForm";

export default async function BookingPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-background">
            <BookingForm user={session?.user} />
        </div>
    );
}