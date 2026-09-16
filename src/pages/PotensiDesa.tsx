import { Sprout, Store, Mountain, ShoppingBag, PenTool, Lightbulb, Tractor } from "lucide-react";


const POTENSI = [
  { id: 2, title: "Peternakan", icon: Tractor, desc: "Data akan diperbarui oleh Pemerintah Desa.", img: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "UMKM Lokal", icon: Store, desc: "Data akan diperbarui oleh Pemerintah Desa.", img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Pariwisata", icon: Mountain, desc: "Data akan diperbarui oleh Pemerintah Desa.", img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop" },
];

export function PotensiDesa() {
  return (
    <div className="flex flex-col w-full pb-20 bg-background">
      <div className="bg-primary pt-16 pb-24 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Potensi Desa Ngadirejo</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Membangun kemandirian desa melalui penguatan potensi sumber daya alam dan kreativitas masyarakat.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {POTENSI.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="h-48 relative overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 font-display font-bold text-white text-xl flex items-center gap-2">
                  <item.icon className="w-5 h-5" /> {item.title}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-slate-500 text-sm italic">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
