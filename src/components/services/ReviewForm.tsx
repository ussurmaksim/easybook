"use client"

import { useState } from "react"
import { createReview } from "@/actions/reviews"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { toast } from "sonner"

export default function ReviewForm({ serviceId }: { serviceId: string }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await createReview({
            rating,
            comment,
            serviceId,
        })

        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else if (result.success) {
            toast.success(result.message)
            setRating(0)
            setComment("")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Ваша оценка</Label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`w-8 h-8 ${
                                    star <= rating
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground hover:text-primary"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment">Ваш отзыв</Label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Расскажите о вашем опыте..."
                    className="min-h-[100px]"
                    required
                />
            </div>

            <Button type="submit" disabled={loading || rating === 0} className="w-full">
                {loading ? "Отправка..." : "Отправить отзыв"}
            </Button>

            <p className="text-xs text-muted-foreground">
                Отзыв появится после модерации администратором
            </p>
        </form>
    )
}