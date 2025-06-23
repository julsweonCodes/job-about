"use client";

import { createSupabaseBrowserClient } from "@/lib/client/supabase";

export const getTests = async () => {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("test").select("*").is("deleted_at", null);

    return result.data;
};

export const getTestsById = async (id: number) => {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase
        .from("test")
        .select("*")
        .is("deleted_at", null)
        .eq("id", id);

    return result.data;
}

export const createTests = async (content: string) => {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase
        .from("test")
        .insert({
            content
        }).select();

    return result.data;
}

export const updateTests = async (id: number, content: string) => {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase
        .from("test")
        .update({
            content,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

    return result.data;
}

export const deleteTests = async (id: number) => {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase
        .from("test")
        .update({
            updated_at: new Date().toISOString(),
            deleted_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

    return result.data;
}