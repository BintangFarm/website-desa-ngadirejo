import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { UMKMDetail } from "./pages/UMKMDetail";
import { Profil } from "./pages/Profil";
import { Pemerintahan } from "./pages/tatakelola";
import { PotensiDesa } from "./pages/PotensiDesa";
import { Berita } from "./pages/Berita";
import { Galeri } from "./pages/Galeri";
import { Layanan } from "./pages/Layanan";
import { Kontak } from "./pages/Kontak";
import { AdminPanel } from "./pages/AdminPanel";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "profil", Component: Profil },
      { path: "tatakelola", Component: Pemerintahan },
      { path: "umkm/:id", Component: UMKMDetail },
      { path: "potensi", Component: PotensiDesa },
      { path: "berita", Component: Berita },
      { path: "galeri", Component: Galeri },
      { path: "layanan", Component: Layanan },
      { path: "kontak", Component: Kontak },
      { path: "admin", Component: AdminPanel },
      { path: "*", Component: () => <div className="p-20 text-center text-2xl font-display font-semibold">Halaman tidak ditemukan.</div> }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
