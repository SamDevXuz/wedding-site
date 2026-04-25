import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Home,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Share2,
  VolumeX,
  Volume2,
  Navigation,
  Send,
} from "lucide-react";
import {
  subscribeConfig,
  subscribeWishes,
  addWish,
  DEFAULT_CONFIG,
  type WeddingConfig,
  type Wish,
} from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "To'y marosimiga qo'shiling!" },
      {
        name: "description",
        content:
          "Assalomu alaykum, sizni to'y marosimimizga taklif qilamiz.",
      },
    ],
  }),
  component: WeddingPage,
});

const STICKERS = [
  { id: "1", emoji: "\uD83C\uDF89" },
  { id: "2", emoji: "\uD83D\uDC8D" },
  { id: "3", emoji: "\u2764\uFE0F" },
  { id: "4", emoji: "\uD83C\uDF82" },
  { id: "5", emoji: "\uD83C\uDF88" },
  { id: "6", emoji: "\uD83C\uDF39" },
  { id: "7", emoji: "\uD83E\uDD73" },
  { id: "8", emoji: "\uD83D\uDC90" },
  { id: "9", emoji: "\uD83C\uDF8A" },
  { id: "10", emoji: "\u2728" },
  { id: "11", emoji: "\uD83C\uDF38" },
  { id: "12", emoji: "\uD83C\uDF1F" },
];

function WeddingPage() {
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_CONFIG);
  const [activeSection, setActiveSection] = useState("home");
  const [muted, setMuted] = useState(true);
  const [celebration, setCelebration] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsub = subscribeConfig(setConfig);
    return () => unsub();
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      const a = new Audio("/assets/bg-sound.mp3");
      a.loop = true;
      a.volume = 0.3;
      audioRef.current = a;
    }
    if (muted) {
      audioRef.current.play().catch(() => {});
      setMuted(false);
    } else {
      audioRef.current.pause();
      setMuted(true);
    }
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "To'y taklifnomasi",
        url: window.location.href,
      }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen relative">
      {celebration && <CelebrationEffects />}

      <NavBar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <Button
          onClick={share}
          className="romantic-nav-glass rounded-full p-3 shadow-2xl text-emerald-500 hover:bg-emerald-100 border-0"
        >
          <Share2 className="w-5 h-5" />
        </Button>
        <Button
          onClick={toggleAudio}
          className="romantic-nav-glass rounded-full p-3 shadow-2xl text-emerald-500 hover:bg-emerald-100 border-0"
          variant="ghost"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      <div className="relative z-10">
        {activeSection === "home" && (
          <div className="space-y-8">
            <HeroSection config={config} />
            <div className="max-w-3xl mx-auto px-4">
              <CountdownTimer
                weddingDate={config.weddingDate}
                onComplete={() => setCelebration(true)}
              />
            </div>
          </div>
        )}
        {activeSection === "wishes" && <WishesSection />}
        {activeSection === "location" && <LocationSection config={config} />}
      </div>
    </div>
  );
}

function NavBar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (s: string) => void;
}) {
  const items = [
    { id: "home", label: "Bosh sahifa", icon: Home },
    { id: "wishes", label: "Tilaklar", icon: Heart },
    { id: "location", label: "Manzil", icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:top-6 md:bottom-auto transition-all duration-300 opacity-100 visible">
      <div className="romantic-nav-glass rounded-2xl p-3 shadow-2xl">
        <div className="flex justify-center gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                variant="ghost"
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 p-3 md:px-4 md:py-3 rounded-xl smooth-transition font-cormorant ${
                  activeSection === item.id
                    ? "romantic-glow-button text-white shadow-lg"
                    : "text-emerald-600 hover:text-white hover:bg-emerald-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ config }: { config: WeddingConfig }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const formatDate = () => {
    const d = new Date(config.weddingDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen romantic-animated-bg romantic-pattern-overlay flex items-center justify-center p-4 nav-mobile-spacing">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="romantic-floating-glow absolute top-20 left-10 text-4xl">{"\uD83C\uDF3F"}</div>
        <div className="romantic-floating-glow absolute top-40 right-16 text-3xl" style={{ animationDelay: "1s" }}>{"\uD83C\uDF43"}</div>
        <div className="romantic-floating-glow absolute bottom-40 left-20 text-3xl" style={{ animationDelay: "2s" }}>{"\uD83D\uDC9A"}</div>
        <div className="romantic-floating-glow absolute bottom-32 right-10 text-4xl" style={{ animationDelay: "3s" }}>{"\uD83C\uDF31"}</div>
        <div className="romantic-floating-glow absolute top-1/2 left-1/4 text-2xl" style={{ animationDelay: "4s" }}>{"\u2728"}</div>
      </div>

      <div className="romantic-glass-effect rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative z-10">
        <div className="mb-8 mt-12">
          <p className="text-2xl md:text-3xl font-playfair font-bold text-emerald-600 mb-2">
            {"\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645"}
          </p>
          <p className="text-sm text-gray-500 font-cormorant">
            Bismillahir Rohmanir Rohiym
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-cormorant">
              You are invited to the wedding of
            </p>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold romantic-glow-text mb-6">
              {config.groomName}
            </h1>
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 max-w-24" />
              <span className="text-4xl md:text-5xl romantic-floating-glow">{"\uD83D\uDC8D"}</span>
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 max-w-24" />
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold romantic-glow-text">
              {config.brideName}
            </h1>
          </div>

          <div className="romantic-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 smooth-transition hover:shadow-md">
                <Calendar className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700 font-cormorant text-sm">Sana</p>
                  <p className="text-gray-600 font-cormorant text-base md:text-lg">{formatDate()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 smooth-transition hover:shadow-md">
                <Clock className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700 font-cormorant text-sm">Vaqti</p>
                  <p className="text-gray-600 font-cormorant text-lg md:text-xl font-medium">{config.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 smooth-transition hover:shadow-md">
                <MapPin className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-700 font-cormorant text-sm">Adress</p>
                  <p className="text-gray-600 font-cormorant text-base md:text-lg font-medium">{config.venue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="romantic-card rounded-2xl p-6 md:p-8 text-left">
            <div className="space-y-4 text-gray-600 leading-relaxed font-cormorant">
              <p className="text-lg md:text-xl">
                <span className="romantic-glow-text font-playfair font-bold text-xl md:text-2xl">
                  Hurmatli mehmonimiz!
                </span>
              </p>
              <p className="text-base md:text-lg">
                Hayotimizdagi eng baxtli va unitilmas kun – nikoh to'yimiz munosabati bilan
                bo'lib o'tadigan tantanali kechamizning aziz mehmoni bo'lishga taklif etamiz.
              </p>
              <div className="text-center space-y-2 my-4">
                <p className="font-arabic text-xl md:text-2xl text-gray-800">
                  {"\u0648\u064E\u062D\u064F\u0636\u064F\u0648\u0631\u064F\u0643\u064F\u0645\u0652 \u064A\u064F\u062F\u0652\u062E\u0650\u0644\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0646\u064E\u0627 \u0627\u0644\u0652\u0641\u064E\u0631\u064E\u062D\u064E \u0648\u064E\u0627\u0644\u0633\u0651\u064F\u0631\u064F\u0648\u0631\u064E"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  Tashrifingiz bizga quvonch va surur bag'ishlaydi.
                </p>
                <p className="font-arabic text-xl md:text-2xl text-gray-800 mt-4">
                  {"\u0648\u064E\u062E\u064E\u0644\u064E\u0642\u0652\u0646\u064E\u0627\u0643\u064F\u0645\u0652 \u0623\u064E\u0632\u0652\u0648\u064E\u0627\u062C\u064B\u0627"} (78:8)
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  Va sizlarni juft qilib yaratdi.
                </p>
              </div>
              {config.message && (
                <p className="text-base md:text-lg">{config.message}</p>
              )}
              <p className="text-center mt-6">
                <span className="romantic-glow-text font-playfair font-bold text-xl md:text-2xl">
                  Alloh ularni qalbini sevgi ila birlashtirdi! (8:63)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-100 to-amber-100 p-4 md:p-5 rounded-2xl border border-emerald-200 shadow-sm mt-2">
            <p className="text-sm md:text-base text-emerald-800 font-semibold font-cormorant">
              Alloh taolo bu nikohni sizlar uchun rahmat, qalblaringiz uchun sakinat,
              hayotingiz uchun barokat qilsin.
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-2 font-cormorant italic">
              Duolaringiz va ishtirokingiz biz uchun eng ulug' tuhfa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownTimer({
  weddingDate,
  onComplete,
}: {
  weddingDate: string;
  onComplete: () => void;
}) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(weddingDate).getTime() - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        onComplete();
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTime({ days, hours, minutes, seconds, isComplete: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [weddingDate, onComplete]);

  if (time.isComplete) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-sage-50 rounded-2xl p-12 shadow-lg border border-emerald-200 text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-12 h-12 text-emerald-600 fill-emerald-600 animate-pulse" />
          <h2 className="text-5xl font-bold text-emerald-700">To'y Boshlandi!</h2>
          <Heart className="w-12 h-12 text-emerald-600 fill-emerald-600 animate-pulse" />
        </div>
        <p className="text-2xl text-sage-700 font-medium">Bizning baxtli kunimiz keldi!</p>
      </div>
    );
  }

  const blocks = [
    { value: time.days, label: "Kun", from: "from-emerald-400", to: "to-emerald-500", border: "border-emerald-200", hoverBorder: "hover:border-emerald-300", text: "text-emerald-600" },
    { value: time.hours, label: "Soat", from: "from-sage-400", to: "to-sage-500", border: "border-sage-200", hoverBorder: "hover:border-sage-300", text: "text-sage-600" },
    { value: time.minutes, label: "Daqiqa", from: "from-emerald-500", to: "to-sage-400", border: "border-emerald-200", hoverBorder: "hover:border-emerald-300", text: "text-emerald-700" },
    { value: time.seconds, label: "Soniya", from: "from-sage-500", to: "to-emerald-400", border: "border-sage-200", hoverBorder: "hover:border-sage-300", text: "text-sage-700" },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl p-10 shadow-xl border border-emerald-100 mb-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-sage-800 mb-2">To'ygacha qoldi</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-sage-500 rounded-full mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {blocks.map((b) => (
          <div key={b.label} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${b.from} ${b.to} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity`} />
            <div className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 ${b.border} ${b.hoverBorder} transition-all hover:scale-105 text-center`}>
              <div className={`text-5xl font-bold ${b.text} mb-2`}>{b.value}</div>
              <div className="text-sm font-semibold text-sage-600 uppercase tracking-wider">{b.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
        <p className="text-sage-600 text-sm font-medium">Sizni kutamiz</p>
        <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
      </div>
    </div>
  );
}

function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sticker, setSticker] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = subscribeWishes(setWishes);
    return () => unsub();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setBusy(true);
    try {
      await addWish(name.trim(), message.trim(), sticker);
      setMessage("");
      setSticker("");
      setShowStickers(false);
    } catch {
      // silent
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen dark-romantic-bg animated-bg islamic-pattern-overlay flex items-center justify-center p-4 nav-mobile-spacing mt-6">
      <div className="md:max-w-xl max-w-sm mx-auto p-4 space-y-6 pt-8">
        <div className="text-center dark-glass-effect rounded-3xl p-6 mt-6">
          <h2 className="text-3xl font-bold glow-text">Tilaklar va Tabriklar</h2>
          <p className="text-gray-300 leading-relaxed mt-3">
            Yosh juftlikka o'z tilak va tabriklaringizni qoldiring
          </p>
        </div>

        <Card className="islamic-glass-effect border-0 shadow-2xl">
          <CardContent className="p-6 space-y-6">
            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                placeholder="Ismingiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 text-gray-900 placeholder:text-gray-400 focus:ring-emerald-400 px-4 py-3 text-base"
              />
              <Textarea
                placeholder="Tilak va tabriklaringizni yozing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none bg-white/10 border-white/20 text-gray-900 placeholder:text-gray-400 focus:ring-emerald-400"
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStickers(!showStickers)}
                  className="border-green-500 text-gray-500 hover:bg-green/10 bg-gray-100"
                >
                  {sticker || "\uD83D\uDE0A"} Stiker
                </Button>
                {sticker && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-green-500">
                    Tanlangan: {sticker}
                  </span>
                )}
              </div>
              {showStickers && (
                <div className="dark-card border border-white/20 rounded-2xl p-4">
                  <p className="text-sm font-medium text-gray-600 mb-4 text-center">Stiker tanlang</p>
                  <div className="grid grid-cols-6 gap-3">
                    {STICKERS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => { setSticker(s.emoji); setShowStickers(false); }}
                        className={`p-1 text-lg sm:text-2xl rounded-xl transition-all hover:scale-110 ${
                          sticker === s.emoji
                            ? "bg-white/20 ring-2 ring-pink-400 shadow-lg"
                            : "hover:bg-white/10"
                        }`}
                      >
                        {s.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button
                type="submit"
                disabled={busy || !name.trim() || !message.trim()}
                className="w-full glow-button text-white font-semibold py-4 rounded-xl shadow-2xl smooth-transition h-14 text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                {busy ? "Yuborilmoqda..." : "Tilak Yuborish"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {wishes.map((w) => (
            <Card key={w.id} className="clean-glass-effect rounded-2xl p-5 border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-lg">{w.userName}</span>
                    <span className="wish-card-date-pill">
                      {new Date(w.createdAt).toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="wish-card-message-bubble">
                    <p className="text-gray-700 leading-relaxed">{w.message}</p>
                  </div>
                  {w.sticker && <div className="text-3xl text-right mt-2">{w.sticker}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
          {wishes.length === 0 && (
            <div className="text-center py-16 dark-glass-effect rounded-3xl">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 text-lg mb-2">Hali tilaklar yo'q</p>
              <p className="text-gray-400">Birinchi bo'lib tilak yozing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationSection({ config }: { config: WeddingConfig }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const formatDate = () => {
    const d = new Date(config.weddingDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${y}-${m}-${day} ${weekday}`;
  };

  return (
    <div className="min-h-screen islamic-dark-bg islamic-animated-bg islamic-pattern-overlay nav-mobile-spacing mt-6">
      <div className="max-w-4xl mx-auto p-4 space-y-6 pt-8 mt-6">
        <div className="text-center islamic-glass-effect rounded-3xl p-6 mt-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MapPin className="w-7 h-7 text-emerald-400 islamic-floating-glow" />
            <h2 className="text-3xl font-bold islamic-glow-text">To'y Manzili</h2>
            <Navigation className="w-7 h-7 text-emerald-400 islamic-floating-glow" />
          </div>
          <p className="text-gray-400 leading-relaxed">
            Bizning baxtli kunimizga yo'l topishingiz uchun batafsil ma'lumot
          </p>
        </div>

        <Card className="islamic-glass-effect border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold islamic-glow-text mb-3">{config.venue}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">{config.address}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="islamic-dark-card rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-500 text-lg">Marosim vaqti</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-400">{formatDate()}</p>
                    <p className="text-emerald-500 font-semibold text-xl">{config.time}</p>
                  </div>
                </div>

                <div className="islamic-dark-card rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Navigation className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-500 text-lg">Transport</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-400">Bepul avtoturargoh mavjud</p>
                    <p className="text-gray-400">Taksi: Yandex Go</p>
                  </div>
                </div>

                <div className="islamic-dark-card rounded-2xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-500 text-lg">Aloqa</h4>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-400">{config.phone}</p>
                    <p className="text-gray-400">Savollar va yo'l ko'rsatish uchun</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {config.mapDirectUrl && (
                  <>
                    <Button
                      onClick={() => window.open(config.mapDirectUrl, "_blank")}
                      className="w-full islamic-glow-button text-white font-semibold py-4 rounded-xl shadow-2xl smooth-transition h-16 text-lg"
                    >
                      <MapPin className="w-6 h-6 mr-3" />
                      Xaritada Ko'rish
                    </Button>
                    <Button
                      onClick={() => window.open(config.mapDirectUrl, "_blank")}
                      variant="outline"
                      className="w-full islamic-dark-card border-emerald-500/30 text-gray-700 hover:bg-emerald-500/20 py-4 rounded-xl bg-emerald-500/10 h-16 text-lg font-semibold"
                    >
                      <Navigation className="w-6 h-6 mr-3" />
                      Yo'nalish Olish
                    </Button>
                  </>
                )}
                <div className="bg-gradient-to-r from-emerald-500/20 to-amber-500/20 p-5 rounded-2xl border border-emerald-500/30">
                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    <strong className="text-gray-600">Muhim eslatma:</strong> Marosim vaqtidan 30 daqiqa
                    oldin kelishingizni so'raymiz. Kechikish holatida aloqa raqamiga qo'ng'iroq qiling.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {config.mapEmbedUrl && (
          <Card className="islamic-glass-effect border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-80 md:h-96">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-amber-500/20">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4 islamic-floating-glow" />
                      <p className="text-gray-400 text-lg">Xarita yuklanmoqda...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={config.mapEmbedUrl}
                  height="400"
                  width="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(true)}
                  className="rounded-b-3xl"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="islamic-dark-card border border-emerald-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-gray-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-gray-500">{"\uD83D\uDC54"}</span>Kiyim-kechak
              </h4>
              <p className="text-gray-400 text-sm">Rasmiy kiyim tavsiya etiladi</p>
            </CardContent>
          </Card>
          <Card className="islamic-dark-card border border-emerald-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-gray-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-amber-400">{"\uD83C\uDF81"}</span>Sovg'alar
              </h4>
              <p className="text-gray-400 text-sm">Sizning kelishingiz eng yaxshi sovg'a!</p>
            </CardContent>
          </Card>
          <Card className="islamic-dark-card border border-emerald-500/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-gray-500 mb-2 flex items-center justify-center gap-2">
                <span className="text-emerald-400">{"\uD83D\uDD4C"}</span>Marosim
              </h4>
              <p className="text-gray-400 text-sm">Nikoh va to'y marosimi</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CelebrationEffects() {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string; delay: string }>>([]);
  const [fireworks, setFireworks] = useState<Array<{ id: number; left: string; top: string; color: string; delay: string }>>([]);

  useEffect(() => {
    const colors = ["#ff6b9d", "#ffa07a", "#ffd700", "#ff69b4", "#ffb6c1"];
    setConfetti(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * 5)],
        delay: `${Math.random() * 3}s`,
      })),
    );
    setFireworks(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 40}%`,
        color: colors[Math.floor(Math.random() * 5)],
        delay: `${Math.random() * 2}s`,
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {confetti.map((c) => (
        <div
          key={`confetti-${c.id}`}
          className="confetti-piece"
          style={{
            left: c.left,
            backgroundColor: c.color,
            animation: `confetti-fall ${3 + Math.random() * 2}s linear infinite`,
            animationDelay: c.delay,
          }}
        />
      ))}
      {fireworks.map((f) => (
        <div
          key={`firework-${f.id}`}
          className="firework-particle"
          style={{
            left: f.left,
            top: f.top,
            backgroundColor: f.color,
            animation: "firework 1s ease-out infinite",
            animationDelay: f.delay,
            "--x": `${(Math.random() - 0.5) * 200}px`,
            "--y": `${(Math.random() - 0.5) * 200}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
