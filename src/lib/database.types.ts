export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            testimonials: {
                Row: {
                    id: string;
                    name: string;
                    role: string;
                    institution: string;
                    content: string;
                    avatar: string | null;
                    rating: number;
                    is_highlighted: boolean;
                    is_published: boolean;
                    order_index: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    role: string;
                    institution: string;
                    content: string;
                    avatar?: string | null;
                    rating?: number;
                    is_highlighted?: boolean;
                    is_published?: boolean;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    role?: string;
                    institution?: string;
                    content?: string;
                    avatar?: string | null;
                    rating?: number;
                    is_highlighted?: boolean;
                    is_published?: boolean;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            faqs: {
                Row: {
                    id: string;
                    question: string;
                    answer: string;
                    category: string | null;
                    is_published: boolean;
                    order_index: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    question: string;
                    answer: string;
                    category?: string | null;
                    is_published?: boolean;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    question?: string;
                    answer?: string;
                    category?: string | null;
                    is_published?: boolean;
                    order_index?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            changelog_versions: {
                Row: {
                    id: string;
                    version: string;
                    title: string;
                    date: string;
                    type: 'major' | 'minor' | 'patch';
                    is_published: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    version: string;
                    title: string;
                    date: string;
                    type: 'major' | 'minor' | 'patch';
                    is_published?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    version?: string;
                    title?: string;
                    date?: string;
                    type?: 'major' | 'minor' | 'patch';
                    is_published?: boolean;
                    created_at?: string;
                };
            };
            changelog_changes: {
                Row: {
                    id: string;
                    version_id: string;
                    category: 'feature' | 'improvement' | 'fix';
                    description: string;
                    order_index: number;
                };
                Insert: {
                    id?: string;
                    version_id: string;
                    category: 'feature' | 'improvement' | 'fix';
                    description: string;
                    order_index?: number;
                };
                Update: {
                    id?: string;
                    version_id?: string;
                    category?: 'feature' | 'improvement' | 'fix';
                    description?: string;
                    order_index?: number;
                };
            };
            subscribers: {
                Row: {
                    id: string;
                    email: string;
                    status: 'active' | 'unsubscribed';
                    subscribed_at: string;
                    unsubscribed_at: string | null;
                };
                Insert: {
                    id?: string;
                    email: string;
                    status?: 'active' | 'unsubscribed';
                    subscribed_at?: string;
                    unsubscribed_at?: string | null;
                };
                Update: {
                    id?: string;
                    email?: string;
                    status?: 'active' | 'unsubscribed';
                    subscribed_at?: string;
                    unsubscribed_at?: string | null;
                };
            };
            releases: {
                Row: {
                    id: string;
                    platform: 'windows' | 'macos' | 'linux';
                    version: string;
                    download_url: string;
                    file_type: string;
                    file_size: string | null;
                    is_available: boolean;
                    release_notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    platform: 'windows' | 'macos' | 'linux';
                    version: string;
                    download_url: string;
                    file_type: string;
                    file_size?: string | null;
                    is_available?: boolean;
                    release_notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    platform?: 'windows' | 'macos' | 'linux';
                    version?: string;
                    download_url?: string;
                    file_type?: string;
                    file_size?: string | null;
                    is_available?: boolean;
                    release_notes?: string | null;
                    created_at?: string;
                };
            };
            download_stats: {
                Row: {
                    id: string;
                    platform: string;
                    country: string | null;
                    downloaded_at: string;
                };
                Insert: {
                    id?: string;
                    platform: string;
                    country?: string | null;
                    downloaded_at?: string;
                };
                Update: {
                    id?: string;
                    platform?: string;
                    country?: string | null;
                    downloaded_at?: string;
                };
            };
            site_settings: {
                Row: {
                    key: string;
                    value: Json;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: Json;
                    updated_at?: string;
                };
                Update: {
                    key?: string;
                    value?: Json;
                    updated_at?: string;
                };
            };
            features: {
                Row: {
                    id: string;
                    icon: string;
                    title: string;
                    description: string;
                    order_index: number;
                    is_published: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    icon: string;
                    title: string;
                    description: string;
                    order_index?: number;
                    is_published?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    icon?: string;
                    title?: string;
                    description?: string;
                    order_index?: number;
                    is_published?: boolean;
                    created_at?: string;
                };
            };
            roadmap_items: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    status: 'planned' | 'in-progress' | 'completed';
                    quarter: string | null;
                    order_index: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    status?: 'planned' | 'in-progress' | 'completed';
                    quarter?: string | null;
                    order_index?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    status?: 'planned' | 'in-progress' | 'completed';
                    quarter?: string | null;
                    order_index?: number;
                    created_at?: string;
                };
            };
            page_views: {
                Row: {
                    id: string;
                    page_path: string;
                    referrer: string | null;
                    country: string | null;
                    viewed_at: string;
                };
                Insert: {
                    id?: string;
                    page_path: string;
                    referrer?: string | null;
                    country?: string | null;
                    viewed_at?: string;
                };
                Update: {
                    id?: string;
                    page_path?: string;
                    referrer?: string | null;
                    country?: string | null;
                    viewed_at?: string;
                };
            };
        };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update'];
