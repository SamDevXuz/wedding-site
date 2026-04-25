import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  LogOut,
  Save,
  Settings,
  Trash2,
  MessageSquare,
} from "lucide-react";
import {
  adminLogin,
  adminLogout,
  subscribeAuth,
  subscribeConfig,
  saveWeddingConfig,
  subscribeWishes,
  removeWish,
  DEFAULT_CONFIG,
  type WeddingConfig,
  type Wish,
} from "@/lib/api";
import type { User } from "firebase/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin panel — To'y boshqaruvi" }] }),
  component: AdminPage,
});

const emptyConfig: WeddingConfig = {
  groomName: "",
  brideName: "",
  weddingDate: "",
  time: "",
  venue: "",
  address: "",
  phone: "",
  mapEmbedUrl: "",
  mapDirectUrl: "",
  message: "",
};

function AdminPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = subscribeAuth(setUser);
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Yuklanmoqda...
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return <DashboardView user={user} />;
}

function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminLogin(email, password);
      toast.success("Xush kelibsiz");
    } catch {
      toast.error("Email yoki parol xato");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin kirish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="pwd">Parol</Label>
              <Input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Tekshirilmoqda..." : "Kirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardView({ user }: { user: User }) {
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_CONFIG);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub1 = subscribeConfig((c) => {
      if (c) setConfig(c);
      setLoaded(true);
    });
    const unsub2 = subscribeWishes(setWishes);
    return () => { unsub1(); unsub2(); };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveWeddingConfig(config);
      toast.success("Saqlandi");
    } catch {
      toast.error("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    toast.success("Chiqildi");
  };

  const handleDeleteWish = async (id: string) => {
    if (!confirm("Tilakni o'chirishni xohlaysizmi?")) return;
    try {
      await removeWish(id);
      toast.success("O'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const update = (key: keyof WeddingConfig) => (e: { target: { value: string } }) =>
    setConfig((prev) => ({ ...prev, [key]: e.target.value }));

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            To'y boshqaruvi
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={() => window.open("/", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-1" /> Ko'rish
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Chiqish
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" /> Sozlamalar
            </TabsTrigger>
            <TabsTrigger value="wishes">
              <MessageSquare className="h-4 w-4 mr-1" /> Tilaklar ({wishes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>To'y ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Kuyov ismi *">
                    <Input value={config.groomName} onChange={update("groomName")} placeholder="Ravshanbek" />
                  </Field>
                  <Field label="Kelin ismi *">
                    <Input value={config.brideName} onChange={update("brideName")} placeholder="Madinaxon" />
                  </Field>
                  <Field label="To'y sanasi *">
                    <Input type="date" value={config.weddingDate} onChange={update("weddingDate")} />
                  </Field>
                  <Field label="Vaqti">
                    <Input value={config.time} onChange={update("time")} placeholder="16:00" />
                  </Field>
                  <Field label="To'yxona nomi">
                    <Input value={config.venue} onChange={update("venue")} placeholder="Brend Hall" />
                  </Field>
                  <Field label="Telefon raqam">
                    <Input value={config.phone} onChange={update("phone")} placeholder="+998 90 123 45 67" />
                  </Field>
                </div>

                <Field label="Manzil">
                  <Textarea
                    rows={2}
                    value={config.address}
                    onChange={update("address")}
                    placeholder="Toshkent shahri, Yunusobod tumani..."
                  />
                </Field>

                <Field label="Xarita embed URL (Yandex/Google Maps iframe src)">
                  <Input
                    value={config.mapEmbedUrl}
                    onChange={update("mapEmbedUrl")}
                    placeholder="https://yandex.uz/map-widget/v1/org/..."
                  />
                </Field>

                <Field label="Xarita havola URL (tugma bosilganda ochiladi)">
                  <Input
                    value={config.mapDirectUrl}
                    onChange={update("mapDirectUrl")}
                    placeholder="https://yandex.com/maps/org/..."
                  />
                </Field>

                <Field label="Qo'shimcha xabar (taklifnomada ko'rinadi)">
                  <Textarea
                    rows={3}
                    value={config.message}
                    onChange={update("message")}
                    placeholder="Ushbu muborak nikoh tantanasida Sizning ishtirokingiz..."
                  />
                </Field>

                <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishes">
            <Card>
              <CardHeader>
                <CardTitle>Tilaklar ({wishes.length} ta)</CardTitle>
              </CardHeader>
              <CardContent>
                {wishes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Hali tilaklar yo'q</p>
                ) : (
                  <div className="space-y-3">
                    {wishes.map((w) => (
                      <div key={w.id} className="flex items-start gap-3 p-4 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{w.userName}</span>
                            {w.sticker && <span className="text-lg">{w.sticker}</span>}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(w.createdAt).toLocaleDateString("uz-UZ")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{w.message}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteWish(w.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
