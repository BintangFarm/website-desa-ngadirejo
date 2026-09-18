import { MapPin, Phone, Mail, Clock, Send, Store, CheckCircle2, MessageSquare, PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

type Tab = "pesan" | "daftar";

export function Kontak() {
  const [activeTab, setActiveTab] = useState<Tab>("pesan");

  // --- Kirim Pesan state ---
  const [pesanForm, setPesanForm] = useState({ nama: "", kontak: "", pesan: "" });

  // --- Daftar UMKM state ---
  const [umkmForm, setUmkmForm] = useState({
    namaPemilik: "",
    namaUsaha: "",
    kategori: "",
    alamat: "",
    kontak: "",
    deskripsi: "",
    produk: "",
    jamOperasional: "",
    koordinat: "",
  });

  const handleKirimPesan = () => {
    const { nama, kontak, pesan } = pesanForm;
    if (!nama || !kontak || !pesan) return;
    const text = encodeURIComponent(
      `Halo Admin Desa Ngadirejo,\n\nSaya *${nama}*\nKontak: ${kontak}\n\nPesan:\n${pesan}\n\n(dikirim via website desa)`
    );
    window.open(`https://wa.me/6285708200215?text=${text}`, "_blank");
  };

  const handleDaftarUMKM = () => {
    const { namaPemilik, namaUsaha, kategori, alamat, koordinat, kontak, deskripsi } = umkmForm;
    if (!namaPemilik || !namaUsaha || !kontak) return;
    
    const koordinatText = koordinat ? `\n*Koordinat Maps:* ${koordinat}` : "";
    
    const text = encodeURIComponent(
      `Halo Admin Desa Ngadirejo,\n\nSaya ingin mendaftarkan UMKM saya:\n\n*Nama Pemilik:* ${namaPemilik}\n*Nama Usaha:* ${namaUsaha}\n*Kategori:* ${kategori}\n*Alamat Usaha:* ${alamat}${koordinatText}\n*Kontak:* ${kontak}\n*Deskripsi Produk/Jasa:*\n${deskripsi}\n\n(dikirim via website desa)`
    );
    window.open(`https://wa.me/6285708200215?text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50">
      {/* Hero */}
      <div className="bg-primary pt-16 pb-28 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-white rounded-full" />
          <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-white rounded-full" />
        </div>
        <h1 className="relative font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Hubungi Kami
        </h1>
        <p className="relative text-white/80 max-w-2xl mx-auto text-lg">
          Sampaikan pesan atau daftarkan UMKM Anda langsung kepada pengelola Desa Ngadirejo, Kec. Jabung, Kab. Malang.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* === LEFT: Info Kontak === */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
              <h2 className="font-display text-xl font-bold text-slate-800 mb-5">Informasi Kontak</h2>
              <div className="space-y-5">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Alamat Balai Desa</p>
                    <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                      Desa Ngadirejo, Kecamatan Jabung,<br />Kabupaten Malang, Jawa Timur
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Telepon / WhatsApp</p>
                    <a
                      href="https://wa.me/6285708200215"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 text-sm font-medium hover:underline mt-0.5 block"
                    >
                      +62 85708200215
                    </a>
                    <p className="text-slate-400 text-xs">(Admin Desa)</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Surel (Email)</p>
                    <p className="text-slate-500 text-sm mt-0.5">desangadirejo11@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Jam Pelayanan</p>
                    <p className="text-slate-500 text-sm mt-0.5">Senin – Kamis: 08.00 – 15.00</p>
                    <p className="text-slate-500 text-sm">Jumat: 08.00 – 14.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info gratis */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">Pendaftaran UMKM Gratis</p>
                <p className="text-emerald-700/80 text-xs mt-1 leading-relaxed">
                  Tidak ada biaya apapun. Program ini merupakan dedikasi KKN untuk kemajuan UMKM lokal Desa Ngadirejo.
                </p>
              </div>
            </div>
          </div>

          {/* === RIGHT: Tab Form === */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-slate-100 p-6 md:p-8">
            {/* Tab Header */}
            <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5 mb-7">
              <button
                id="tab-kirim-pesan"
                onClick={() => setActiveTab("pesan")}
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
                onClick={() => setActiveTab("daftar")}
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

            {/* TAB: Kirim Pesan */}
            {activeTab === "pesan" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="pesan-nama"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={pesanForm.nama}
                    onChange={(e) => setPesanForm({ ...pesanForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    No. WhatsApp / Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="pesan-kontak"
                    type="text"
                    placeholder="Contoh: 081234xxxx atau email@domain.com"
                    value={pesanForm.kontak}
                    onChange={(e) => setPesanForm({ ...pesanForm, kontak: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Isi Pesan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="pesan-isi"
                    rows={5}
                    placeholder="Tuliskan pertanyaan, saran, atau aspirasi Anda di sini..."
                    value={pesanForm.pesan}
                    onChange={(e) => setPesanForm({ ...pesanForm, pesan: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                  />
                </div>
                <button
                  id="btn-kirim-pesan"
                  onClick={handleKirimPesan}
                  disabled={!pesanForm.nama || !pesanForm.kontak || !pesanForm.pesan}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  Kirim via WhatsApp
                  <Send className="w-4 h-4" />
                </button>
                <p className="text-slate-400 text-xs text-center">
                  Pesan akan dikirim langsung ke WhatsApp admin desa.
                </p>
              </div>
            )}

            {/* TAB: Daftar UMKM */}
            {activeTab === "daftar" && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nama Pemilik <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="umkm-nama-pemilik"
                      type="text"
                      placeholder="Nama lengkap pemilik usaha"
                      value={umkmForm.namaPemilik}
                      onChange={(e) => setUmkmForm({ ...umkmForm, namaPemilik: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nama Usaha <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="umkm-nama-usaha"
                      type="text"
                      placeholder="Nama usaha / brand"
                      value={umkmForm.namaUsaha}
                      onChange={(e) => setUmkmForm({ ...umkmForm, namaUsaha: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Kategori Usaha
                    </label>
                    <select
                      id="umkm-kategori"
                      value={umkmForm.kategori}
                      onChange={(e) => setUmkmForm({ ...umkmForm, kategori: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-white"
                    >
                      <option value="">Pilih kategori...</option>
                      <option value="Kuliner">Kuliner & Makanan</option>
                      <option value="Pertanian">Pertanian & Perkebunan</option>
                      <option value="Kerajinan">Kerajinan Tangan</option>
                      <option value="Jasa">Jasa & Layanan</option>
                      <option value="Peternakan">Peternakan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      No. WhatsApp / Telepon <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="umkm-kontak"
                      type="text"
                      placeholder="Contoh: 081234xxxx"
                      value={umkmForm.kontak}
                      onChange={(e) => setUmkmForm({ ...umkmForm, kontak: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Alamat Usaha
                  </label>
                  <input
                    id="umkm-alamat"
                    type="text"
                    placeholder="Contoh: Dusun Krajan RT 01, Desa Ngadirejo"
                    value={umkmForm.alamat}
                    onChange={(e) => setUmkmForm({ ...umkmForm, alamat: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition "
                  />
                </div>

                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Produk / Jasa
                    </label>
                    <select
                      id="umkm-produk"
                      value={umkmForm.produk}
                      onChange={(e) => setUmkmForm({ ...umkmForm, produk: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-white"
                    >
                      <option value="">Pilih produk / jasa...</option>
                      <option value="Kuliner">Kuliner & Makanan</option>
                      <option value="Pertanian">Pertanian & Perkebunan</option>
                      <option value="Kerajinan">Kerajinan Tangan</option>
                      <option value="Jasa">Jasa & Layanan</option>
                      <option value="Peternakan">Peternakan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Jam Operasional <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="umkm-jam-operasional"
                      type="text"
                      placeholder="Contoh: 081234xxxx"
                      value={umkmForm.jamOperasional}
                      onChange={(e) => setUmkmForm({ ...umkmForm, jamOperasional: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Deskripsi Produk / Jasa
                  </label>
                  <textarea
                    id="umkm-deskripsi"
                    rows={4}
                    placeholder="Ceritakan produk atau jasa yang Anda tawarkan..."
                    value={umkmForm.deskripsi}
                    onChange={(e) => setUmkmForm({ ...umkmForm, deskripsi: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Koordinat Lokasi Maps <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    id="umkm-koordinat"
                    type="text"
                    placeholder="Contoh: -7.9923, 112.7838"
                    value={umkmForm.koordinat}
                    onChange={(e) => setUmkmForm({ ...umkmForm, koordinat: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                  <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Format: <strong>latitude, longitude</strong> (pisahkan dengan koma).
                        Cara mendapatkan koordinat: buka{" "}
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="underline font-semibold hover:text-blue-900"
                        >
                          Google Maps
                        </a>
                        , klik kanan pada lokasi usaha Anda, lalu salin angka koordinat yang muncul.
                      </p>
                    </div>
                  </div>
                </div>


                <button
                  id="btn-daftar-umkm"
                  onClick={handleDaftarUMKM}
                  disabled={!umkmForm.namaPemilik || !umkmForm.namaUsaha || !umkmForm.kontak}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  <Store className="w-4 h-4" />
                  Daftar via WhatsApp
                </button>
                <p className="text-slate-400 text-xs text-center">
                  Data pendaftaran akan dikirim ke WhatsApp admin desa. Pendaftaran sepenuhnya gratis.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
