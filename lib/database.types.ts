export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            experiences: {
                Row: {
                    id: string
                    title: string
                    description: string
                    long_description: string
                    city: 'Ouagadougou' | 'Bobo-Dioulasso'
                    type: 'experience' | 'activity'
                    category: string
                    price: number
                    duration: string
                    images: string[]
                    highlights: string[]
                    included: string[]
                    not_included: string[]
                    featured: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    long_description: string
                    city: 'Ouagadougou' | 'Bobo-Dioulasso'
                    type: 'experience' | 'activity'
                    category: string
                    price: number
                    duration: string
                    images?: string[]
                    highlights?: string[]
                    included?: string[]
                    not_included?: string[]
                    featured?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    long_description?: string
                    city?: 'Ouagadougou' | 'Bobo-Dioulasso'
                    type?: 'experience' | 'activity'
                    category?: string
                    price?: number
                    duration?: string
                    images?: string[]
                    highlights?: string[]
                    included?: string[]
                    not_included?: string[]
                    featured?: boolean
                    created_at?: string
                }
            }
            booking_requests: {
                Row: {
                    id: string
                    experience_id: string
                    experience_title: string
                    name: string
                    email: string
                    phone: string
                    number_of_people: number
                    preferred_date: string
                    message: string
                    status: 'pending' | 'contacted' | 'confirmed' | 'cancelled'
                    created_at: string
                }
                Insert: {
                    id?: string
                    experience_id: string
                    experience_title: string
                    name: string
                    email: string
                    phone: string
                    number_of_people: number
                    preferred_date: string
                    message?: string
                    status?: 'pending' | 'contacted' | 'confirmed' | 'cancelled'
                    created_at?: string
                }
                Update: {
                    id?: string
                    experience_id?: string
                    experience_title?: string
                    name?: string
                    email?: string
                    phone?: string
                    number_of_people?: number
                    preferred_date?: string
                    message?: string
                    status?: 'pending' | 'contacted' | 'confirmed' | 'cancelled'
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
