"use client"

import { useState, type FormEvent } from "react"
import { Clock, AtSign, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react"
import { toast } from "sonner"
import { BRAND } from "@/lib/brand"

export default function ContactSection() {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success("Pesan terkirim! Kami akan menghubungi Anda segera.")
      ;(e.target as HTMLFormElement).reset()
      setSubmitting(false)
    }, 400)
  }

  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground/80"
  const inputClass =
    "w-full rounded-xl bg-primary-foreground/95 px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-gold"

  return (
    <section className="bg-background pt-16 sm:pt-20">
      <div className="container mx-auto px-4">
        <h2
          aria-hidden
          className="font-sans font-extrabold italic leading-[0.85] tracking-tight text-outline select-none text-center"
          style={{ fontSize: "clamp(5rem, 18vw, 12rem)" }}
        >
          Contact
        </h2>
        <p className="sr-only">Hubungi kami</p>
      </div>

      <div className="mt-4 bg-primary text-primary-foreground rounded-t-3xl">
        <div className="container mx-auto px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-sans text-2xl font-semibold sm:text-3xl">Hubungi Kami</h3>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/70 sm:text-[15px]">
                Tim kami siap membantu menemukan properti yang tepat untuk Anda.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>Nama</label>
                  <input id="contact-name" name="name" type="text" required className={inputClass} placeholder="Nama lengkap" />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>Email</label>
                  <input id="contact-email" name="email" type="email" required className={inputClass} placeholder="nama@email.com" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass}>No. Telepon</label>
                  <input id="contact-phone" name="phone" type="tel" className={inputClass} placeholder="+62 ..." />
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelClass}>Pesan</label>
                  <textarea id="contact-message" name="message" required rows={4} className={inputClass} placeholder="Ceritakan kebutuhan properti Anda..." />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-press inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-sans text-[13px] font-semibold tracking-wide text-primary transition-colors hover:bg-gold hover:text-primary disabled:opacity-60"
                >
                  <Send size={14} />
                  Kirim Pesan
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-sans text-lg font-semibold sm:text-xl">Informasi Kontak</h3>
              <ul className="mt-5 space-y-4 text-sm text-primary-foreground/85">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>{BRAND.contact.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-gold" />
                  <a href={`mailto:${BRAND.contact.email}`} className="hover:text-gold">{BRAND.contact.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-gold" />
                  <a href={`tel:${BRAND.contact.phone.replace(/\s/g, "")}`} className="hover:text-gold">{BRAND.contact.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0 text-gold" />
                  <span>{BRAND.contact.hours}</span>
                </li>
              </ul>

              <div className="mt-7 flex gap-3">
                {[
                  { icon: AtSign, label: "Instagram", href: BRAND.social.instagram },
                  { icon: MessageCircle, label: "WhatsApp", href: BRAND.social.whatsapp },
                  { icon: AtSign, label: "Facebook", href: BRAND.social.facebook },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              <a
                href="/peta"
                className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-foreground/85 hover:text-gold"
              >
                Lihat di Peta →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
