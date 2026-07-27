"use client"

import { useState, type FormEvent } from "react"
import { Mail, MapPin, Send } from "lucide-react"
import { toast } from "sonner"
import { BRAND } from "@/lib/brand"

export default function ContactSection() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
    toast.success("Pesan terkirim! Kami akan menghubungi Anda segera.")
  }

  return (
    <section id="contact" className="relative min-h-[768px]">
      <h2
        className="absolute left-[clamp(1.5rem,5vw,4.5rem)] top-[clamp(6rem,11vw,10rem)] z-[2] m-0 font-sans text-[clamp(4rem,9vw,9rem)] leading-none font-extrabold tracking-[-0.03em]"
        style={{
          color: "#fff",
          WebkitTextStroke: "4px var(--primary)",
          paintOrder: "stroke fill",
        }}
      >
        Contact
      </h2>

      <div
        className="absolute left-0 right-0 top-[clamp(11rem,16vw,15.75rem)] bottom-0 bg-primary text-white"
        style={{
          padding: "clamp(4rem, 8vw, 8.25rem) clamp(1.5rem, 5vw, 4.5rem) 56px",
          display: "grid",
          gridTemplateColumns: "1fr 560px",
          columnGap: "80px",
          alignItems: "start",
        }}
      >
        <div>
          <p className="m-0 max-w-[440px] font-sans text-[clamp(1.25rem,1.7vw,1.625rem)] leading-[38px] font-light italic text-pretty text-white">
            Tell us what you are looking for — we reply with a shortlist within one
            working day.
          </p>

          <div className="mt-[44px] flex flex-col gap-[18px] font-sans text-[20px] text-white">
            <span className="flex items-center gap-[14px]">
              <span className="block w-5 h-5 shrink-0 opacity-80">
                <Mail size={20} strokeWidth={2.1} />
              </span>
              <a href={`mailto:${BRAND.contact.email}`} className="hover:underline">
                {BRAND.contact.email}
              </a>
            </span>
            <div className="flex items-start gap-[14px]">
              <span className="block w-5 h-5 shrink-0 mt-0.5 opacity-80">
                <MapPin size={20} strokeWidth={2.1} />
              </span>
              <span className="whitespace-pre-line leading-[1.5]">
                {BRAND.contact.address}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full name"
            required
            className="h-14 px-[22px] rounded-xl border border-white/45 bg-transparent text-white text-[19px] outline-none placeholder:text-white/50 focus:border-white"
          />
          <input
            type="email"
            placeholder="Work email"
            required
            className="h-14 px-[22px] rounded-xl border border-white/45 bg-transparent text-white text-[19px] outline-none placeholder:text-white/50 focus:border-white"
          />
          <input
            type="text"
            placeholder="What are you looking for?"
            required
            className="h-14 px-[22px] rounded-xl border border-white/45 bg-transparent text-white text-[19px] outline-none placeholder:text-white/50 focus:border-white"
          />
          <button
            type="submit"
            className="h-14 border-0 rounded-xl bg-white text-primary font-sans text-[19px] font-bold tracking-[0.05em] uppercase cursor-pointer hover:bg-[#111] hover:text-white transition-colors"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {sent ? "Thank you" : "Send request"}
              <Send size={16} strokeWidth={2.1} />
            </span>
          </button>
        </form>

        <div className="col-span-full mt-auto pt-10 flex justify-between font-sans text-[16px] text-white/70">
          <span>© 2026 TAP Catalog</span>
          <span>Commercial real estate network</span>
        </div>
      </div>
    </section>
  )
}
