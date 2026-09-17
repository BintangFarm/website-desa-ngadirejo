import { useParams, Link, Navigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, User, Clock, Share2, 
  Info, Image as ImageIcon, MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { DUMMY_UMKM } from "./Home";
import { getUMKMById, UMKMData } from "../lib/firebase/umkm";
import { cn } from "../lib/utils";

export function UMKMDetail() {
  const { id } = useParams();
  const [umkm, setUmkm] = useState<UMKMData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      const data = await getUMKMById(id);
      if (data) {
        setUmkm(data);
      } else {
        const dummy = DUMMY_UMKM.find(u => u.id === Number(id));
        if (dummy) setUmkm(dummy as UMKMData);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!umkm) return <Navigate to="/#daftar-umkm" />;

  const pemilik = umkm.namaPemilik || (umkm.id === 1 ? "Bapak Luvian Wijaya" : "Warga Desa Ngadirejo");
  const alamat = umkm.alamat || (umkm.id === 1 
    ? "Rt 04/ Rw 01, Dusun Krajan, Desa Ngadirejo, Kecamatan Jabung, Kabupaten Malang" 
    : "Desa Ngadirejo, Kecamatan Jabung, Kabupaten Malang");
  const whatsapp = umkm.kontak || "6281234567890"; // Use real contact if available
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `UMKM Desa Ngadirejo: ${umkm.nama}`,
        text: `Lihat profil usaha ${umkm.nama} di website Desa Ngadirejo!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan berhasil disalin!");
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="h-[50vh] min-h-[400px] relative mt-16 md:mt-20">
        <img 
          src={umkm.image} 
          alt={umkm.nama} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        
        {/* Navigation & Header Content */}
        <div className="absolute inset-0 pt-8 pb-12 px-4 md:px-6 container mx-auto flex flex-col justify-between z-10">
          
          <div>
            <Link 
              to="/#daftar-umkm" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/30 transition-all border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar UMKM
            </Link>
          </div>

          <div>
            <div className="inline-block px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              {umkm.kategori}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {umkm.nama}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <User className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-lg">Pemilik: {pemilik}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Kiri: Tentang Usaha & Galeri */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tentang Usaha */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-emerald-600" />
                Tentang Usaha Ini
              </h2>
              <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {umkm.desc}
              </div>
            </section>

            {/* Galeri Foto */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-emerald-600" />
                Galeri Foto
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 group">
                    <img 
                      src={`${umkm.image}?auto=format&fit=crop&w=600&h=450&sig=${i}`} 
                      alt={`Galeri ${i}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Kanan: Sidebar Informasi Kontak */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8 sticky top-28">
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-8">Informasi Kontak</h3>
              
              <div className="space-y-6">
                
                {/* Alamat */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5">Alamat Lengkap</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{alamat}</p>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-2">Jam Operasional</h4>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-[11px] font-bold tracking-wide uppercase mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {umkm.status}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{umkm.jam}</p>
                  </div>
                </div>

              </div>

              <div className="mt-8 space-y-3">
                <a 
                  href={`https://wa.me/${whatsapp}?text=Halo%20${pemilik},%20saya%20melihat%20usaha%20${umkm.nama}%20di%20website%20Desa%20Ngadirejo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Hubungi via WhatsApp
                </a>
                
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Bagikan Profil Usaha
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
