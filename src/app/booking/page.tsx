import { getActiveMasters } from "@/actions/masters";
import BookingForm from "@/components/booking/BookingForm";
import { auth } from "@/lib/auth";

export default async function BookingPage() {
    const session = await auth();
    const masters = await getActiveMasters();

    return (
        <BookingForm
            user={session?.user}
            masters={masters}
        />
    );
}