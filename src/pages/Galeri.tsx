import { useState, useMemo } from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "../lib/utils";


const IMAGES = [
  { id: 1,  url: "/galeri-desa/foto-1.jpeg" },
  { id: 2,  url: "/galeri-desa/foto-2.jpeg" },
  { id: 3,  url: "/galeri-desa/foto-3.jpeg" },
  { id: 4,  url: "/galeri-desa/foto-4.jpeg" },
  { id: 5,  url: "/galeri-desa/foto-5.jpeg" },
  { id: 6,  url: "/galeri-desa/foto-6.jpeg" },
  { id: 7,  url: "/galeri-desa/foto-7.jpeg" },
  { id: 8,  url: "/galeri-desa/foto-8.jpeg" },
  { id: 9,  url: "/galeri-desa/foto-9.jpeg" },
  { id: 10, url: "/galeri-desa/foto-10.jpeg" },
];

export function Galeri() {
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = IMAGES;

  const columns = useMemo(() => {
    const result: typeof IMAGES[] = [];
    if (filtered.length === 0) return result;
    
    for (let i = 0; i < 4; i++) {
        const colImages: typeof IMAGES = [];
        const index = i % filtered.length;
        for (let j = 0; j < 8; j++) { 
            const step = i % 2 === 0 ? 1 : 2; 
            colImages.push(filtered[(index + j * step) % filtered.length]);
        }
        // Duplicate content exactly to allow seamless scrolling
        result.push([...colImages, ...colImages]);
    }
    return result;
  }, [filtered]);

  return (
    <div className="flex flex-col w-full pb-20 bg-background overflow-hidden">
      <div className="bg-primary pt-16 pb-24 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Galeri Dokumentasi</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Kumpulan momen dan keindahan Desa Ngadirejo.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-10 relative z-10">

        <style>{`
          @keyframes marqueeUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes marqueeDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
          .animate-marquee-up {
            animation: marqueeUp 40s linear infinite;
          }
          .animate-marquee-down {
            animation: marqueeDown 40s linear infinite;
          }
          .gallery-container:hover .animate-marquee-up,
          .gallery-container:hover .animate-marquee-down {
            animation-play-state: paused;
          }
          .mask-image-vertical {
            -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
            mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
          }
          @keyframes zoomInModal {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="gallery-container h-[75vh] min-h-[600px] max-h-[900px] overflow-hidden flex gap-4 w-full rounded-2xl relative mask-image-vertical">
          {columns.map((col, i) => {
            const visibilityClass = i === 2 ? "hidden md:flex" : i === 3 ? "hidden lg:flex" : "flex";
            const isDown = i % 2 === 1;
            return (
              <div key={i} className={cn("flex-1 flex-col gap-4", visibilityClass)}>
                <div className={cn("flex flex-col gap-4 w-full h-max", isDown ? "animate-marquee-down" : "animate-marquee-up")}>
                  {col.map((img: typeof IMAGES[number], idx: number) => (
                    <div 
                      key={`gallery-${i}-${idx}`} 
                      className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 w-full"
                      onClick={() => setPreview(img.url)}
                    >
                      <img src={img.url} alt="Galeri" className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <ZoomIn className="w-12 h-12 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm" 
          onClick={() => setPreview(null)}
          style={{ animation: 'fadeInUp 0.3s ease-out forwards', opacity: 0, transform: 'translateY(10px)' }}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-transform hover:rotate-90 duration-300" onClick={() => setPreview(null)}>
            <X className="w-10 h-10" />
          </button>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
            onClick={e => e.stopPropagation()} 
            style={{ animation: 'zoomInModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards', opacity: 0, transform: 'scale(0.95)' }}
          />
        </div>
      )}
    </div>
  );
}
