import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-6">
        <SignIn 
          appearance={{
            baseTheme: undefined,
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 rounded-2xl p-8",
              headerTitle: "text-2xl font-bold text-slate-900 dark:text-white text-center",
              headerSubtitle: "text-slate-600 dark:text-slate-400 text-center",
              formFieldLabel: "text-slate-700 dark:text-slate-300 font-medium",
              formFieldInput: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg",
              formButtonPrimary: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg font-medium",
              footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
              dividerLine: "bg-slate-300 dark:bg-slate-700",
              dividerText: "text-slate-500 dark:text-slate-400",
              socialButtonsBlockButton: "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
              formFieldErrorText: "text-red-500",
              identityPreviewText: "text-slate-700 dark:text-slate-300",
              identityPreviewEditButton: "text-blue-600 dark:text-blue-400",
            }
          }}
        />
      </div>
    </div>
  )
}
