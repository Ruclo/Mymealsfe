import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from "@/components/ui/form"
import { Star } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ReviewData } from "@/schemas/review"
import { reviewSchema } from "@/schemas/review"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom"
import { createReview } from "@/api/orders"

export function PostReviewPage() {
    const navigate = useNavigate()
    const params = useParams();

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const form = useForm<ReviewData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 5,
            comment: "",
        },
      });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target?.files;
        if (files) {
            form.setValue("photos", files);
            
            // Create preview URLs
            const newPreviewUrls = [];
            for (let i = 0; i < Math.min(files.length, 3); i++) {
            newPreviewUrls.push(URL.createObjectURL(files[i]));
            }
            
            // Clean up old preview URLs
            previewUrls.forEach(url => URL.revokeObjectURL(url));
            
            setPreviewUrls(newPreviewUrls);
        }
    };

    useEffect(() => {
        const orderID = Number(params.orderID)
        if (isNaN(orderID)) {
            throw new Error("Missing order id")
        }
        form.setValue('order_id', orderID)
    }, [params, form])

    const onSubmit = async (data: ReviewData) => {
        console.log(data)
        await createReview(data)
        navigate(-1)
    }

    return (
      <div className="w-1/3 my-10 ml-4 md:ml-12 lg:ml-24">
        <div>
            <h2 className="text-2xl my-2">
                Leave us a review!
            </h2>
        <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Rating</FormLabel>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={cn(
                          "w-8 h-8 cursor-pointer",
                          field.value >= value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                        onClick={() => form.setValue("rating", value)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photos"
              render={() => (
                <FormItem>
                  <FormLabel>Photos (Max 3)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormDescription>
                    Each file must be an image and less than 5MB
                  </FormDescription>
                  <FormMessage />
                  
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative h-24 bg-gray-100 rounded">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
            >
            </Button>
          </form>
        </Form>
        </div>
        </div>
        </div>
    )
}