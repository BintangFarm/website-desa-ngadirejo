import { useState } from "react";
import { 
  MapPin, Info, Users, Shield, Map, Leaf, Trees, 
  Map as MapIcon, Compass, ShoppingBag, Store, ArrowRight, 
  Sun, Droplets, Mountain, Tent, ExternalLink, Activity, X
} from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";


const DATA_WISATA = [
  {
    name: "Coban Jidor",
    cat: "Air Terjun",
    img: "/wisata/coban-jidor.jpg",
    desc: "Air terjun tersembunyi dengan aliran air yang sangat jernih dan segar. Dipercaya oleh masyarakat sekitar dulunya sebagai tempat singgah para leluhur."
  },
  {
    name: "Coban Jodo",
    cat: "Air Terjun",
    img: "/wisata/Coban-Jodo.jpg",
    desc: "Memiliki dua aliran air yang saling berdampingan, dinamakan 'Jodo' (Jodoh) karena sering dikaitkan dengan mitos pertemuan dua insan."
  },
  {
    name: "Coban Singo",
    cat: "Air Terjun",
    img: "/wisata/arema.png",
    desc: "Aliran air terjun ini cukup deras dengan formasi batu yang menyerupai singa. Area ini sering digunakan untuk camping."
  },
  {
    name: "Coban Kricik",
    cat: "Air Terjun",
    img: "/wisata/coban kricik.jpg",
    desc: "Air terjun berundak kecil-kecil yang menghasilkan suara 'gemricik' air yang menenangkan. Sangat cocok untuk wisata keluarga."
  },
  {
    name: "Coban Suko",
    cat: "Air Terjun",
    img: "/wisata/coban suko.png",
    desc: "Lokasinya cukup menantang untuk dicapai, namun menyuguhkan panorama perbukitan Jabung yang luar biasa asri."
  },
  {
    name: "Agrowisata Durian",
    cat: "Kebun Wisata",
    img: "/wisata/agrosiwata durian.png",
    desc: "Kawasan yang terintegrasi antara perkebunan durian dan wisata edukasi alam. Pengunjung dapat memetik dan menikmati durian langsung di bawah pohon."
  },
];

export function Profil() {
  const [selectedDetail, setSelectedDetail] = useState<{name: string, cat: string, img: string, desc: string} | null>(null);

  return (
    <div className="flex flex-col w-full pb-20 bg-background font-sans relative">
      
      {/* 1. Hero Profil Desa */}
      <div className="bg-primary pt-16 pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621516627043-4f9644365315?q=80&w=2000&auto=format&fit=crop')] opacity-10 mix-blend-overlay object-cover"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent opacity-80" />
        <h1 className="relative z-10 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Profil Desa Ngadirejo</h1>
        <p className="relative z-10 text-white/90 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
          Kenali lebih dekat sejarah, letak geografis, kondisi masyarakat, hingga kekayaan alam dan potensi desa kami.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-10 space-y-16 lg:space-y-24">
        
        {/* 2. Tentang Desa Ngadirejo & Geografis (Existing) */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 p-8 md:p-12 border border-slate-100">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px] group">
              <img 
                src="/bgprofil.jpg"
                alt="Pemandangan Desa Ngadirejo" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary font-bold text-sm rounded-full mb-4">
                  <Info className="w-4 h-4" /> Tentang Desa
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                  Mengenal Desa Ngadirejo
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  Desa Ngadirejo adalah desa yang terletak di Kecamatan Jabung, Kabupaten Malang, Jawa Timur. 
                  Dikelilingi oleh keindahan alam pegunungan, Ngadirejo tumbuh menjadi desa yang mengedepankan 
                  kemandirian ekonomi melalui UMKM dan pariwisata, dengan tetap menjaga kelestarian lingkungan dan kearifan lokal.
                </p>
                
                <h3 className="font-display text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary" /> Geografis & Batas Wilayah
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Secara geografis, wilayah Ngadirejo didominasi oleh area dataran tinggi dan perbukitan dengan pesona alam yang asri.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Utara", desc: "Desa Banjaranyar" },
                    { label: "Timur", desc: "Desa Banjaranyar" },
                    { label: "Selatan", desc: "Desa Wates" },
                    { label: "Barat", desc: "Desa Sonobekel" },
                  ].map((batas) => (
                    <div key={batas.label} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="block font-bold text-slate-800 text-sm mb-0.5">{batas.label}</span>
                      <span className="text-xs text-slate-500">{batas.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Data Singkat Desa */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <MapPin className="w-6 h-6" />, label: "Luas Wilayah", value: "16,43 km²", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: <Users className="w-6 h-6" />, label: "Penduduk", value: "±2,1 Ribu", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: <Mountain className="w-6 h-6" />, label: "Karakter Wilayah", value: "Perbukitan", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: <Compass className="w-6 h-6" />, label: "Potensi", value: "Desa Wisata", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className={cn("w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <h4 className="font-display font-bold text-2xl text-slate-800 mb-1">{stat.value}</h4>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>


        {/* Section Wisata */}
        <section className="bg-slate-50 py-16 px-4 md:px-12 rounded-[3rem] border border-slate-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 font-bold text-sm rounded-full mb-4">
              <Droplets className="w-4 h-4" /> Eksplorasi Alam
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Wisata Desa Ngadirejo
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium italic">
              "Dari alam, menjadi pengalaman."
            </p>
            <p className="text-slate-600 max-w-3xl mx-auto mt-4">
              Ngadirejo memiliki bentang alam perbukitan, aliran sungai, kawasan hijau, dan sejumlah air terjun yang menjadi bagian dari potensi wisata desa yang layak untuk dijelajahi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATA_WISATA.map((wisata, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setSelectedDetail(wisata)}>
                <img src={wisata.img} alt={wisata.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{wisata.cat}</span>
                  <h3 className="font-display text-xl font-bold text-white mb-2">{wisata.name}</h3>
                  <button className="text-sm text-white font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    Lihat Sejarah & Detail <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Pengalaman di Ngadirejo */}
        <section className="py-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-800 mb-4">Pengalaman di Ngadirejo</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Ragam aktivitas dan pesona yang menanti Anda di desa kami.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Jelajah Alam", desc: "Menikmati segarnya coban, sungai, dan lanskap perbukitan hijau.", icon: <Compass className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600" },
              { title: "Agrowisata", desc: "Mengenal kebun kopi, durian, serta aktivitas pertanian masyarakat.", icon: <Leaf className="w-6 h-6" />, color: "bg-amber-50 text-amber-600" },
              { title: "Produk Lokal", desc: "Mengenal dan menikmati hasil bumi serta kreasi unggulan UMKM.", icon: <ShoppingBag className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
              { title: "Kehidupan Desa", desc: "Berasimilasi dengan keramahan masyarakat dan kearifan lokal.", icon: <Users className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
            ].map((exp, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", exp.color)}>
                  {exp.icon}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{exp.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Integrasi Peta Potensi (Modified Existing Map) */}
        <div className="bg-slate-50 p-2 md:p-3 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
          <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Lokasi Geografis
            </h3>
            <p className="text-xs text-slate-500 mt-1">Titik pusat Desa Ngadirejo</p>
          </div>
          <iframe 
            src="https://maps.google.com/maps?q=-7.9923,112.7838&z=14&output=embed" 
            className="w-full h-[400px] rounded-[2rem] grayscale-[10%] hover:grayscale-0 transition-all duration-500"
            style={{ border: 0 }}
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <a 
              href="https://maps.app.goo.gl/MCVoSu8FT95bnhMC7" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <ExternalLink className="w-4 h-4" /> Buka di Google Maps
            </a>
            <Link
              to="/#peta-sebaran"
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-full shadow-lg font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap text-sm"
            >
              Lihat Peta Sebaran UMKM
            </Link>
          </div>
        </div>

        {/* 10. Sejarah & Kondisi Masyarakat (Existing Kept) */}
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          <div className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-800">Sejarah Desa</h3>
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Sebagai bagian integral dari lereng Bromo, Desa Ngadirejo mencatat tonggak sejarah penting pada tahun 2017 dengan transformasi besar-besaran menjadi Desa Wisata. Diinisiasi oleh semangat Kelompok Sadar Wisata (Pokdarwis) setempat, desa ini berhasil mengukir prestasi hingga kancah nasional dengan mengoptimalkan potensi kawasan "Seribu Coban".
              </p>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-800">Kondisi Masyarakat</h3>
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Masyarakat Ngadirejo hidup rukun dan dikenal dengan nilai gotong royong yang kental. Dulunya sangat bertumpu pada sektor agraris, kini warga mulai merangkul tren pariwisata dengan turut mengelola wisata dan kuliner ikonik seperti "Sambal Bakar", memantik kemandirian ekonomi desa.
              </p>
            </div>
          </div>
        </div>

        {/* 11. CTA Jelajahi */}
        <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop')] opacity-10 object-cover mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Mari Jelajahi Potensi Ngadirejo</h2>
            <p className="text-white/80 text-lg">Dukung karya masyarakat lokal, nikmati wisata alam, dan rasakan pengalaman tak terlupakan di desa kami.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/#daftar-umkm" className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-50 transition-colors">
                Lihat Daftar UMKM
              </Link>
              <Link to="/galeri" className="bg-primary-foreground/10 text-white border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                Galeri Dokumentasi
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Detail */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDetail(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 sm:h-80 w-full relative">
              <img src={selectedDetail.img} alt={selectedDetail.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg mb-2 uppercase tracking-wide">
                  {selectedDetail.cat}
                </span>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white">{selectedDetail.name}</h3>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h4 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Tentang / Sejarah Singkat
              </h4>
              <p className="text-slate-600 leading-relaxed md:text-lg">
                {selectedDetail.desc}
              </p>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setSelectedDetail(null)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
