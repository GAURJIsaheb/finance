"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn routing="path" signUpUrl="/sign-up" signInFallbackRedirectUrl="/dashboard" />
    </div>
  );
}