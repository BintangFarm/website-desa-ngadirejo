import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

type NavItem = {
  label: string;
  type: "link" | "dropdown";
  to?: string;
  children?: { to: string; label: string }[];
};

export function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();




  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { to: "/", label: "Beranda", type: "link" },
    { to: "/#daftar-umkm", label: "Daftar UMKM", type: "link" },
    { to: "/#peta-sebaran", label: "Peta Sebaran", type: "link" },
    { to: "/profil", label: "Tentang", type: "link" },
    {
      label: "Informasi",
      type: "dropdown",
      children: [
        { to: "/tatakelola", label: "Tata Kelola" },
        { to: "/galeri", label: "Galeri" },
        { to: "/kontak", label: "Kontak" },
      ],
    },
  ];

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[76px] lg:h-[84px] flex items-center shadow-sm bg-white",
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between w-full h-full">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3 z-50">
            <img
              src="/logo.png"
              alt="Logo KKN Ngadirejo"
              className="w-10 h-10 lg:w-11 lg:h-11 object-contain"
            />
            <div className="font-display font-bold text-xl text-slate-800">
                <span>LAPAK</span>{" "}
               <span  className="text-emerald-600">Ngadirejo</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-3 h-full relative">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group h-full flex items-center"
              >
                {item.type === "dropdown" ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.label)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1",
                        activeDropdown === item.label
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50",
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeDropdown === item.label && "rotate-180",
                        )}
                      />
                    </button>

                    {activeDropdown === item.label && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                        {item.children?.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => setActiveDropdown(null)}
                            className={({ isActive }) =>
                              cn(
                                "block rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                              )
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.to?.startsWith("/#") ? (
                  <a
                    href={item.to}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    to={item.to || "/"}
                    onClick={() => {
                      if (location.pathname === (item.to || "/")) {
                        window.scrollTo(0, 0);
                      }
                    }}
                    className={({ isActive }) =>
                      cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        isActive
                          ? "text-emerald-700 bg-emerald-50"
                          : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="xl:hidden z-50 p-2 text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out xl:hidden flex flex-col pt-[84px] pb-6 px-6 overflow-y-auto",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {navItems.map((item) =>
              item.type === "dropdown" ? (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-lg font-semibold text-slate-700"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform",
                        activeDropdown === item.label && "rotate-180",
                      )}
                    />
                  </button>

                  {activeDropdown === item.label && (
                    <div className="border-t border-slate-200 px-2 py-2 space-y-1">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-600 hover:bg-slate-100",
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.to?.startsWith("/#") ? (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-lg font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to || "/"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (location.pathname === (item.to || "/")) {
                      window.scrollTo(0, 0);
                    }
                  }}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-xl text-lg font-semibold transition-colors",
                      isActive
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-700 hover:bg-slate-100",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-[76px] lg:pt-[84px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.png"
                  alt="Logo KKN Ngadirejo"
                  className="w-10 h-10 object-contain bg-white rounded-full p-1"
                />
                <div className="font-display font-bold text-xl">
                  UMKM <span className="text-emerald-400">Ngadirejo</span>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed text-sm">
                Platform direktori digital satu pintu untuk mempromosikan produk
                lokal, kuliner, pertanian, kerajinan, dan jasa terbaik
                masyarakat Desa Ngadirejo, Kecamatan Kromengan, Kabupaten
                Malang.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg mb-6">
                Informasi Desa
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <a
                    href="/#daftar-umkm"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Daftar UMKM
                  </a>
                </li>
                <li>
                  <a
                    href="/#peta-sebaran"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Peta Sebaran
                  </a>
                </li>
                <li>
                  <Link
                    to="/profil"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Profil Desa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pemerintahan"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Tata Kelola
                  </Link>
                </li>
                <li>
                  <Link
                    to="/galeri"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Galeri
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg mb-6">
                Hubungi Pengelola
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-white/80 leading-relaxed">
                    Balai Desa Ngadirejo, Kec. Kromengan, Kab. Malang, Jawa
                    Timur
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white/80">
                    +62 857-3578-4978 (Kantor Desa)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-white/80">
                    desangadirejo11@gmail.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-xs">
              &copy; 2026 Tim KKN Digitalisasi UMKM Desa Ngadirejo. Hak Cipta
              Dilindungi.
            </p>
            <div className="text-emerald-400/80 text-xs border border-emerald-400/30 px-4 py-1.5 rounded-full">
              Dibuat untuk mendukung digitalisasi UMKM Desa Ngadirejo.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
