import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
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
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
      {
        path: "kontak",
        Component: () => (
          <ProtectedRoute>
            <Kontak />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        Component: () => (
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      { path: "login", Component: Auth },
      { path: "*", Component: () => <div className="p-20 text-center text-2xl font-display font-semibold">Halaman tidak ditemukan.</div> }
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
