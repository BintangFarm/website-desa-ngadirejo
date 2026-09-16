import { User, Users } from "lucide-react";
import { cn } from "../lib/utils";

const STRUKTUR = {
  pelindung: { nama: "Muhammad Toib", jabatan: "Pelindung (Kepala Desa)" },
  penasehat: [
    "M Zainuri (Sekdes)",
    "Ikke Riyati (Ketua TP PKK)",
    "Tumrap Puji Utomo (Ketua BPD)",
    "Drs. Saifurrachman, MM (Korwil PKB)",
    "Sumarmi (PKB)",
    "Devita Nur (Bidan Desa)"
  ],
  inti: [
    { nama: "Suyatun", jabatan: "Sekretaris" },
    { nama: "Wicahyo", jabatan: "Ketua (PPKBD)" },
    { nama: "Sri Nuryani", jabatan: "Bendahara" }
  ],
  seksi: [
    {
      nama: "Seksi Keagamaan",
      anggota: ["Surioatmojo", "Miftahul Janah", "Ulfayanti"]
    },
    {
      nama: "Seksi Pendidikan",
      anggota: ["Rida Anifa", "Budi Santoso", "Yani Puji L"]
    },
    {
      nama: "Seksi Reproduksi",
      anggota: ["Ummul Bayinat", "Yetik Ervina", "Sunariati"]
    },
    {
      nama: "Seksi Ekonomi",
      anggota: ["Andi Ferianto", "Lulus Uji Andari", "Muslikah"]
    },
    {
      nama: "Seksi Perlindungan",
      anggota: ["Hendik Pristianto", "Kurnia", "Nila Sari"]
    },
    {
      nama: "Seksi Kasih Sayang",
      anggota: ["M. Kholik", "Maslakhah", "Kulna Desi R"]
    },
    {
      nama: "Seksi Sosial Budaya",
      anggota: ["Tatik Wahyuningsih", "Iin Khoiriyah", "Ahmad Bahrul A."]
    },
    {
      nama: "Seksi Pembinaan Lingkungan",
      anggota: ["Yuni Astutik", "Anur Rofiq", "Reni Yuningsih"]
    }
  ]
};

function PersonCard({ data, className }: { data: any, className?: string }) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow h-full", className)}>
      <div className="w-20 h-20 rounded-full bg-slate-100 mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
        <User className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-display font-bold text-slate-800">{data.nama}</h3>
      <p className="text-primary font-medium text-sm mt-1">{data.jabatan}</p>
    </div>
  );
}

function SeksiCard({ data }: { data: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow h-full">
      <div className="w-16 h-16 rounded-full bg-accent/10 mb-4 flex items-center justify-center text-accent">
        <Users className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-slate-800 mb-3">{data.nama}</h3>
      <div className="flex flex-col gap-1 w-full">
        {data.anggota.map((nama: string, idx: number) => (
          <div key={idx} className="bg-slate-50 py-1.5 px-3 rounded-md text-sm text-slate-700 border border-slate-100">
            {nama}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pemerintahan() {
  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50 min-h-screen">
      <div className="bg-primary pt-16 pb-24 text-center px-4 relative">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Struktur Organisasi</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Susunan Pengurus PPKBD Desa Ngadirejo.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-slate-100">
          
          <div className="flex flex-col items-center gap-10">
            
            {/* Pelindung & Penasehat */}
            <div className="grid lg:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <PersonCard data={STRUKTUR.pelindung} className="ring-2 ring-primary/20 shadow-md scale-105 w-full max-w-sm" />
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
                <h3 className="font-display font-bold text-slate-800 mb-4 text-center border-b border-slate-200 pb-2">Penasehat / Pembina</h3>
                <ul className="space-y-2">
                  {STRUKTUR.penasehat.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200 hidden lg:block"></div>

            {/* Inti: Sekretaris, Ketua, Bendahara */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
              <PersonCard data={STRUKTUR.inti[0]} />
              <PersonCard data={STRUKTUR.inti[1]} className="ring-2 ring-accent/30 shadow-md scale-105" />
              <PersonCard data={STRUKTUR.inti[2]} />
            </div>

            <div className="w-full max-w-4xl border-t border-slate-200 mt-6 pt-10">
              <div className="mb-8">
                <h4 className="font-display font-bold text-slate-400 text-center uppercase tracking-widest text-sm">Seksi - Seksi</h4>
              </div>
              
              {/* Seksi Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STRUKTUR.seksi.map((seksi, idx) => (
                  <SeksiCard key={idx} data={seksi} />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
