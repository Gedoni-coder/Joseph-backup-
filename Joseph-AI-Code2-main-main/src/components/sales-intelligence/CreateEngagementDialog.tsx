import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const engagementFormSchema = z.object({
  personName: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company name is required"),
  dealDescription: z.string().min(1, "Deal description is required"),
  channel: z.enum(["whatsapp", "sms", "email", "linkedin"]),
  timesContacted: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .max(1000, "Must be less than 1000"),
  timesResponded: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .max(1000, "Must be less than 1000"),
  avgResponseTimeMinutes: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .max(10080, "Must be less than 7 days"),
  timesFollowedUp: z.coerce
    .number()
    .min(0, "Must be 0 or greater")
    .max(1000, "Must be less than 1000"),
});

type EngagementFormValues = z.infer<typeof engagementFormSchema>;

export interface EngagementData {
  id: string;
  personName: string;
  companyName: string;
  dealDescription: string;
  channel: "whatsapp" | "sms" | "email" | "linkedin";
  timesContacted: number;
  timesResponded: number;
  avgResponseRate: number; // Calculated: (timesResponded / timesContacted) * 100
  avgResponseTimeMinutes: number;
  timesFollowedUp: number;
  followUpRate: number; // Calculated: (timesFollowedUp / timesContacted) * 100
  engagementScore: number; // Calculated automatically
  createdAt: Date;
}

interface CreateEngagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEngagementCreated: (engagement: EngagementData) => void;
}

const CreateEngagementDialog = ({
  open,
  onOpenChange,
  onEngagementCreated,
}: CreateEngagementDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EngagementFormValues>({
    resolver: zodResolver(engagementFormSchema),
    defaultValues: {
      personName: "",
      companyName: "",
      dealDescription: "",
      channel: "whatsapp",
      timesContacted: 0,
      timesResponded: 0,
      avgResponseTimeMinutes: 0,
      timesFollowedUp: 0,
    },
  });

  // Function to calculate Engagement Score
  // Score = Average of (normalized response rate, normalized follow-up rate, normalized response time quality)
  const calculateEngagementScore = (
    timesContacted: number,
    timesResponded: number,
    avgResponseTimeMinutes: number,
    timesFollowedUp: number,
  ): number => {
    // Handle edge case: no contacts
    if (timesContacted === 0) return 0;

    // 1. Response Rate: (timesResponded / timesContacted) * 100
    const responseRate = (timesResponded / timesContacted) * 100;
    const normalizedResponseRate = Math.min(responseRate / 100, 1); // Normalize to 0-1

    // 2. Follow-up Rate: (timesFollowedUp / timesContacted) * 100
    const followUpRate = (timesFollowedUp / timesContacted) * 100;
    const normalizedFollowUpRate = Math.min(followUpRate / 100, 1); // Normalize to 0-1

    // 3. Response Time Quality: Higher is better (fewer minutes is better)
    // Ideal response time: < 5 minutes (score 1.0)
    // Poor response time: > 480 minutes (8 hours) (score 0)
    const IDEAL_RESPONSE_TIME = 5; // minutes
    const POOR_RESPONSE_TIME = 480; // 8 hours in minutes
    let normalizedResponseTime =
      Math.max(POOR_RESPONSE_TIME - avgResponseTimeMinutes, 0) /
      (POOR_RESPONSE_TIME - IDEAL_RESPONSE_TIME);
    normalizedResponseTime = Math.min(normalizedResponseTime, 1); // Cap at 1.0

    // Average the three normalized metrics for final score (0-10 scale)
    const averageScore =
      (normalizedResponseRate + normalizedFollowUpRate + normalizedResponseTime) /
      3;
    return Math.round(averageScore * 100) / 10; // Round to 1 decimal place and scale to 0-10
  };

  const onSubmit = async (values: EngagementFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate derived metrics
      const avgResponseRate =
        values.timesContacted > 0
          ? (values.timesResponded / values.timesContacted) * 100
          : 0;
      const followUpRate =
        values.timesContacted > 0
          ? (values.timesFollowedUp / values.timesContacted) * 100
          : 0;
      const engagementScore = calculateEngagementScore(
        values.timesContacted,
        values.timesResponded,
        values.avgResponseTimeMinutes,
        values.timesFollowedUp,
      );

      // Create engagement object
      const newEngagement: EngagementData = {
        id: `engagement-${Date.now()}`,
        personName: values.personName,
        companyName: values.companyName,
        dealDescription: values.dealDescription,
        channel: values.channel,
        timesContacted: values.timesContacted,
        timesResponded: values.timesResponded,
        avgResponseRate: Math.round(avgResponseRate * 100) / 100,
        avgResponseTimeMinutes: values.avgResponseTimeMinutes,
        timesFollowedUp: values.timesFollowedUp,
        followUpRate: Math.round(followUpRate * 100) / 100,
        engagementScore: engagementScore,
        createdAt: new Date(),
      };

      // Callback to parent component
      onEngagementCreated(newEngagement);

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Engagement</DialogTitle>
          <DialogDescription>
            Fill in the engagement details for a contact. Metrics will be
            calculated automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Contact Information
            </h3>

            <FormField
              control={form.control}
              name="personName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ahmed Hassan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ZenithTech Ltd" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dealDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 50 Laptops Supply Contract"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Channel Selection */}
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engagement Channel</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Engagement Metrics Section */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Engagement Metrics
            </h3>

            <FormField
              control={form.control}
              name="timesContacted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Times Contacted</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Trigger re-render of dependent fields
                        form.trigger();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of contact attempts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timesResponded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Times Responded</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    {form.watch("timesContacted") > 0
                      ? `Avg Response Rate: ${((form.watch("timesResponded") / form.watch("timesContacted")) * 100).toFixed(1)}%`
                      : "Set number of times contacted first"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avgResponseTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avg Response Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Average response time in minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timesFollowedUp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Times Followed Up</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    {form.watch("timesContacted") > 0
                      ? `Follow-up Rate: ${((form.watch("timesFollowedUp") / form.watch("timesContacted")) * 100).toFixed(1)}%`
                      : "Set number of times contacted first"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Engagement Score Preview */}
          {form.watch("timesContacted") > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Estimated Engagement Score
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Based on response rate, follow-up rate, and response time
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {calculateEngagementScore(
                    form.watch("timesContacted"),
                    form.watch("timesResponded"),
                    form.watch("avgResponseTimeMinutes"),
                    form.watch("timesFollowedUp"),
                  ).toFixed(1)}
                  <span className="text-lg text-blue-500">/10</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Engagement"}
            </Button>
          </div>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEngagementDialog;
