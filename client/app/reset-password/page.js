"use client"; // Final password reset step
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalError, setModalError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forgot/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, email, newPassword: password }),
        }
      );
      if (!res.ok)
        throw new Error("Error updating password. Please try again.");
      setModalMsg("Password updated successfully!");
      setModalError(false);
      setModalOpen(true);
      ["otp", "email", "role"].forEach((k) => localStorage.removeItem(k));
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err) {
      setModalMsg(err.message || "Error updating password. Please try again.");
      setModalError(true);
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-teal-75 overflow-x-hidden">
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`p-6 rounded-lg shadow-xl ${modalError ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
            role="alert"
            aria-live="polite"
          >
            <p
              className={`text-center mb-4 ${modalError ? "text-red-600" : "text-green-600"}`}
            >
              {modalMsg}
            </p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="group">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-teal-600">
                Calmly
              </h1>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)] supports-[height:100dvh]:min-h-[calc(100dvh-160px)]">
          <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border border-slate-200/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Reset Password
                </h2>
                <p className="text-slate-600">Create a new secure password</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">
                      New Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50 focus:bg-white/70 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/50"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200/40"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? "Saving..." : "Save Password"}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-600">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-indigo-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-slate-500 text-sm">
            © 2025 Calmly. Compassion in every connection.
          </div>
        </div>
      </footer>
    </div>
  );
}
