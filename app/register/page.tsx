"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, FormEvent } from "react";

interface RegisterPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
  message?: string;
  [key: string]: unknown;
}

interface Toast {
  id: number;
  type: "error" | "success";
  message: string;
}

async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "REGISTRATION_FAILED: unknown error");
  }

  return data;
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const chars =
      "アイウエオカキクケコサシスセソ01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = new Array(columns).fill(1);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
    />
  );
}

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-xs flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`toast-in cursor-pointer border-l-2 bg-[#0a0a0a] px-4 py-3 font-mono text-xs ${
            t.type === "error"
              ? "border-l-[#ff3b3b] text-[#ff6b6b]"
              : "border-l-[#00ff41] text-[#00ff41]"
          }`}
        >
          <span className="opacity-60">
            [{t.type === "error" ? "ERR" : "OK"}]
          </span>{" "}
          {t.message}
        </div>
      ))}
    </div>
  );
}

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const router = useRouter();

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      pushToast("error", "PASSWORD_MISMATCH: inputs do not match");
      return;
    }
    if (password.length < 8) {
      pushToast("error", "WEAK_PASSWORD: minimum 8 characters required");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ email, password });
      pushToast("success", "ACCOUNT_CREATED: redirecting to login...");
      setTimeout(() => router.push("/login"), 900);
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "UNKNOWN_ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 font-mono">
      <MatrixRain />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="relative w-full max-w-md">
        <div className="border border-[#00ff41]/30 bg-[#050505]">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 border-b border-[#00ff41]/20 bg-[#0a0a0a] px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-[#00ff41]/50">
              root@system:~/register
            </span>
          </div>

          <div className="p-8">
            <h1 className="mb-6 text-lg text-[#00ff41]">
              <span className="opacity-60">$</span> new_user --register
              <span className="cursor-blink ml-1">▌</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs text-[#00ff41]/60"
                >
                  &gt; email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="user@domain.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#00ff41]/20 bg-black px-3 py-2 text-sm text-[#00ff41] placeholder-[#00ff41]/25 outline-none transition focus:border-[#00ff41]/70 disabled:opacity-40"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs text-[#00ff41]/60"
                >
                  &gt; password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#00ff41]/20 bg-black px-3 py-2 text-sm text-[#00ff41] placeholder-[#00ff41]/25 outline-none transition focus:border-[#00ff41]/70 disabled:opacity-40"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs text-[#00ff41]/60"
                >
                  &gt; confirm_password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  disabled={isLoading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#00ff41]/20 bg-black px-3 py-2 text-sm text-[#00ff41] placeholder-[#00ff41]/25 outline-none transition focus:border-[#00ff41]/70 disabled:opacity-40"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 border border-[#00ff41] bg-[#00ff41]/10 py-2.5 text-sm text-[#00ff41] transition hover:bg-[#00ff41]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#00ff41]/30 border-t-[#00ff41]" />
                    executing...
                  </>
                ) : (
                  "[ run register.sh ]"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#00ff41]/40">
              already registered?{" "}
              <a
                href="/login"
                className="text-[#00ff41] underline-offset-4 hover:underline"
              >
                ./login
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cursor-blink {
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        .toast-in {
          animation: toastIn 0.2s ease-out;
        }
        @keyframes toastIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
      
  );
}

export default RegisterPage;