import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LogOut, BookOpen, Library, BarChart3 } from "lucide-react";
import vignanLogo from "@/assets/vignan-logo.png";

const pages = [
  { path: "/borrow", label: "Borrow Books", icon: BookOpen },
  { path: "/books", label: "Books Info", icon: Library },
  { path: "/records", label: "Records & Delays", icon: BarChart3 },
];

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIdx = pages.findIndex((p) => p.path === location.pathname);

  const handleLogout = () => {
    sessionStorage.removeItem("vignan_logged_in");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={vignanLogo} alt="Vignan University" className="h-10" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-tight">ACSE Department</p>
              <p className="text-xs text-muted-foreground">Library Management</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {pages.map((page) => {
              const Icon = page.icon;
              const active = location.pathname === page.path;
              return (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    active:scale-[0.97]
                    ${active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{page.label}</span>
                </button>
              );
            })}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive active:scale-[0.97]"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {children}
      </main>

      {/* Footer Navigation */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx <= 0}
            onClick={() => currentIdx > 0 && navigate(pages[currentIdx - 1].path)}
            className="active:scale-[0.97]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {currentIdx + 1} of {pages.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx >= pages.length - 1}
            onClick={() => currentIdx < pages.length - 1 && navigate(pages[currentIdx + 1].path)}
            className="active:scale-[0.97]"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
