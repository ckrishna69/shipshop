import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const f = new FormData(e.target);
    const pw = f.get("password");
    const confirm = f.get("confirm");
    if (pw !== confirm) return setError("Passwords don't match.");
    try {
      await resetPassword(token, pw);
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-canvas min-h-screen flex items-center justify-center p-6 font-body">
      <div className="w-[380px] max-w-full bg-white rounded-2xl p-7">
        {done ? (
          <div className="text-center">
            <div className="w-[50px] h-[50px] rounded-full bg-[#E1F0EB] flex items-center justify-center mx-auto mb-3.5">
              <Check size={22} color="#2E6E60" />
            </div>
            <p className="text-[13.5px] mb-4">Your password has been reset.</p>
            <button onClick={() => navigate("/")} className="bg-ink text-white px-5 py-2.5 rounded-lg font-bold text-[13.5px]">Back to Shipshop</button>
          </div>
        ) : (
          <>
            <p className="font-display text-2xl font-semibold mb-1">Set a new password</p>
            <p className="text-xs text-[#736D5E] mb-5">Make it something you haven't used before.</p>
            {!token && <p className="text-xs text-rust mb-3">This link is missing its reset token.</p>}
            <form onSubmit={submit}>
              <input name="password" required type="password" minLength={8} placeholder="New password" className="w-full px-3 py-2.5 rounded-lg border border-line mb-3.5" />
              <input name="confirm" required type="password" minLength={8} placeholder="Confirm password" className="w-full px-3 py-2.5 rounded-lg border border-line mb-4" />
              {error && <p className="text-xs text-rust mb-3">{error}</p>}
              <button type="submit" className="w-full py-2.5 bg-ink text-white rounded-lg font-bold text-[13.5px]">Reset password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
