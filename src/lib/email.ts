export async function sendOtp(email: string, otp: string) {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[DEV OTP] ${email}: ${otp}`);
    return;
  }
  throw new Error("EMAIL_PROVIDER_NOT_CONFIGURED");
}
