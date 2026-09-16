import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Store, Leaf, ShoppingBag, Clock, Navigation, Map } from "lucide-react";
import { cn } from "../lib/utils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const KATEGORI = [
  "Semua",
  "Bahan Makanan",
  "Distribusi",
  "Elektronik",
  "Industri Pengolahan",
  "Industri Makanan",
  "Jasa",
  "Kuliner"
];

export const DUMMY_UMKM = [
  {
    id: 1,
    nama: "A4N Sticker & Acrylic",
    kategori: "JASA PERCETAKAN",
    status: "Tutup",
    jam: "08.00-17.00 WIB (Senin-Sabtu)",
    desc: "A4N Sticker & Acrylic menawarkan jasa digital printing, foto copy, cetak banner, dll.",
    image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9923, 112.7838] as [number, number]
  },
  {
    id: 2,
    nama: "ABE Fotografi",
    kategori: "JASA FOTOGRAFI",
    status: "Tutup",
    jam: "Kondisional (sesuai pesanan)",
    desc: "Menawarkan jasa fotografi dan videografi panggilan rumahan untuk berbagai acara.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9933, 112.7845] as [number, number]
  },
  {
    id: 3,
    nama: "Alam Jaya",
    kategori: "PERCETAKAN",
    status: "Tutup",
    jam: "08.00-16.00",
    desc: "Alam jaya menawarkan jasa pembuatan sampul rapot dan ijazah sekolah terbaik.",
    image: "https://images.unsplash.com/photo-1563260797-cb5cd70254c8?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9917, 112.7825] as [number, number]
  },
  {
    id: 4,
    nama: "Alvit",
    kategori: "MAKANAN",
    status: "Buka",
    jam: "24 jam setiap hari",
    desc: "Alvit menawarkan berbagai produk makanan, antara lain kue kering, dan camilan lokal.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9903, 112.7859] as [number, number]
  },
  {
    id: 5,
    nama: "Bakso Cahaya",
    kategori: "MAKANAN",
    status: "Tutup",
    jam: "07.00 - 20.00 WIB",
    desc: "Menyediakan bakso dengan cita rasa gurih, kuah yang segar, dan pentol yang kenyal.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9927, 112.7810] as [number, number]
  },
  {
    id: 6,
    nama: "Batagor Somay",
    kategori: "MAKANAN RINGAN",
    status: "Tutup",
    jam: "10.00 - 16.00 WIB",
    desc: "Menyediakan somay dan batagor dengan cita rasa khas bumbu kacang yang lezat.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9937, 112.7860] as [number, number]
  },
  {
    id: 7,
    nama: "Bengkel Motor Arya Ban",
    kategori: "JASA BENGKEL KENDARAAN",
    status: "Tutup",
    jam: "06.00-17.00",
    desc: "Melayani penjualan ban, oli, tambal ban, servis ringan, isi angin, serta sparepart motor.",
    image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9912, 112.7830] as [number, number]
  },
  {
    id: 8,
    nama: "Bengkel Pak Cipto Enduro",
    kategori: "JASA BENGKEL KENDARAAN",
    status: "Tutup",
    jam: "06.00-17.00",
    desc: "Melayani ganti ban, tambal ban, ganti oli, dan servis ringan kendaraan roda dua.",
    image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800&auto=format&fit=crop",
    koordinat: [-7.9943, 112.7820] as [number, number]
  }
];

export function Home() {
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [search, setSearch] = useState("");

  const filteredUMKM = DUMMY_UMKM.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(search.toLowerCase());
    // Simplified category matching for demo since categories in dummy data might not exactly match the pills
    const matchCat = activeKategori === "Semua" || true; 
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50/50">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0"></div>
        
        <div className="container relative z-10 mx-auto text-center flex flex-col items-center">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2 mb-8 border border-emerald-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Program Digitalisasi UMKM Desa
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl text-slate-900 tracking-tight">
            Temukan UMKM Lokal <br />
            <span className="text-emerald-600">Desa Ngadirejo</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl text-balance leading-relaxed">
            Cari makanan, minuman, jasa, sembako, hasil pertanian, dan usaha lokal masyarakat Desa Ngadirejo dalam satu website.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#daftar-umkm"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-200"
            >
              Cari UMKM
            </a>
            <a
              href="#peta-sebaran"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold transition-all transform hover:-translate-y-1 shadow-sm hover:bg-slate-50"
            >
              Lihat Peta
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-20 px-4 md:px-6 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center gap-5 shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-slate-900 mb-1">79</div>
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase">UMKM Terdaftar</div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center gap-5 shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-slate-900 mb-1">45</div>
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase">Jenis Usaha</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 flex items-center gap-5 shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-slate-900 mb-1">1</div>
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase">Desa Digital</div>
            </div>
          </div>
        </div>
      </section>

      {/* UMKM Listing Section */}
      <section id="daftar-umkm" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">
                Jelajahi Usaha Lokal
              </h2>
              <p className="text-slate-500">
                Gunakan pencarian dan filter di bawah untuk mempermudah pencarian.
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm border border-emerald-100">
              79 Usaha Ditemukan
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari bakso, sembako, salon, bengkel, mebel..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex overflow-x-auto gap-3 pb-4 mb-10 hide-scrollbar items-center">
            {KATEGORI.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveKategori(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  activeKategori === cat 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 border border-emerald-600" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                )}
              >
                {cat}
              </button>
            ))}
            
            <div className="w-px h-8 bg-slate-200 mx-2 shrink-0"></div>
            
            <button className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Buka Sekarang
            </button>
            <button className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Terdekat dari Saya
            </button>
          </div>

          {/* Grid UMKM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUMKM.map((umkm) => (
              <div key={umkm.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col group">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={umkm.image} alt={umkm.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Top Left Badge: Category */}
                  <div className="absolute top-3 left-3 bg-white/95 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                    {umkm.kategori}
                  </div>
                  
                  {/* Top Right Badge: Status */}
                  <div className={cn(
                    "absolute top-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-sm",
                    umkm.status === "Buka" ? "bg-emerald-500/95 text-white" : "bg-rose-500/95 text-white"
                  )}>
                    {umkm.status}
                  </div>

                  {/* Bottom Right Badge: Time */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {umkm.jam}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2 leading-snug">
                    {umkm.nama}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                    {umkm.desc}
                  </p>
                  
                  <div className="flex gap-3">
                    <Link to={`/umkm/${umkm.id}`} className="flex-1 bg-slate-900 text-white text-sm font-semibold py-2.5 rounded-xl text-center hover:bg-slate-800 transition-colors shadow-sm">
                      Lihat Detail
                    </Link>
                    <a href="#" className="flex-1 border-2 border-emerald-500 text-emerald-600 text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-emerald-50 transition-colors">
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== PETA SEBARAN UMKM ===== */}
      <section id="peta-sebaran" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-100 mb-4">
                <Map className="w-4 h-4" />
                Peta Interaktif
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">
                Peta Sebaran UMKM
              </h2>
              <p className="text-slate-500 max-w-xl">
                Temukan lokasi usaha lokal Desa Ngadirejo, Kecamatan Jabung, Kabupaten Malang secara visual di peta.
              </p>
            </div>
            <a
              href="https://maps.app.goo.gl/NVCLe1jBbXb8DEPS9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm shrink-0"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              Buka di Google Maps
            </a>
          </div>

          {/* Legend + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

            {/* Legend */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Legenda Kategori</h3>
              {[
                { label: "Kuliner & Makanan", color: "bg-orange-400", count: 24 },
                { label: "Jasa & Percetakan", color: "bg-blue-400", count: 18 },
                { label: "Pertanian & Kebun", color: "bg-emerald-500", count: 15 },
                { label: "Kerajinan Tangan", color: "bg-purple-400", count: 9 },
                { label: "Bengkel & Otomotif", color: "bg-slate-500", count: 8 },
                { label: "Lainnya", color: "bg-rose-400", count: 5 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-slate-600 text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Total UMKM</span>
                  <span className="font-bold text-emerald-600 text-base">79</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Tersebar di Desa Ngadirejo</p>
              </div>

              <a
                href="/kontak"
                className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-2xl transition-colors"
              >
                <Store className="w-4 h-4" />
                Daftarkan Usaha Anda
              </a>
            </div>

            {/* Map iframe */}
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative">
                {/* Badge overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md rounded-2xl px-4 py-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Desa Ngadirejo, Kec. Jabung</span>
                </div>
              </div>
              <div className="w-full h-[480px] z-0 relative">
                <MapContainer 
                  center={[-7.9923, 112.7838]} 
                  zoom={15} 
                  scrollWheelZoom={false}
                  className="w-full h-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {DUMMY_UMKM.map(umkm => (
                    umkm.koordinat && (
                      <Marker key={umkm.id} position={umkm.koordinat}>
                        <Popup>
                          <div className="font-sans">
                            <h3 className="font-bold text-sm text-slate-800">{umkm.nama}</h3>
                            <p className="text-xs text-slate-500 mb-2">{umkm.kategori}</p>
                            <Link to={`/umkm/${umkm.id}`} className="text-xs font-semibold text-emerald-600 hover:underline">
                              Lihat Detail Usaha &rarr;
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Info cards below map */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                title: "Pusat Desa",
                desc: "Balai Desa Ngadirejo, Kec. Jabung, Kab. Malang",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: <Store className="w-5 h-5" />,
                title: "Sebaran Usaha",
                desc: "79 UMKM tersebar di seluruh dusun Desa Ngadirejo",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: <Navigation className="w-5 h-5" />,
                title: "Navigasi",
                desc: "Klik tombol 'Buka di Google Maps' untuk rute lengkap",
                color: "text-amber-600 bg-amber-50",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  {c.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{c.title}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
