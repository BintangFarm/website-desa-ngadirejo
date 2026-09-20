import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUMKMList, UMKMData } from "../lib/supabase/umkm";
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
  const [umkmList, setUmkmList] = useState<UMKMData[]>(DUMMY_UMKM as UMKMData[]);

  useEffect(() => {
    async function fetchData() {
      const data = await getUMKMList();
      // Filter out only approved UMKMs
      const approvedData = data.filter(u => u.isApproved === true);
      
      // Merge with dummy data, placing new approved UMKMs first
      setUmkmList([...approvedData, ...(DUMMY_UMKM as UMKMData[])]);
    }
    fetchData();
  }, []);

  const filteredUMKM = umkmList.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeKategori === "Semua" || true;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* ===== HERO — Village Immersive ===== */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Full bleed nature background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bgprofil.jpg"
            alt="Desa Ngadirejo"
            className="w-full h-full object-cover"
          />
          {/* Layered gradients: dark bottom for text + green tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/50 to-transparent" />
        </div>

        {/* Floating location pill */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            Desa Ngadirejo · Kec. Jabung · Kab. Malang
          </div>
        </div>

        {/* Main hero content — bottom-left anchored */}
        <div className="relative z-10 container mx-auto px-4 md:px-10 pb-24 md:pb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-7">
              ⚡ Platform Digitalisasi Desa
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6 tracking-tight">
              Selamat Datang<br />
              di <span className="text-emerald-400">Ngadirejo</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
              Portal resmi Desa Ngadirejo — temukan UMKM lokal, wisata alam, dan potensi kekayaan desa kami.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#daftar-umkm"
                className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-2xl shadow-emerald-900/50 hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <Store className="w-4 h-4" /> Direktori UMKM
              </a>
              <a
                href="#peta-sebaran"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <Map className="w-4 h-4" /> Peta Sebaran
              </a>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 72 C480 0 960 50 1440 12 L1440 72 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== STAT BANNER ===== */}
      <section className="bg-white pt-2 pb-12">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Store className="w-5 h-5" />, value: umkmList.length.toString(), label: "UMKM Terdaftar", accent: "bg-emerald-50 text-emerald-600" },
              { icon: <ShoppingBag className="w-5 h-5" />, value: "45+", label: "Jenis Usaha", accent: "bg-blue-50 text-blue-600" },
              { icon: <MapPin className="w-5 h-5" />, value: "3", label: "Dusun", accent: "bg-amber-50 text-amber-600" },
              { icon: <Leaf className="w-5 h-5" />, value: "1", label: "Desa Digital", accent: "bg-purple-50 text-purple-600" },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", s.accent)}>
                  {s.icon}
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-slate-900 leading-none">{s.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UMKM LISTING — Village Directory Style ===== */}
      <section id="daftar-umkm" className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 md:px-10">

          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Store className="w-3.5 h-3.5" /> Direktori Usaha
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-1.5">
                Usaha Lokal Ngadirejo
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                Kenali dan dukung usaha warga yang menggerakkan ekonomi desa.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm">
                {filteredUMKM.length} Usaha
              </div>
              <Link to="/kontak" className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                + Daftarkan Usaha
              </Link>
            </div>
          </div>

          {/* Search + filter bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-8 flex gap-3 flex-col md:flex-row items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama usaha atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Semua", "Kuliner", "Jasa", "Kerajinan"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveKategori(cat)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
                    activeKategori === cat
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── DIRECTORY LIST (not e-commerce grid) ── */}
          <div className="space-y-3">
            {filteredUMKM.map((umkm, i) => (
              <div
                key={umkm.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
              >
                {/* Thumbnail */}
                <div className="relative sm:w-48 sm:shrink-0 h-40 sm:h-auto overflow-hidden bg-slate-100">
                  <img
                    src={umkm.image}
                    alt={umkm.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Index number */}
                  <div className="absolute top-3 left-3 w-7 h-7 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold rounded-md flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Status */}
                  <div className={cn(
                    "absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm",
                    umkm.status === "Buka" ? "bg-emerald-500/90 text-white" : "bg-black/60 text-white/90"
                  )}>
                    {umkm.status === "Buka" ? "● Buka" : "○ Tutup"}
                  </div>
                </div>

                {/* Content body */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md mb-2">
                      {umkm.kategori}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors leading-tight">
                      {umkm.nama}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
                      {umkm.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{umkm.jam}</span>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex sm:flex-col gap-2 justify-start sm:justify-center shrink-0 sm:min-w-[110px]">
                    <Link
                      to={`/umkm/${umkm.id}`}
                      className="flex-1 sm:flex-none text-center bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      Lihat Detail
                    </Link>
                    <a
                      href="#"
                      className="flex-1 sm:flex-none text-center border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                    >
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
      <section id="peta-sebaran" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#16a34a20_1px,transparent_1px)] [background-size:24px_24px] z-0 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-10 relative z-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-500/30 mb-4">
                <Map className="w-4 h-4" /> Peta Interaktif
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Sebaran UMKM di Desa
              </h2>
              <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                Temukan lokasi usaha lokal Desa Ngadirejo, Kecamatan Jabung secara visual.
              </p>
            </div>
            <a
              href="https://maps.app.goo.gl/NVCLe1jBbXb8DEPS9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all shrink-0"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              Buka di Google Maps
            </a>
          </div>

          {/* Legend + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

            {/* Legend */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 space-y-3.5">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-5">Legenda Kategori</h3>
              {[
                { label: "Kuliner & Makanan", color: "bg-orange-400", count: 24 },
                { label: "Jasa & Percetakan", color: "bg-blue-400", count: 18 },
                { label: "Pertanian & Kebun", color: "bg-emerald-500", count: 15 },
                { label: "Kerajinan Tangan", color: "bg-purple-400", count: 9 },
                { label: "Bengkel & Otomotif", color: "bg-slate-400", count: 8 },
                { label: "Lainnya", color: "bg-rose-400", count: 5 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-slate-300 text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">{item.count}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-300">Total UMKM</span>
                  <span className="font-bold text-emerald-400 text-base">{umkmList.length}</span>
                </div>
                <p className="text-xs text-slate-500">Tersebar di Desa Ngadirejo</p>
              </div>
              <Link
                to="/kontak"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-3 rounded-2xl transition-colors mt-2"
              >
                <Store className="w-4 h-4" /> Daftarkan Usaha
              </Link>
            </div>

            {/* Map */}
            <div className="lg:col-span-3 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
              <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md rounded-2xl px-4 py-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-700">Desa Ngadirejo, Kec. Jabung</span>
              </div>
              <div className="w-full h-[480px] z-0 relative">
                <MapContainer
                  center={[-7.9906623946355495, 112.80812424039766]}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="w-full h-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {umkmList.map(umkm => (
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

          {/* Info strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { icon: <MapPin className="w-5 h-5" />, title: "Pusat Desa", desc: "Balai Desa Ngadirejo, Kec. Jabung, Kab. Malang", color: "text-emerald-400 bg-emerald-500/10" },
              { icon: <Store className="w-5 h-5" />, title: "Sebaran Usaha", desc: `${umkmList.length} UMKM tersebar di seluruh dusun Desa Ngadirejo`, color: "text-blue-400 bg-blue-500/10" },
              { icon: <Navigation className="w-5 h-5" />, title: "Navigasi", desc: "Klik 'Buka di Google Maps' untuk rute lengkap", color: "text-amber-400 bg-amber-500/10" },
            ].map((c) => (
              <div key={c.title} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  {c.icon}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{c.title}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
