"use client"

import { SignUp } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-900/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">AI Docs</span>
        </div>

        <SignUp 
          appearance={{
            baseTheme: undefined,
            variables: {
              colorBackground: "#0d1110",
              colorPrimary: "#10b981",
              colorText: "#f0fdf4",
              colorTextSecondary: "#6ee7b7",
              colorInputBackground: "#1a1f1e",
              colorInputText: "#f0fdf4",
              borderRadius: "0.75rem",
            },
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-[#0d1110] shadow-2xl shadow-black/50 border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-xl",
              headerTitle: "text-2xl font-bold text-white text-center",
              headerSubtitle: "text-emerald-500/80 text-center",
              formFieldLabel: "text-emerald-100/80 font-medium",
              formFieldInput: "bg-[#1a1f1e] border-emerald-500/20 text-white rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20",
              formButtonPrimary: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all",
              footerActionLink: "text-emerald-400 hover:text-emerald-300",
              dividerLine: "bg-emerald-500/20",
              dividerText: "text-emerald-500/60",
              socialButtonsBlockButton: "border-emerald-500/20 text-emerald-100 hover:bg-emerald-500/10 rounded-xl transition-colors",
              formFieldErrorText: "text-red-400",
            }
          }}
        />

        <p className="text-center text-sm text-emerald-500/40 mt-8">
          Secure signup powered by Clerk
        </p>
      </div>
    </div>
  )
}
