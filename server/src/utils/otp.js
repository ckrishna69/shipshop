// Minimal in-memory OTP flow. Swap sendSms() for Twilio/MSG91/etc in production —
// everything else (generation, expiry, verification) stays the same.

export function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function sendSms(phone, code) {
  console.log(`[OTP] ${phone} -> ${code}`);
  return true;
}
