import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getAdminPassword, setAdminPassword } from "@/lib/libraryStore";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, KeyRound } from "lucide-react";
import vignanLogo from "@/assets/vignan-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Admin@acse" && password === getAdminPassword()) {
      sessionStorage.setItem("vignan_logged_in", "true");
      toast.success("Welcome, Admin!");
      navigate("/borrow");
    } else {
      toast.error("Invalid username or password");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setAdminPassword(newPassword);
    toast.success("Password changed successfully!");
    setShowForgot(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/5" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="bg-card rounded-2xl shadow-[0_8px_40px_hsl(220_25%_12%/0.08)] p-8 space-y-6 border border-border/60">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <img src={vignanLogo} alt="Vignan University" className="h-20 mx-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                ACSE Department Library
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Library Management System
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Admin@acse"
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold active:scale-[0.97] transition-transform">
                Sign In
              </Button>

              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="w-full text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="text-center">
                <KeyRound className="h-10 w-10 text-secondary mx-auto mb-2" />
                <h2 className="text-lg font-semibold text-foreground">Reset Password</h2>
                <p className="text-sm text-muted-foreground">Enter your new password below</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="h-11"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold active:scale-[0.97] transition-transform">
                Update Password
              </Button>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Vignan University — ACSE Department
        </p>
      </div>
    </div>
  );
};

export default Login;
