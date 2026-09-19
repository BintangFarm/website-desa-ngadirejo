import { db } from "./config";
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";

const TIMEOUT_MS = 10000;
const withTimeout = <T>(promise: Promise<T>): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Request timeout. Silakan periksa koneksi atau rules Firestore Anda.")), TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export interface UMKMData {
  id?: string | number; // String for Firebase ID, number for legacy dummy data
  namaPemilik: string;
  nama: string;
  kategori: string;
  kontak: string;
  alamat: string;
  produk: string;
  jam: string;
  desc: string;
  koordinat?: [number, number];
  status: string;
  image: string;
  createdAt?: any;
  isApproved?: boolean;
}

const COLLECTION_NAME = "umkm";

export async function addUMKM(data: Omit<UMKMData, "id" | "createdAt">) {
  try {
    const payload: any = {
      isApproved: false, // Default to pending
      ...data,
      createdAt: serverTimestamp(),
    };
    
    // Remove undefined fields as Firestore doesn't support them
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const docRef = await withTimeout(addDoc(collection(db, COLLECTION_NAME), payload));
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding UMKM: ", error);
    return { success: false, error: error.message };
  }
}

export async function getUMKMList(): Promise<UMKMData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const list: UMKMData[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as UMKMData);
    });
    return list;
  } catch (error) {
    console.error("Error fetching UMKM list: ", error);
    return [];
  }
}

export async function getUMKMById(id: string): Promise<UMKMData | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UMKMData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching UMKM by id: ", error);
    return null;
  }
}

export async function updateUMKM(id: string, data: Partial<Omit<UMKMData, "id" | "createdAt">>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Remove undefined fields
    const payload: any = { ...data };
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    await withTimeout(updateDoc(docRef, payload));
    return { success: true };
  } catch (error: any) {
    console.error("Error updating UMKM: ", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUMKM(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await withTimeout(deleteDoc(docRef));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting UMKM: ", error);
    return { success: false, error: error.message };
  }
}
