import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Mail, Phone } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/features/LanguageSelector";
import {
  resetPasswordForEmail,
  signUpWithEmail,
  signUpWithPhone,
  phoneToEmail,
} from "@/services/authService";
import { logAudit } from "@/services/auditService";

type Method = "email" | "phone";
type Mode = "signin" | "signup" | "forgot";

export default function Login() {
  const [mode, setMode] = useState<Mode>("signin");
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const normalizePhone = (p: string) => {
    const digits = p.replace(/[^0-9]/g, "");
    return digits.startsWith("998") ? `+${digits}` : digits.length === 9 ? `+998${digits}` : `+${digits}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        if (!email) throw new Error("Email kiriting");
        await resetPasswordForEmail(email);
        toast({ title: t("login.resetSent"), description: t("login.resetSentDesc") });
        setMode("signin");
      } else if (mode === "signup") {
        if (!fullName.trim()) throw new Error("Исм-шарифни киритинг");
        if (method === "email") {
          if (!email) throw new Error("Email kiriting");
          await signUpWithEmail(email, password, fullName);
          toast({
            title: "Рўйхатдан ўтдингиз",
            description: "Email-ингизга тасдиқлаш хати юборилди. Тасдиқлагач, тизимга киринг.",
          });
        } else {
          if (!phone) throw new Error("Телефон рақамини киритинг");
          const normalized = normalizePhone(phone);
          await signUpWithPhone(normalized, password, fullName);
          // Auto sign-in after phone signup (no email confirmation for pseudo-emails)
          await signIn(normalized, password);
          logAudit({ action: "user_signup", metadata: { phone: normalized } });
          setTimeout(() => navigate("/select-role"), 300);
          return;
        }
        setMode("signin");
      } else {
        // signin
        const identifier = method === "email" ? email : normalizePhone(phone);
        if (!identifier) throw new Error(method === "email" ? "Email kiriting" : "Телефон рақамини киритинг");
        await signIn(identifier, password);
        logAudit({ action: "user_login", metadata: { identifier } });
        setTimeout(() => navigate("/select-role"), 300);
      }
    } catch (err: unknown) {
      console.error("Login Error:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: "Тизимга киришда хатолик",
        description:
          message === "Invalid login credentials"
            ? "Логин ёки парол нотўғри. Агар аккаунтингиз бўлмаса, аввал рўйхатдан ўтинг."
            : message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isForgot = mode === "forgot";
  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-end"><LanguageSelector /></div>
        <div className="flex flex-col items-center gap-3">
          <img src={logoImg} alt="Logo" className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-primary/25" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">{t("login.title")}</h1>
            <p className="mt-1 text-muted-foreground">{t("login.subtitle")}</p>
          </div>
        </div>
        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">
              {isForgot
                ? t("login.resetPassword")
                : isSignup
                ? "Рўйхатдан ўтиш"
                : t("login.signIn")}
            </CardTitle>
            <CardDescription>
              {isForgot
                ? t("login.resetDesc")
                : isSignup
                ? "Бемор сифатида янги аккаунт яратинг"
                : t("login.signInDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isForgot && (
              <Tabs value={method} onValueChange={(v) => setMethod(v as Method)} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="gap-2">
                    <Phone className="h-4 w-4" /> Телефон
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" />
                <TabsContent value="phone" />
              </Tabs>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Исм-шариф</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Алишер Каримов"
                  />
                </div>
              )}

              {(isForgot || method === "email") && (
                <div className="space-y-2">
                  <Label htmlFor="email">{t("login.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="bemor@transplantcare.uz"
                  />
                </div>
              )}

              {!isForgot && method === "phone" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон рақами</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+998 90 123 45 67"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ўзбекистон форматида: +998 ёки 9 хонали рақам
                  </p>
                </div>
              )}

              {!isForgot && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    {!isSignup && method === "email" && (
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => setMode("forgot")}
                      >
                        {t("login.forgotPassword")}
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                {isForgot
                  ? t("login.sendResetLink")
                  : isSignup
                  ? "Рўйхатдан ўтиш"
                  : t("login.signIn")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isForgot ? (
                <button
                  className="font-medium text-primary hover:underline"
                  onClick={() => setMode("signin")}
                >
                  {t("login.backToLogin")}
                </button>
              ) : isSignup ? (
                <>
                  Аккаунтингиз борми?{" "}
                  <button
                    className="font-medium text-primary hover:underline"
                    onClick={() => setMode("signin")}
                  >
                    Кириш
                  </button>
                </>
              ) : (
                <>
                  Аккаунтингиз йўқми?{" "}
                  <button
                    className="font-medium text-primary hover:underline"
                    onClick={() => setMode("signup")}
                  >
                    Рўйхатдан ўтиш
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}