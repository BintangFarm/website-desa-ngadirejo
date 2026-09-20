import { useState, useEffect } from "react";
import { getUMKMList, addUMKM, updateUMKM, deleteUMKM, UMKMData, uploadMultipleImages } from "../lib/supabase/umkm";
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
    imageFiles: [] as File[],
    existingImages: [] as string[],
  });
  const [uploadProgress, setUploadProgress] = useState("");

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
      imageFiles: [],
      existingImages: [],
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
      hari: umkm.hari || "Setiap Hari",
      jamBuka: umkm.jamBuka || "08:00",
      jamTutup: umkm.jamTutup || "16:00",
      koordinat: umkm.koordinat ? umkm.koordinat.join(", ") : "",
      status: umkm.status || "Tutup",
      imageFiles: [],
      existingImages: umkm.images && umkm.images.length > 0 ? [...umkm.images] : (umkm.image ? [umkm.image] : []),
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

  const handleApprove = async (id: string) => {
    if (!window.confirm("Setujui UMKM ini untuk ditampilkan di website?")) return;
    setIsLoading(true);
    const result = await updateUMKM(id, { isApproved: true });
    setIsLoading(false);
    if (result.success) {
      alert("UMKM disetujui!");
      fetchUMKMs();
    } else {
      alert("Gagal menyetujui UMKM: " + result.error);
    }
  };

  const pendingUmkms = umkms.filter(u => u.isApproved === false);
  const approvedUmkms = umkms.filter(u => u.isApproved !== false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { namaPemilik, nama, kontak, koordinat, produk } = form;
    if (!namaPemilik || !nama || !kontak || !koordinat || !produk) {
      alert("Mohon lengkapi data wajib (Nama Pemilik, Usaha, Kontak, Produk, Koordinat)!");
      return;
    }
    
    setIsLoading(true);
    let parsedKoordinat: [number, number] | undefined = undefined;
    if (koordinat) {
      const parts = koordinat.split(',').map(s => Number(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsedKoordinat = [parts[0], parts[1]];
      } else {
        alert("Format koordinat salah! Contoh yang benar: -7.9923, 112.7838");
        setIsLoading(false);
        return;
      }
    }

    let allImageUrls: string[] = [...form.existingImages];
    let finalImageUrl = allImageUrls.length > 0 ? allImageUrls[0] : "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop";

    if (form.imageFiles.length > 0) {
      setUploadProgress(`Mengompres & mengunggah ${form.imageFiles.length} foto...`);
      const uploadRes = await uploadMultipleImages(form.imageFiles);
      setUploadProgress("");
      if (!uploadRes.success) {
        alert("Gagal mengupload foto: " + uploadRes.error);
        setIsLoading(false);
        return;
      }
      if (uploadRes.urls && uploadRes.urls.length > 0) {
        allImageUrls = [...allImageUrls, ...uploadRes.urls].slice(0, 5);
        finalImageUrl = allImageUrls[0];
      }
    }

    const payload = {
      ...form,
      jam: `${form.hari}, ${form.jamBuka} - ${form.jamTutup} WIB`,
      koordinat: parsedKoordinat as [number, number],
      isApproved: true,
      image: finalImageUrl,
      images: allImageUrls,
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pemilik <span className="text-red-400">*</span></label>
                <input required type="text" value={form.namaPemilik} onChange={e => setForm({...form, namaPemilik: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Usaha <span className="text-red-400">*</span></label>
                <input required type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kontak (WA) <span className="text-red-400">*</span></label>
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Produk / Jasa Tertentu <span className="text-red-400">*</span></label>
                <input required type="text" value={form.produk} onChange={e => setForm({...form, produk: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Contoh: Kripik Tempe" />
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
              
              {/* Foto Produk (Maks 5) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Foto Produk / Usaha <span className="text-slate-400 font-normal">(Maks. 5 foto, otomatis dikompres)</span>
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={e => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      const combined = [...form.imageFiles, ...newFiles].slice(0, 5);
                      setForm({...form, imageFiles: combined});
                    }
                  }} 
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" 
                />
                {form.imageFiles.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-500 font-medium">{form.imageFiles.length}/5 foto (foto pertama = sampul)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.imageFiles.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img src={URL.createObjectURL(file)} alt={`Preview ${idx+1}`} className={`w-12 h-12 object-cover rounded-md border-2 ${idx === 0 ? 'border-emerald-400' : 'border-slate-200'}`} />
                          {idx === 0 && <span className="absolute -top-1 -left-1 bg-emerald-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full">Sampul</span>}
                          <button type="button" onClick={() => setForm({...form, imageFiles: form.imageFiles.filter((_, i) => i !== idx)})} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : form.existingImages.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Foto Tersimpan Saat Ini (Maks {5 - form.imageFiles.length} tambahan bisa diupload)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.existingImages.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img src={url} alt={`Saved ${idx+1}`} className={`w-12 h-12 object-cover rounded-md border-2 ${idx === 0 ? 'border-emerald-400' : 'border-slate-200'} opacity-90`} />
                          {idx === 0 && <span className="absolute -top-1 -left-1 bg-emerald-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full">Sampul</span>}
                          <button type="button" onClick={() => setForm({...form, existingImages: form.existingImages.filter((_, i) => i !== idx)})} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {uploadProgress && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="w-3 h-3 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-xs text-amber-700 font-medium">{uploadProgress}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Koordinat Lokasi Maps <span className="text-red-400">*</span></label>
                <input required type="text" value={form.koordinat} onChange={e => setForm({...form, koordinat: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Contoh: -7.9923, 112.7838" />
                <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0z" />
                  </svg>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Format: <strong>latitude, longitude</strong> (pisahkan dengan koma). Cara mendapatkan koordinat: buka{" "}
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-blue-900">Google Maps</a>
                    , klik kanan pada lokasi usaha, lalu salin angka koordinat yang muncul.
                  </p>
                </div>
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
          <div className="lg:col-span-2 space-y-6">
            
            {/* PENDING TABLE */}
            {pendingUmkms.length > 0 && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-3xl shadow-sm p-6">
                <h2 className="font-display text-xl font-bold text-amber-900 mb-5 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                  Menunggu Konfirmasi
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-amber-200 text-sm text-amber-700">
                        <th className="pb-3 font-semibold">Nama Usaha</th>
                        <th className="pb-3 font-semibold">Pemilik</th>
                        <th className="pb-3 font-semibold">Kategori</th>
                        <th className="pb-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUmkms.map((u) => (
                        <tr key={u.id} className="border-b border-amber-100/50 hover:bg-amber-100/30 transition">
                          <td className="py-4 text-sm font-medium text-amber-900">{u.nama}</td>
                          <td className="py-4 text-sm text-amber-800">{u.namaPemilik}</td>
                          <td className="py-4 text-sm text-amber-800">
                            <span className="inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs">
                              {u.kategori || "Tanpa Kategori"}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => handleApprove(u.id as string)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition shadow-sm text-xs" title="Setujui">
                              Setujui
                            </button>
                            <button onClick={() => handleDelete(u.id as string)} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium rounded-lg transition text-xs" title="Tolak">
                              Tolak
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
              <h2 className="font-display text-xl font-bold text-slate-800 mb-5">Daftar UMKM Aktif</h2>
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
                    {approvedUmkms.map((u) => (
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
                    {approvedUmkms.length === 0 && (
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
    </div>
  );
}
