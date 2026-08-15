import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const inputWrapClass =
  'flex w-full items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-all duration-200 focus-within:border-brand-teal focus-within:shadow-[0_0_0_3px_rgba(0,89,115,0.12)] border-[#dddddd] hover:border-brand-teal/40'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full items-stretch bg-[#f9fafb]">
      <div
        className="relative hidden w-[720px] shrink-0 items-end overflow-hidden bg-cover bg-center px-16 py-20 wide:flex"
        style={{ backgroundImage: "url('/login-illustration.png')" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(56,56,56,0.3) 0%, rgba(77,78,80,0.55) 100%)' }}
        />
        <div className="relative flex w-full flex-col gap-4 rounded-2xl bg-[rgba(102,102,102,0.44)] p-6 text-white backdrop-blur-sm">
          <p className="text-[32px] leading-[40px] tracking-[-0.32px]">Dedicated. Exclusive. Unique.</p>
          <p className="text-lg leading-6">
            Every orphan drug requires its own solution. Only Anovo (AnovoRx) is built from the ground up to develop
            and deliver the optimal solution, every time. We are the exclusive rare disease specialty pharmacy built
            for tomorrow&rsquo;s therapies.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 wide:p-16">
        <div className="flex w-full max-w-[440px] flex-col items-center gap-6 rounded-xl border border-[#e5e5e5] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex w-full flex-col items-center gap-2">
            <img src="/logo.png" alt="AnovoRx" className="h-16 w-auto object-contain" />
            <p className="text-base text-[#383838]">SPECIALTY RX HUB PLATFORM</p>
            <p className="text-center text-sm text-[#4d4e50]">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-2">
              <label className="text-[13px] text-[#383838]">Email Address</label>
              <div className={inputWrapClass}>
                <Mail className="size-4 shrink-0 text-[#4d4e50]" />
                <input
                  type="email"
                  defaultValue="alex.morgan@anovorx.com"
                  required
                  className="w-full flex-1 text-sm text-[#4d4e50] outline-none"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full items-center justify-between text-[13px]">
                <label className="text-[#383838]">Password</label>
                <a href="#" className="text-brand-teal transition-colors hover:text-brand-teal-hover hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className={inputWrapClass}>
                <Lock className="size-4 shrink-0 text-[#4d4e50]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="anovorx-demo"
                  required
                  className="w-full flex-1 text-sm text-[#4d4e50] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="text-[#4d4e50] transition-colors hover:text-brand-teal"
                >
                  {showPassword ? <Eye className="size-4 shrink-0" /> : <EyeOff className="size-4 shrink-0" />}
                </button>
              </div>
            </div>

            <label className="flex w-full items-center gap-2 text-[13px] text-[#4d4e50]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-[#dddddd] accent-brand-teal"
              />
              Remember me for 30 days
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-brand-teal px-4 py-3 text-center text-sm text-white transition-all duration-200 hover:bg-brand-teal-hover hover:shadow-md active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-[#dddddd]" />
            <p className="whitespace-nowrap text-xs uppercase text-[#707070]">New Here?</p>
            <div className="h-px flex-1 bg-[#dddddd]" />
          </div>

          <p className="w-full text-center text-sm text-[#4d4e50]">
            Don&rsquo;t have an account?{' '}
            <a href="#" className="font-semibold text-[#4d4e50] transition-colors hover:text-brand-teal">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
