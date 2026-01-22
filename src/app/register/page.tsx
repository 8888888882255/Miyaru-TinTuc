"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const settings = {
  site: {
    name: "AdminMmo",
  },
};

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeTerms: boolean;
}

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [registerData, setRegisterData] = useState<RegisterData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeTerms: false,
  });

  // Tính độ mạnh của mật khẩu
  useEffect(() => {
    const password = registerData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    setPasswordStrength(Math.min(strength, 5));
  }, [registerData.password]);

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, phone, agreeTerms } = registerData;

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }

    if (!email.includes("@")) {
      toast.error("Vui lòng nhập email hợp lệ");
      return false;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }

    if (!agreeTerms) {
      toast.error("Vui lòng chấp nhận điều khoản và chính sách");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    
    // Điều hướng đến trang đăng nhập
    router.push("/login");
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-300";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength === 4) return "bg-lime-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Rất yếu";
    if (passwordStrength === 1) return "Yếu";
    if (passwordStrength === 2) return "Trung bình";
    if (passwordStrength === 3) return "Khá";
    if (passwordStrength === 4) return "Mạnh";
    return "Rất mạnh";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Tiêu đề */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Tạo tài khoản</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Đăng ký để tham gia cộng đồng {settings.site.name}
            </p>
          </div>

          {/* Form đăng ký */}
          <Card className="animate-slide-up shadow-elegant">
            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Họ tên */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ tên</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nhập họ tên của bạn"
                    value={registerData.fullName}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        fullName: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, phone: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>

                {/* Mật khẩu */}
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mật khẩu</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                  {registerData.password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Độ mạnh:</span>
                        <span className={`font-semibold ${
                          passwordStrength <= 2
                            ? "text-red-500"
                            : passwordStrength === 3
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{
                            width: `${(passwordStrength / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                  {registerData.confirmPassword &&
                    registerData.password === registerData.confirmPassword && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Mật khẩu trùng khớp
                      </p>
                    )}
                  {registerData.confirmPassword &&
                    registerData.password !== registerData.confirmPassword && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        ❌ Mật khẩu không trùng khớp
                      </p>
                    )}
                </div>

                {/* Chọn điều khoản */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree-terms"
                    checked={registerData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setRegisterData({
                        ...registerData,
                        agreeTerms: checked as boolean,
                      })
                    }
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <label
                    htmlFor="agree-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tôi đồng ý với{" "}
                    <a href="/policy" className="text-primary hover:underline">
                      điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a href="/policy" className="text-primary hover:underline">
                      chính sách bảo mật
                    </a>
                  </label>
                </div>

                {/* Nút đăng ký */}
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang tạo tài khoản...
                    </span>
                  ) : (
                    "Đăng ký"
                  )}
                </Button>

                {/* Liên kết đăng nhập */}
                <div className="text-center text-sm">
                  <p className="text-muted-foreground">
                    Đã có tài khoản?{" "}
                    <a
                      href="/login"
                      className="text-primary font-medium hover:underline"
                    >
                      Đăng nhập ngay
                    </a>
                  </p>
                </div>

                {/* Google Register */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() =>
                    toast.info("Tính năng đăng ký Google sẽ được cập nhật")
                  }
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Đăng ký với Google
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
