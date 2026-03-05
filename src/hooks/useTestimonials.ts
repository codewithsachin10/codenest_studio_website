import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type Testimonial = Tables<"testimonials">;
type InsertTestimonial = InsertTables<"testimonials">;
type UpdateTestimonial = UpdateTables<"testimonials">;

// Mock data for demo mode
const mockTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "Priya Sharma",
        role: "Computer Science Student",
        institution: "IIT Delhi",
        content: "Finally, an IDE that doesn't require 30 minutes of setup! I installed CodeNest, clicked Python, and started coding. No more PATH configuration nightmares.",
        avatar: null,
        rating: 5,
        is_highlighted: true,
        is_published: true,
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Rahul Verma",
        role: "High School Teacher",
        institution: "DPS Bangalore",
        content: "I teach programming to beginners, and CodeNest has been a game-changer. Students no longer struggle with PATH configurations or compiler installations.",
        avatar: null,
        rating: 5,
        is_highlighted: false,
        is_published: true,
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Ananya Patel",
        role: "Self-taught Developer",
        institution: "Freelancer",
        content: "As someone learning to code without CS background, the clean interface and helpful error messages made my journey smoother. Highly recommended!",
        avatar: null,
        rating: 5,
        is_highlighted: false,
        is_published: true,
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export function useTestimonials(publishedOnly = false) {
    return useQuery({
        queryKey: ["testimonials", { publishedOnly }],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            let query = client
                .from("testimonials")
                .select("*")
                .order("order_index", { ascending: true });

            if (publishedOnly) {
                query = query.eq("is_published", true);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching testimonials:", error.message);
                return [];
            }
            return data as Testimonial[];
        },
    });
}

export function useCreateTestimonial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (testimonial: InsertTestimonial) => {
            const client = getSupabase();
            if (!client) {
                toast.error("Database not configured");
                throw new Error("Supabase not configured");
            }

            const { data, error } = await client
                .from("testimonials")
                .insert(testimonial)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast.success("Testimonial created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });
}

export function useUpdateTestimonial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateTestimonial & { id: string }) => {
            const client = getSupabase();
            if (!client) {
                toast.error("Database not configured");
                throw new Error("Supabase not configured");
            }

            const { data, error } = await client
                .from("testimonials")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast.success("Testimonial updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteTestimonial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) {
                toast.error("Database not configured");
                throw new Error("Supabase not configured");
            }

            const { error } = await client
                .from("testimonials")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast.success("Testimonial deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

export function useUpdateTestimonialOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (items: { id: string; order_index: number }[]) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            // Update each item's order
            const updates = items.map((item) =>
                client
                    .from("testimonials")
                    .update({ order_index: item.order_index })
                    .eq("id", item.id)
            );

            await Promise.all(updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
}
