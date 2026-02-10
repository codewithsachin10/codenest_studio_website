import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type FAQ = Tables<"faqs">;
type InsertFAQ = InsertTables<"faqs">;
type UpdateFAQ = UpdateTables<"faqs">;

// Mock data for demo mode
const mockFaqs: FAQ[] = [
    {
        id: "1",
        question: "What programming languages does CodeNest support?",
        answer: "CodeNest supports Python, Java, C++, C, JavaScript, TypeScript, Go, Rust, and more. All compilers and interpreters come built-in.",
        category: "Features",
        is_published: true,
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        question: "Do I need an internet connection to use CodeNest?",
        answer: "No! CodeNest is designed to work completely offline. Once installed, you can code anywhere without any internet connection.",
        category: "General",
        is_published: true,
        order_index: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "3",
        question: "How do I install additional programming languages?",
        answer: "Go to Settings > Languages and select the languages you want to install. CodeNest will download and configure everything automatically.",
        category: "Installation",
        is_published: true,
        order_index: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "4",
        question: "Is CodeNest free to use?",
        answer: "Yes! CodeNest is completely free for personal and educational use. We also offer a Pro version with additional features for professional developers.",
        category: "Pricing",
        is_published: true,
        order_index: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "5",
        question: "My code isn't compiling. What should I do?",
        answer: "First, check the error message in the console. Common issues include syntax errors or missing dependencies. If problems persist, try restarting the application.",
        category: "Troubleshooting",
        is_published: false,
        order_index: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export function useFaqs(publishedOnly = false) {
    return useQuery({
        queryKey: ["faqs", { publishedOnly }],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            let query = client
                .from("faqs")
                .select("*")
                .order("order_index", { ascending: true });

            if (publishedOnly) {
                query = query.eq("is_published", true);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching FAQs:", error.message);
                return [];
            }
            return data as FAQ[];
        },
    });
}

export function useCreateFaq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (faq: InsertFAQ) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const { data, error } = await client
                .from("faqs")
                .insert(faq)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            toast.success("FAQ created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });
}

export function useUpdateFaq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateFAQ & { id: string }) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const { data, error } = await client
                .from("faqs")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            toast.success("FAQ updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteFaq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const { error } = await client
                .from("faqs")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            toast.success("FAQ deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

export function useUpdateFaqOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (items: { id: string; order_index: number }[]) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const updates = items.map((item) =>
                client
                    .from("faqs")
                    .update({ order_index: item.order_index })
                    .eq("id", item.id)
            );

            await Promise.all(updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
    });
}
