import { Storage } from "@google-cloud/storage";

// GANTI dengan path ke file service account key JSON kamu
// Download dari: Firebase Console > Project Settings > Service Accounts > Generate New Private Key
const KEY_PATH = "./serviceAccountKey.json";
const BUCKET_NAME = "lapak-ngadirejo.firebasestorage.app";

const storage = new Storage({ keyFilename: KEY_PATH });

const corsConfig = [
  {
    origin: ["*"],
    method: ["GET", "POST", "PUT", "DELETE", "HEAD"],
    maxAgeSeconds: 3600,
    responseHeader: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "User-Agent",
      "x-goog-resumable",
      "Access-Control-Allow-Origin",
    ],
  },
];

async function setCors() {
  try {
    await storage.bucket(BUCKET_NAME).setCorsConfiguration(corsConfig);
    console.log("✅ CORS berhasil dikonfigurasi untuk bucket:", BUCKET_NAME);
    console.log("Sekarang upload foto UMKM sudah bisa berjalan!");
  } catch (err) {
    console.error("❌ Gagal set CORS:", err.message);
    console.log("\nPastikan serviceAccountKey.json sudah ada di folder ini.");
  }
}

setCors();
