import { FileText, Users, MailWarning, FileCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LAYANAN = [
  { icon: FileText, title: "Surat Domisili", desc: "Pembuatan surat keterangan domisili untuk warga pendatang atau keperluan administratif." },
  { icon: FileCheck, title: "Surat Keterangan Usaha (SKU)", desc: "Dokumen legalitas untuk keperluan perizinan atau pengajuan bantuan UMKM." },
  { icon: Users, title: "Administrasi Kependudukan", desc: "Pengurusan KTP, Kartu Keluarga, Akta Kelahiran, dan dokumen sipil lainnya." },
  { icon: FileText, title: "Surat Keterangan Tidak Mampu (SKTM)", desc: "Pengajuan SKTM untuk keperluan pendidikan, kesehatan, atau bantuan sosial." },
  { icon: FileText, title: "Surat Pengantar", desc: "Surat pengantar RT/RW untuk berbagai keperluan kepolisian atau instansi luar." },
  { icon: MailWarning, title: "Layanan Pengaduan", desc: "Sampaikan laporan, keluhan, atau aspirasi terkait infrastruktur dan pelayanan desa." },
];

export function Layanan() {
  return (
    <div className="flex flex-col w-full pb-20 bg-background">
      <div className="bg-primary pt-16 pb-24 text-center px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Layanan Publik</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Komitmen Pemerintah Desa Ngadirejo untuk memberikan pelayanan prima yang cepat, mudah, dan transparan.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAYANAN.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
                {item.desc}
              </p>
              <Link to="#" className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 hover:bg-accent hover:text-white text-slate-700 font-semibold transition-colors group/btn">
                Ajukan Layanan
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-full shrink-0">
            <InfoIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Informasi Pengajuan Online</h4>
            <p className="opacity-90">
              Sistem pengajuan layanan secara online (mandiri) sedang dalam tahap pengembangan. Saat ini, warga dimohon datang langsung ke Kantor Desa Ngadirejo dengan membawa persyaratan dokumen fisik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
}
