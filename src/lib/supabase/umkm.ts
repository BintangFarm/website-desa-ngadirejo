import { supabase } from "./client";
import imageCompression from "browser-image-compression";

export interface UMKMData {
  id?: string | number;
  namaPemilik: string;
  nama: string;
  kategori: string;
  kontak: string;
  alamat: string;
  produk: string;
  jam: string;
  desc: string;
  koordinat: [number, number];
  status: string;
  image: string;
  images?: string[];
  hari?: string;
  jamBuka?: string;
  jamTutup?: string;
  createdAt?: any;
  isApproved?: boolean;
}

// Helper to convert from frontend camelCase to DB snake_case
const toDBRow = (data: Partial<UMKMData>) => {
  return {
    nama_pemilik: data.namaPemilik,
    nama: data.nama,
    kategori: data.kategori,
    kontak: data.kontak,
    alamat: data.alamat,
    produk: data.produk,
    jam: data.jam,
    desc: data.desc,
    koordinat: data.koordinat,
    status: data.status,
    image: data.image,
    images: data.images,
    hari: data.hari,
    jam_buka: data.jamBuka,
    jam_tutup: data.jamTutup,
    is_approved: data.isApproved,
  };
};

// Helper to convert from DB snake_case to frontend camelCase
const toFrontendObj = (row: any): UMKMData => {
  return {
    id: row.id,
    namaPemilik: row.nama_pemilik,
    nama: row.nama,
    kategori: row.kategori,
    kontak: row.kontak,
    alamat: row.alamat,
    produk: row.produk,
    jam: row.jam,
    desc: row.desc,
    koordinat: row.koordinat,
    status: row.status,
    image: row.image,
    images: row.images || [],
    hari: row.hari,
    jamBuka: row.jam_buka,
    jamTutup: row.jam_tutup,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  };
};

// ==========================================
// COMPRESS & UPLOAD SATU GAMBAR
// ==========================================
// Target: maks 500KB, resolusi maks 1280px (cukup tajam untuk web)
export async function compressAndUploadImage(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. Kompres gambar di browser
    const options = {
      maxSizeMB: 0.5, // Maks 500KB per gambar
      maxWidthOrHeight: 1280, // Maks 1280px (cukup tajam, tidak burik)
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    // 2. Upload ke Supabase Storage
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("umkm-images")
      .upload(filePath, compressedFile);

    if (uploadError) throw uploadError;

    // 3. Ambil public URL
    const { data } = supabase.storage
      .from("umkm-images")
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (error: any) {
    console.error("Error compressing/uploading image:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// UPLOAD BANYAK GAMBAR (maks 5)
// ==========================================
export async function uploadMultipleImages(
  files: File[]
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const limitedFiles = files.slice(0, 5); // Batasi 5 file
    const urls: string[] = [];

    for (const file of limitedFiles) {
      const result = await compressAndUploadImage(file);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      if (result.url) {
        urls.push(result.url);
      }
    }

    return { success: true, urls };
  } catch (error: any) {
    console.error("Error uploading multiple images:", error);
    return { success: false, error: error.message };
  }
}

// Legacy single upload (kept for compatibility)
export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return compressAndUploadImage(file);
}

export async function addUMKM(data: Omit<UMKMData, "id" | "createdAt">) {
  try {
    const payload = toDBRow({
      isApproved: false, // Default pending
      ...data,
    });
    
    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if ((payload as any)[key] === undefined) {
        delete (payload as any)[key];
      }
    });

    const { data: insertedData, error } = await supabase
      .from("umkm")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return { success: true, id: insertedData.id };
  } catch (error: any) {
    console.error("Error adding UMKM: ", error);
    return { success: false, error: error.message };
  }
}

export async function getUMKMList(): Promise<UMKMData[]> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data.map(toFrontendObj);
  } catch (error) {
    console.error("Error fetching UMKM list: ", error);
    return [];
  }
}

export async function getUMKMById(id: string): Promise<UMKMData | null> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) return toFrontendObj(data);
    return null;
  } catch (error) {
    console.error("Error fetching UMKM by id: ", error);
    return null;
  }
}

export async function updateUMKM(id: string, data: Partial<Omit<UMKMData, "id" | "createdAt">>) {
  try {
    const payload = toDBRow(data);
    
    Object.keys(payload).forEach(key => {
      if ((payload as any)[key] === undefined) {
        delete (payload as any)[key];
      }
    });

    const { error } = await supabase
      .from("umkm")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating UMKM: ", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUMKM(id: string) {
  try {
    const { error } = await supabase
      .from("umkm")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting UMKM: ", error);
    return { success: false, error: error.message };
  }
}
