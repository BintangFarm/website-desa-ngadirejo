import { useState, useEffect } from "react";
import { getUMKMList, addUMKM, updateUMKM, deleteUMKM, UMKMData } from "../lib/firebase/umkm";
import { Loader2, Plus, Edit, Trash2, X } from "lucide-react";

export function AdminPanel() {
  const [umkms, setUmkms] = useState<UMKMData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    namaPemilik: "",
    nama: "",
    kategori: "",
    alamat: "",
    kontak: "",
    desc: "",
    produk: "",
    hari: "Setiap Hari",
    jamBuka: "08:00",
    jamTutup: "16:00",
    koordinat: "",
    status: "Tutup",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
  });

  const fetchUMKMs = async () => {
    setIsFetching(true);
    const list = await getUMKMList();
    setUmkms(list);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchUMKMs();
  }, []);

  const handleResetForm = () => {
    setForm({
      namaPemilik: "",
      nama: "",
      kategori: "",
      alamat: "",
      kontak: "",
      desc: "",
      produk: "",
      hari: "Setiap Hari",
      jamBuka: "08:00",
      jamTutup: "16:00",
      koordinat: "",
      status: "Tutup",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (umkm: UMKMData) => {
    setIsEditing(true);
    setEditId(umkm.id as string);
    setForm({
      namaPemilik: umkm.namaPemilik || "",
      nama: umkm.nama || "",
      kategori: umkm.kategori || "",
      alamat: umkm.alamat || "",
      kontak: umkm.kontak || "",
      desc: umkm.desc || "",
      produk: umkm.produk || "",
      hari: umkm.jam ? umkm.jam.split(",")[0] || "Setiap Hari" : "Setiap Hari",
      jamBuka: umkm.jam ? (umkm.jam.split(",")[1]?.split("-")[0]?.trim() || "08:00") : "08:00",
      jamTutup: umkm.jam ? (umkm.jam.split("-")[1]?.trim() || "16:00") : "16:00",
      koordinat: umkm.koordinat ? umkm.koordinat.join(", ") : "",
      status: umkm.status || "Tutup",
      image: umkm.image || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus UMKM ini?")) return;
    
    setIsLoading(true);
    const result = await deleteUMKM(id);
    setIsLoading(false);
    
    if (result.success) {
      alert("UMKM berhasil dihapus!");
      fetchUMKMs();
    } else {
      alert("Gagal menghapus UMKM: " + result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { namaPemilik, nama, kontak } = form;
    if (!namaPemilik || !nama || !kontak) return;
    
    setIsLoading(true);
    let parsedKoordinat: [number, number] | undefined = undefined;
    if (form.koordinat) {
      const parts = form.koordinat.split(',').map(s => Number(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsedKoordinat = [parts[0], parts[1]];
      }
    }

    const payload = {
      ...form,
      jam: `${form.hari}, ${form.jamBuka} - ${form.jamTutup}`,
      koordinat: parsedKoordinat
    };

    if (isEditing && editId) {
      const result = await updateUMKM(editId, payload);
      setIsLoading(false);
      if (result.success) {
        alert("UMKM berhasil diupdate!");
        handleResetForm();
        fetchUMKMs();
      } else {
        alert("Gagal update: " + result.error);
      }
    } else {
      const result = await addUMKM(payload);
      setIsLoading(false);
      if (result.success) {
        alert("Pendaftaran berhasil! UMKM tersimpan.");
        handleResetForm();
        fetchUMKMs();
      } else {
        alert("Gagal mendaftar: " + result.error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50 min-h-screen">
      <div className="bg-slate-900 pt-16 pb-20 text-center px-4 relative overflow-hidden">
        <h1 className="relative font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Panel Admin UMKM
        </h1>
        <p className="relative text-white/80 max-w-2xl mx-auto text-lg">
          Kelola data UMKM Desa Ngadirejo.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-slate-800">
                {isEditing ? "Edit UMKM" : "Tambah UMKM"}
              </h2>
              {isEditing && (
                <button onClick={handleResetForm} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pemilik *</label>
                <input required type="text" value={form.namaPemilik} onChange={e => setForm({...form, namaPemilik: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Usaha *</label>
                <input required type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kontak (WA) *</label>
                <input required type="text" value={form.kontak} onChange={e => setForm({...form, kontak: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white">
                  <option value="">Pilih kategori...</option>
                  <option value="Kuliner">Kuliner & Makanan</option>
                  <option value="Pertanian">Pertanian & Perkebunan</option>
                  <option value="Kerajinan">Kerajinan Tangan</option>
                  <option value="Jasa">Jasa & Layanan</option>
                  <option value="Peternakan">Peternakan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat</label>
                <input type="text" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hari Operasional</label>
                  <input type="text" value={form.hari} onChange={e => setForm({...form, hari: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Contoh: Senin - Sabtu" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Buka</label>
                  <input type="time" value={form.jamBuka} onChange={e => setForm({...form, jamBuka: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Tutup</label>
                  <input type="time" value={form.jamTutup} onChange={e => setForm({...form, jamTutup: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea rows={3} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Koordinat (Opsional)</label>
                <input type="text" value={form.koordinat} onChange={e => setForm({...form, koordinat: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Contoh: -7.9923, 112.7838" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status Buka/Tutup</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white">
                  <option value="Buka">Buka</option>
                  <option value="Tutup">Tutup</option>
                </select>
              </div>

              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors mt-4">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                {isEditing ? "Simpan Perubahan" : "Tambah UMKM"}
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-slate-100 p-6">
            <h2 className="font-display text-xl font-bold text-slate-800 mb-5">Daftar UMKM</h2>
            {isFetching ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="pb-3 font-semibold">Nama Usaha</th>
                      <th className="pb-3 font-semibold">Pemilik</th>
                      <th className="pb-3 font-semibold">Kategori</th>
                      <th className="pb-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {umkms.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-4 text-sm font-medium text-slate-800">{u.nama}</td>
                        <td className="py-4 text-sm text-slate-600">{u.namaPemilik}</td>
                        <td className="py-4 text-sm text-slate-600">
                          <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                            {u.kategori || "Tanpa Kategori"}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-right space-x-2">
                          <button onClick={() => handleEdit(u)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(u.id as string)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {umkms.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-slate-500 text-sm">
                          Belum ada data UMKM.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
