import { useState } from "react";
import { X, Mail, Lock, Phone, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ onClose }) {
  const { login, signup, requestOtp, verifyOtp, forgotPassword } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup | otp | forgot
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const handle = async (fn) => {
    setError("");
    try {
      await fn();
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/45 z-[120] flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-[380px] max-w-full bg-white rounded-2xl p-7 relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X size={18} /></button>

        {mode === "login" && (
          <>
            <p className="font-display text-2xl font-semibold mb-1">Welcome back</p>
            <p className="text-xs text-[#736D5E] mb-5">Log in to continue to Shipshop.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.target);
                handle(() => login(f.get("email"), f.get("password")));
              }}
            >
              <label className="text-xs font-semibold block mb-1.5">Email</label>
              <div className="relative mb-3.5">
                <Mail size={15} className="absolute left-3 top-3 text-[#736D5E]" />
                <input name="email" required type="email" placeholder="you@example.com" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line" />
              </div>
              <label className="text-xs font-semibold block mb-1.5">Password</label>
              <div className="relative mb-2">
                <Lock size={15} className="absolute left-3 top-3 text-[#736D5E]" />
                <input name="password" required type="password" placeholder="••••••••" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line" />
              </div>
              <div className="text-right mb-4">
                <span onClick={() => setMode("forgot")} className="text-xs text-golddeep font-semibold cursor-pointer">Forgot password?</span>
              </div>
              {error && <p className="text-xs text-rust mb-3">{error}</p>}
              <button type="submit" className="w-full py-2.5 bg-ink text-white rounded-lg font-bold text-[13.5px] mb-2.5">Log in</button>
              <button type="button" onClick={() => setMode("otp")} className="w-full py-2.5 border border-line rounded-lg font-bold text-[13.5px] flex items-center justify-center gap-2">
                <Phone size={15} /> Log in with OTP
              </button>
            </form>
            <p className="text-center text-xs text-[#736D5E] mt-4">
              New here? <span onClick={() => setMode("signup")} className="text-golddeep font-bold cursor-pointer">Sign up</span>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <p className="font-display text-2xl font-semibold mb-1">Create your account</p>
            <p className="text-xs text-[#736D5E] mb-5">Takes less than a minute.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.target);
                handle(() => signup(f.get("name"), f.get("email"), f.get("password")));
              }}
            >
              <label className="text-xs font-semibold block mb-1.5">Full name</label>
              <input name="name" required placeholder="Aditi Sharma" className="w-full px-3 py-2.5 rounded-lg border border-line mb-3.5" />
              <label className="text-xs font-semibold block mb-1.5">Email</label>
              <input name="email" required type="email" placeholder="you@example.com" className="w-full px-3 py-2.5 rounded-lg border border-line mb-3.5" />
              <label className="text-xs font-semibold block mb-1.5">Password</label>
              <input name="password" required type="password" minLength={8} placeholder="At least 8 characters" className="w-full px-3 py-2.5 rounded-lg border border-line mb-4" />
              {error && <p className="text-xs text-rust mb-3">{error}</p>}
              <button type="submit" className="w-full py-2.5 bg-ink text-white rounded-lg font-bold text-[13.5px]">Create account</button>
            </form>
            <p className="text-center text-xs text-[#736D5E] mt-4">
              Already have an account? <span onClick={() => setMode("login")} className="text-golddeep font-bold cursor-pointer">Log in</span>
            </p>
          </>
        )}

        {mode === "otp" && (
          <>
            <button onClick={() => setMode("login")} className="flex items-center gap-1.5 text-xs text-[#736D5E] mb-3.5"><ArrowLeft size={14} /> Back</button>
            <p className="font-display text-2xl font-semibold mb-1">Log in with OTP</p>
            <p className="text-xs text-[#736D5E] mb-5">{otpSent ? "Enter the 4-digit code we sent you." : "We'll text you a one-time code."}</p>
            {error && <p className="text-xs text-rust mb-3">{error}</p>}
            {!otpSent ? (
              <>
                <label className="text-xs font-semibold block mb-1.5">Phone number</label>
                <div className="relative mb-4">
                  <Phone size={15} className="absolute left-3 top-3 text-[#736D5E]" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line" />
                </div>
                <button
                  onClick={async () => {
                    setError("");
                    try {
                      await requestOtp(phone);
                      setOtpSent(true);
                    } catch (e) {
                      setError(e.message);
                    }
                  }}
                  className="w-full py-2.5 bg-ink text-white rounded-lg font-bold text-[13.5px]"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handle(() => verifyOtp(phone, code)); }}>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="0000"
                  className="w-full text-center tracking-[10px] font-mono text-xl px-3 py-3 rounded-lg border border-line mb-4"
                />
                <button type="submit" className="w-full py-2.5 bg-ink text-white rounded-lg font-bold text-[13.5px]">Verify and log in</button>
              </form>
            )}
          </>
        )}

        {mode === "forgot" && (
          <>
            <button onClick={() => setMode("login")} className="flex items-center gap-1.5 text-xs text-[#736D5E] mb-3.5"><ArrowLeft size={14} /> Back</button>
            <p className="font-display text-2xl font-semibold mb-1">Reset your password</p>
            {!resetSent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.target);
                  forgotPassword(f.get("email")).then(() => setResetSent(true));
                }}
              >
                <p className="text-xs text-[#736D5E] mb-5">Enter your email and we'll send a reset link.</p>
                <div className="relative mb-4">
                  <Mail size={15} className="absolute left-3 top-3 text-[#736D5E]" />
                  <input name="email" required type="email" placeholder="you@example.com" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-ink text-white rounded-lg font-bold text-[13.5px]">Send reset link</button>
              </form>
            ) : (
              <div className="text-center py-2">
                <div className="w-[50px] h-[50px] rounded-full bg-[#E1F0EB] flex items-center justify-center mx-auto mb-3.5">
                  <Check size={22} color="#2E6E60" />
                </div>
                <p className="text-[13.5px]">Reset link sent. Check your inbox.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
