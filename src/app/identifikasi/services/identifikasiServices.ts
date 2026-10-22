import { createClient } from "../../lib/supabase";
import { Identifikasi } from "../types/identifikasi";

const supabase = createClient();

export const getKategori = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("identifikasi")
    .select("kategori");

  if (error) throw error;

  const kategori =
    data?.map((item: any) => item.kategori) || [];

  return ["Semua", ...new Set(kategori)];
};

export const getArtikel = async (
  kategori?: string,
  keyword?: string
): Promise<Identifikasi[]> => {

  let query =
    supabase
      .from("identifikasi")
      .select("*");

  if (
    kategori &&
    kategori !== "Semua"
  ) {
    query = query.ilike(
      "kategori",
      kategori
    );
  }

  if (
    keyword &&
    keyword.trim() !== ""
  ) {
    query = query.or(
      `judul.ilike.%${keyword}%,konten.ilike.%${keyword}%`
    );
  }

  const { data, error } =
    await query;

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Identifikasi[]) || [];
};

export const getArtikelById = async (
  id: number
): Promise<Identifikasi | null> => {

  const { data, error } =
    await supabase
      .from("identifikasi")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Identifikasi;
};