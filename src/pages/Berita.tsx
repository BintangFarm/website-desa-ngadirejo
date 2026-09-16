import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const KATEGORI = ["Semua", "Kegiatan Desa", "Pembangunan", "UMKM", "Wisata", "Pendidikan", "Kesehatan"];

export function Berita() {
  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50">
      <div className="bg-primary pt-16 pb-24 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Berita & Kegiatan</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Kabar terbaru seputar pembangunan, kegiatan masyarakat, dan pengumuman desa.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main News */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex overflow-x-auto hide-scrollbar gap-2 mb-2">
              {KATEGORI.map((cat, i) => (
                <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col sm:flex-row group">
                <div className="sm:w-64 h-48 sm:h-auto overflow-hidden relative shrink-0">
                  <img src={`https://images.unsplash.com/photo-1579893962635-f09459b7edfe?q=80&w=600&auto=format&fit=crop&sig=${i}`} alt="Berita" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">Kategori Berita</div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <Calendar className="w-4 h-4" /> 12 Agustus 2024
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-3 group-hover:text-primary transition-colors">Judul Berita atau Kegiatan Masyarakat Ngadirejo</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    Data konten berita akan diperbarui secara berkala oleh admin atau perangkat Desa Ngadirejo melalui sistem manajemen konten.
                  </p>
                  <Link to="#" className="inline-flex items-center gap-1 text-primary font-semibold text-sm">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Agenda Sidebar */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-accent" /> Agenda Desa
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  "Gotong Royong Bersih Desa", 
                  "Posyandu Balita & Lansia", 
                  "Musyawarah Perencanaan Pembangunan", 
                  "Pelatihan Pemasaran Digital UMKM"
                ].map((agenda, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-800 text-sm">{agenda}</div>
                      </div>
                      <div className="text-slate-500 text-xs mt-1">Jadwal akan diperbarui</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
