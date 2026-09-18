import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function Kontak() {
  // --- Kirim Pesan state ---
  const [pesanForm, setPesanForm] = useState({ nama: "", kontak: "", pesan: "" });

  const handleKirimPesan = () => {
    const { nama, kontak, pesan } = pesanForm;
    if (!nama || !kontak || !pesan) return;
    const text = encodeURIComponent(
      `Halo Admin Desa Ngadirejo,\n\nSaya *${nama}*\nKontak: ${kontak}\n\nPesan:\n${pesan}\n\n(dikirim via website desa)`
    );
    window.open(`https://wa.me/6285735784978?text=${text}`, "_blank");
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
          Sampaikan pesan Anda langsung kepada pengelola Desa Ngadirejo, Kec. Jabung, Kab. Malang.
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
                      href="https://wa.me/6285735784978"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 text-sm font-medium hover:underline mt-0.5 block"
                    >
                      +62 857-3578-4978
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
                <p className="font-bold text-emerald-800 text-sm">Layanan Gratis</p>
                <p className="text-emerald-700/80 text-xs mt-1 leading-relaxed">
                  Layanan desa ini diberikan secara gratis tanpa dipungut biaya apapun.
                </p>
              </div>
            </div>
          </div>

          {/* === RIGHT: Form Kirim Pesan === */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-slate-100 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-slate-800 mb-6">Kirim Pesan</h2>
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
          </div>

        </div>
      </div>
    </div>
  );
}
