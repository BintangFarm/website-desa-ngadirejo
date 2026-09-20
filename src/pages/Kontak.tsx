import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { addUMKM, uploadMultipleImages } from "../lib/supabase/umkm";

type Tab = "pesan" | "daftar";

export function Kontak() {
  const [activeTab, setActiveTab] =
    useState<Tab>("pesan");

  // ==========================================
  // KIRIM PESAN
  // ==========================================
  const [pesanForm, setPesanForm] = useState({
    nama: "",
    kontak: "",
    pesan: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitSuccess, setSubmitSuccess] =
    useState(false);

  // ==========================================
  // DAFTAR UMKM
  // ==========================================
  const [umkmForm, setUmkmForm] = useState({
    namaPemilik: "",
    namaUsaha: "",
    kategori: "",
    alamat: "",
    kontak: "",
    deskripsi: "",
    produk: "",

    // Jam operasional
    hari: "Setiap Hari",
    jamBuka: "",
    jamTutup: "",

    koordinat: "",
    imageFiles: [] as File[],
  });

  const [uploadProgress, setUploadProgress] = useState("");



  // ==========================================
  // KIRIM PESAN WHATSAPP
  // ==========================================
  const handleKirimPesan = () => {
    const {
      nama,
      kontak,
      pesan,
    } = pesanForm;

    if (!nama || !kontak || !pesan) {
      return;
    }

    const text = encodeURIComponent(
      `Halo Admin Desa Ngadirejo,\n\nSaya *${nama}*\nKontak: ${kontak}\n\nPesan:\n${pesan}\n\n(dikirim via website desa)`
    );

    window.open(
      `https://wa.me/6285708200215?text=${text}`,
      "_blank"
    );
  };

  // ==========================================
  // DAFTAR UMKM
  // ==========================================
  const handleDaftarUMKM = async () => {
    const {
      namaPemilik,
      namaUsaha,
      kategori,
      alamat,
      koordinat,
      kontak,
      deskripsi,
      hari,
      jamBuka,
      jamTutup,
      produk,
    } = umkmForm;

    // ========================================
    // VALIDASI FIELD WAJIB
    // ========================================
    if (
      !namaPemilik ||
      !namaUsaha ||
      !kontak ||
      !produk ||
      !koordinat
    ) {
      alert(
        "Mohon isi Nama Pemilik, Nama Usaha, No. WhatsApp / Telepon, Produk / Jasa, dan Koordinat."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      // ========================================
      // 1. PARSE KOORDINAT
      // ========================================
      let coordParsed:
        | [number, number]
        | undefined = undefined;

      if (
        koordinat &&
        koordinat.includes(",")
      ) {
        const parts = koordinat.split(",");

        const lat = parseFloat(
          parts[0].trim()
        );

        const lng = parseFloat(
          parts[1].trim()
        );

        if (
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          coordParsed = [lat, lng];
        }
      }

      // ========================================
      // 2. UPLOAD FOTO KE SUPABASE (MAKS 5)
      // ========================================
      let finalImageUrl = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80";
      let allImageUrls: string[] = [];
      
      if (umkmForm.imageFiles.length > 0) {
        setUploadProgress(`Mengompres & mengunggah ${umkmForm.imageFiles.length} foto...`);
        const uploadRes = await uploadMultipleImages(umkmForm.imageFiles);
        setUploadProgress("");
        if (!uploadRes.success) {
          alert("Gagal mengupload foto: " + uploadRes.error);
          setIsSubmitting(false);
          return;
        }
        if (uploadRes.urls && uploadRes.urls.length > 0) {
          finalImageUrl = uploadRes.urls[0]; // Foto pertama jadi sampul
          allImageUrls = uploadRes.urls;
        }
      }

      // ========================================
      // 3. GABUNG JAM OPERASIONAL
      // ========================================
      let jamOperasional = "-";

      if (
        hari &&
        jamBuka &&
        jamTutup
      ) {
        jamOperasional = `${hari}, ${jamBuka} - ${jamTutup} WIB`;
      } else if (hari) {
        jamOperasional = hari;
      }

      // ========================================
      // 4. SIMPAN DATA KE SUPABASE
      // ========================================
      const res = await addUMKM({
        namaPemilik,
        nama: namaUsaha,
        kategori:
          kategori || "Lainnya",
        alamat: alamat || "",
        kontak,
        desc: deskripsi,
        produk,

        // Jam operasional
        jam: jamOperasional,

        status: "Buka",

        // Foto
        image: finalImageUrl,
        images: allImageUrls,

        // Data jam terpisah
        hari: hari || "Setiap Hari",
        jamBuka: jamBuka || "",
        jamTutup: jamTutup || "",

        koordinat: coordParsed,
      } as any);

      // ========================================
      // 6. JIKA BERHASIL
      // ========================================
      if (res.success) {
        setSubmitSuccess(true);

        // ======================================
        // RESET FORM
        // ======================================
        setUmkmForm({
          namaPemilik: "",
          namaUsaha: "",
          kategori: "",
          alamat: "",
          kontak: "",
          deskripsi: "",
          produk: "",

          hari: "Setiap Hari",
          jamBuka: "",
          jamTutup: "",

          koordinat: "",
          imageFiles: [],
        });

        // ======================================
        // HILANGKAN PESAN SUKSES
        // ======================================
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        alert(
          "Gagal mendaftarkan UMKM: " +
            (res.error ||
              "Silakan coba lagi.")
        );
      }
    } catch (e: any) {
      console.error(
        "Error saat mendaftarkan UMKM:",
        e
      );

      alert(
        "Terjadi kesalahan: " +
          (e?.message ||
            "Silakan coba lagi.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RETURN
  // ==========================================
  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50">

      {/* ======================================== */}
      {/* HERO */}
      {/* ======================================== */}
      <div className="bg-primary pt-16 pb-28 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-white rounded-full" />

          <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-white rounded-full" />
        </div>

        <h1 className="relative font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Hubungi Kami
        </h1>

        <p className="relative text-white/80 max-w-2xl mx-auto text-lg">
          Sampaikan pesan atau daftarkan
          UMKM Anda langsung kepada
          pengelola Desa Ngadirejo,
          Kec. Jabung, Kab. Malang.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ======================================== */}
          {/* LEFT - INFORMASI KONTAK */}
          {/* ======================================== */}
          <div className="space-y-5">

            <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">

              <h2 className="font-display text-xl font-bold text-slate-800 mb-5">
                Informasi Kontak
              </h2>

              <div className="space-y-5">

                {/* ALAMAT */}
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Alamat Balai Desa
                    </p>

                    <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                      Desa Ngadirejo,
                      Kecamatan Jabung,
                      <br />
                      Kabupaten Malang,
                      Jawa Timur
                    </p>
                  </div>
                </div>

                {/* TELEPON */}
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Telepon / WhatsApp
                    </p>

                    <a
                      href="https://wa.me/6285708200215"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 text-sm font-medium hover:underline mt-0.5 block"
                    >
                      +62 85708200215
                    </a>

                    <p className="text-slate-400 text-xs">
                      (Admin Desa)
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Surel (Email)
                    </p>

                    <p className="text-slate-500 text-sm mt-0.5">
                      desangadirejo11@gmail.com
                    </p>
                  </div>
                </div>

                {/* JAM PELAYANAN */}
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      Jam Pelayanan
                    </p>

                    <p className="text-slate-500 text-sm mt-0.5">
                      Senin – Kamis: 08.00 – 15.00
                    </p>

                    <p className="text-slate-500 text-sm">
                      Jumat: 08.00 – 14.00 WIB
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* INFO GRATIS */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex gap-3 items-start">

              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

              <div>
                <p className="font-bold text-emerald-800 text-sm">
                  Pendaftaran UMKM Gratis
                </p>

                <p className="text-emerald-700/80 text-xs mt-1 leading-relaxed">
                  Tidak ada biaya apapun.
                  Program ini merupakan
                  dedikasi KKN untuk
                  kemajuan UMKM lokal
                  Desa Ngadirejo.
                </p>
              </div>

            </div>

          </div>

          {/* ======================================== */}
          {/* RIGHT - FORM */}
          {/* ======================================== */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-slate-100 p-6 md:p-8">

            {/* TAB HEADER */}
            <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5 mb-7">

              <button
                id="tab-kirim-pesan"
                type="button"
                onClick={() =>
                  setActiveTab("pesan")
                }
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",

                  activeTab === "pesan"
                    ? "bg-white shadow text-emerald-700"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <MessageSquare className="w-4 h-4" />

                Kirim Pesan
              </button>

              <button
                id="tab-daftar-umkm"
                type="button"
                onClick={() =>
                  setActiveTab("daftar")
                }
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",

                  activeTab === "daftar"
                    ? "bg-white shadow text-emerald-700"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <PlusCircle className="w-4 h-4" />

                Daftar UMKM Baru
              </button>

            </div>

            {/* ======================================== */}
            {/* TAB KIRIM PESAN */}
            {/* ======================================== */}
            {activeTab === "pesan" && (
              <div className="space-y-5">

                {/* NAMA */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap{" "}
                    <span className="text-red-400">
                      *
                    </span>
                  </label>

                  <input
                    id="pesan-nama"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={pesanForm.nama}
                    onChange={(e) =>
                      setPesanForm({
                        ...pesanForm,
                        nama: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* KONTAK */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    No. WhatsApp / Email{" "}
                    <span className="text-red-400">
                      *
                    </span>
                  </label>

                  <input
                    id="pesan-kontak"
                    type="text"
                    placeholder="Contoh: 081234xxxx atau email@domain.com"
                    value={pesanForm.kontak}
                    onChange={(e) =>
                      setPesanForm({
                        ...pesanForm,
                        kontak: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* PESAN */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Isi Pesan{" "}
                    <span className="text-red-400">
                      *
                    </span>
                  </label>

                  <textarea
                    id="pesan-isi"
                    rows={5}
                    placeholder="Tuliskan pertanyaan, saran, atau aspirasi Anda di sini..."
                    value={pesanForm.pesan}
                    onChange={(e) =>
                      setPesanForm({
                        ...pesanForm,
                        pesan: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                  />
                </div>

                {/* BUTTON PESAN */}
                <button
                  id="btn-kirim-pesan"
                  type="button"
                  onClick={
                    handleKirimPesan
                  }
                  disabled={
                    !pesanForm.nama ||
                    !pesanForm.kontak ||
                    !pesanForm.pesan
                  }
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  Kirim via WhatsApp

                  <Send className="w-4 h-4" />
                </button>

                <p className="text-slate-400 text-xs text-center">
                  Pesan akan dikirim langsung
                  ke WhatsApp admin desa.
                </p>

              </div>
            )}

            {/* ======================================== */}
            {/* TAB DAFTAR UMKM */}
            {/* ======================================== */}
            {activeTab === "daftar" && (
              <div className="space-y-5">

                {/* NAMA PEMILIK + NAMA USAHA */}
                <div className="grid sm:grid-cols-2 gap-4">

                  {/* NAMA PEMILIK */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nama Pemilik{" "}
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      id="umkm-nama-pemilik"
                      type="text"
                      placeholder="Nama lengkap pemilik usaha"
                      value={
                        umkmForm.namaPemilik
                      }
                      onChange={(e) =>
                        setUmkmForm({
                          ...umkmForm,
                          namaPemilik:
                            e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>

                  {/* NAMA USAHA */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nama Usaha{" "}
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      id="umkm-nama-usaha"
                      type="text"
                      placeholder="Nama usaha / brand"
                      value={
                        umkmForm.namaUsaha
                      }
                      onChange={(e) =>
                        setUmkmForm({
                          ...umkmForm,
                          namaUsaha:
                            e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>

                </div>

                {/* KATEGORI + KONTAK */}
                <div className="grid sm:grid-cols-2 gap-4">

                  {/* KATEGORI */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Kategori Usaha
                    </label>

                    <select
                      id="umkm-kategori"
                      value={
                        umkmForm.kategori
                      }
                      onChange={(e) =>
                        setUmkmForm({
                          ...umkmForm,
                          kategori:
                            e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-white"
                    >
                      <option value="">
                        Pilih kategori...
                      </option>

                      <option value="Kuliner">
                        Kuliner & Makanan
                      </option>

                      <option value="Pertanian">
                        Pertanian &
                        Perkebunan
                      </option>

                      <option value="Kerajinan">
                        Kerajinan Tangan
                      </option>

                      <option value="Jasa">
                        Jasa & Layanan
                      </option>

                      <option value="Peternakan">
                        Peternakan
                      </option>

                      <option value="Lainnya">
                        Lainnya
                      </option>
                    </select>
                  </div>

                  {/* KONTAK */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      No. WhatsApp / Telepon{" "}
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      id="umkm-kontak"
                      type="text"
                      placeholder="Contoh: 081234xxxx"
                      value={
                        umkmForm.kontak
                      }
                      onChange={(e) =>
                        setUmkmForm({
                          ...umkmForm,
                          kontak:
                            e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>

                </div>

                {/* ALAMAT */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Alamat Usaha
                  </label>

                  <input
                    id="umkm-alamat"
                    type="text"
                    placeholder="Contoh: Dusun Krajan RT 01, Desa Ngadirejo"
                    value={
                      umkmForm.alamat
                    }
                    onChange={(e) =>
                      setUmkmForm({
                        ...umkmForm,
                        alamat:
                          e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* PRODUK / JASA */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Produk / Jasa Tertentu{" "}
                    <span className="text-red-400">
                      *
                    </span>
                  </label>

                  <input
                    id="umkm-produk"
                    type="text"
                    placeholder="Contoh: Kripik Tempe, Jasa Pijat"
                    value={
                      umkmForm.produk
                    }
                    onChange={(e) =>
                      setUmkmForm({
                        ...umkmForm,
                        produk:
                          e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* ======================================== */}
                {/* JAM OPERASIONAL */}
                {/* ======================================== */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Jam Operasional
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* HARI OPERASIONAL */}
                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Hari Operasional
                      </label>

                      <input
                        id="umkm-hari"
                        type="text"
                        value={
                          umkmForm.hari
                        }
                        onChange={(e) =>
                          setUmkmForm({
                            ...umkmForm,
                            hari: e.target.value,
                          })
                        }
                        placeholder="Contoh: Setiap Hari"
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition"
                      />

                    </div>

                    {/* JAM BUKA */}
                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Jam Buka
                      </label>

                      <input
                        id="umkm-jam-buka"
                        type="time"
                        value={
                          umkmForm.jamBuka
                        }
                        onChange={(e) =>
                          setUmkmForm({
                            ...umkmForm,
                            jamBuka:
                              e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition bg-white"
                      />

                    </div>

                    {/* JAM TUTUP */}
                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Jam Tutup
                      </label>

                      <input
                        id="umkm-jam-tutup"
                        type="time"
                        value={
                          umkmForm.jamTutup
                        }
                        onChange={(e) =>
                          setUmkmForm({
                            ...umkmForm,
                            jamTutup:
                              e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition bg-white"
                      />

                    </div>

                  </div>

                  {/* PREVIEW JAM */}
                  <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">

                    <p className="text-xs text-emerald-600 font-medium mb-1">
                      Preview Jam Operasional
                    </p>

                    <p className="text-sm font-semibold text-emerald-800">
                      {umkmForm.hari ||
                        "Hari belum diisi"}
                    </p>

                    <p className="text-sm text-emerald-700 mt-0.5">
                      {umkmForm.jamBuka ||
                        "--:--"}{" "}
                      -{" "}
                      {umkmForm.jamTutup ||
                        "--:--"}{" "}
                      WIB
                    </p>

                  </div>

                </div>

                {/* ======================================== */}
                {/* DESKRIPSI */}
                {/* ======================================== */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Deskripsi Produk / Jasa
                  </label>

                  <textarea
                    id="umkm-deskripsi"
                    rows={4}
                    placeholder="Ceritakan produk atau jasa yang Anda tawarkan..."
                    value={
                      umkmForm.deskripsi
                    }
                    onChange={(e) =>
                      setUmkmForm({
                        ...umkmForm,
                        deskripsi:
                          e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                  />

                </div>

                {/* ======================================== */}
                {/* FOTO PRODUK / USAHA (MAKS 5) */}
                {/* ======================================== */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Foto Produk / Usaha{" "}
                    <span className="text-slate-400 font-normal">
                      (Maks. 5 foto, otomatis dikompres)
                    </span>
                  </label>

                  <input
                    id="umkm-image-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        const combined = [...umkmForm.imageFiles, ...newFiles].slice(0, 5);
                        setUmkmForm({
                          ...umkmForm,
                          imageFiles: combined,
                        });
                      }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition"
                  />
                  
                  {umkmForm.imageFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-slate-500 font-medium">
                        {umkmForm.imageFiles.length}/5 foto dipilih (foto pertama = sampul)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {umkmForm.imageFiles.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${idx + 1}`}
                              className={cn(
                                "w-16 h-16 object-cover rounded-lg border-2",
                                idx === 0 ? "border-emerald-400" : "border-slate-200"
                              )}
                            />
                            {idx === 0 && (
                              <span className="absolute -top-1 -left-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                Sampul
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setUmkmForm({
                                  ...umkmForm,
                                  imageFiles: umkmForm.imageFiles.filter((_, i) => i !== idx),
                                });
                              }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadProgress && (
                    <div className="mt-2 flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
                      <p className="text-xs text-amber-700 font-medium">{uploadProgress}</p>
                    </div>
                  )}
                </div>

                {/* ======================================== */}
                {/* KOORDINAT MAPS */}
                {/* ======================================== */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Koordinat Lokasi Maps{" "}
                    <span className="text-red-400">
                      *
                    </span>
                  </label>

                  <input
                    id="umkm-koordinat"
                    type="text"
                    placeholder="Contoh: -7.9923, 112.7838"
                    value={
                      umkmForm.koordinat
                    }
                    onChange={(e) =>
                      setUmkmForm({
                        ...umkmForm,
                        koordinat:
                          e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />

                  <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">

                    <svg
                      className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0z"
                      />
                    </svg>

                    <div>

                      <p className="text-xs text-blue-700 leading-relaxed">
                        Format:{" "}
                        <strong>
                          latitude,
                          longitude
                        </strong>{" "}
                        (pisahkan dengan koma).
                        Cara mendapatkan
                        koordinat: buka{" "}
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="underline font-semibold hover:text-blue-900"
                        >
                          Google Maps
                        </a>
                        , klik kanan pada
                        lokasi usaha Anda,
                        lalu salin angka
                        koordinat yang muncul.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ======================================== */}
                {/* SUCCESS MESSAGE */}
                {/* ======================================== */}
                {submitSuccess ? (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 mb-4">

                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />

                    <p className="text-sm font-medium">
                      Pendaftaran berhasil
                      dikirim! Mohon tunggu
                      konfirmasi dari Admin.
                    </p>

                  </div>
                ) : null}

                {/* ======================================== */}
                {/* BUTTON SUBMIT */}
                {/* ======================================== */}
                <button
                  id="btn-daftar-umkm"
                  type="button"
                  onClick={
                    handleDaftarUMKM
                  }
                  disabled={
                    !umkmForm.namaPemilik ||
                    !umkmForm.namaUsaha ||
                    !umkmForm.kontak ||
                    isSubmitting
                  }
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >

                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />

                      Kirim Pendaftaran UMKM
                    </>
                  )}

                </button>

                <p className="text-slate-400 text-xs text-center">
                  Data pendaftaran akan
                  dikirim ke sistem untuk
                  ditinjau oleh admin.
                  Pendaftaran sepenuhnya
                  gratis.
                </p>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}