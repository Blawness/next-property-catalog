import {
  MessageCircle,
  Search,
  FileText,
  Handshake,
  type LucideIcon,
} from "lucide-react"
import Reveal from "@/components/Reveal"

const STEPS: Array<{
  icon: LucideIcon
  title: string
  description: string
  circleClass: string
  iconClass: string
}> = [
  {
    icon: MessageCircle,
    title: "Free Consultation",
    description:
      "consultation needs analysist. we determine what type of property you need",
    circleClass: "bg-[#111] text-white",
    iconClass: "text-white",
  },
  {
    icon: Search,
    title: "Search & Selection",
    description:
      "we offer only verified properties that match your budget and goals",
    circleClass: "bg-primary text-primary-foreground",
    iconClass: "text-primary-foreground",
  },
  {
    icon: FileText,
    title: "Data Verification",
    description: "we conduct a review all documents and ownership",
    circleClass: "bg-gold text-[#111]",
    iconClass: "text-[#111]",
  },
  {
    icon: Handshake,
    title: "Finishing",
    description:
      "we provide support include contract and accompany you at all stages",
    circleClass: "bg-[#111] text-white",
    iconClass: "text-white",
  },
]

export default function HowWeWork() {
  return (
    <section
      id="how"
      className="min-h-[768px] px-[clamp(1.5rem,5vw,4.5rem)] pt-[clamp(6rem,13vw,12rem)] pb-0"
    >
      <Reveal>
        <h2 className="m-0 text-center font-sans text-[clamp(2.5rem,5vw,3.9rem)] leading-none font-bold tracking-[-0.02em] text-foreground">
          How We Work
        </h2>
      </Reveal>

      <div className="mt-[clamp(2rem,4vw,3.3rem)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <Reveal
              key={step.title}
              delay={i * 120}
              className="relative h-[clamp(280px,24vw,385px)] box-border border border-primary bg-transparent rounded-3xl pt-[clamp(2.5rem,5vw,4.5rem)] px-7 flex flex-col items-center text-center"
            >
              <span
                aria-hidden
                className="absolute left-6 top-5 font-sans text-[12px] font-bold tracking-[0.18em] text-primary/55"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className={`w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-full ${step.circleClass} flex items-center justify-center transition-transform duration-300 hover:scale-110`}
              >
                <Icon size={28} strokeWidth={2.1} className={step.iconClass} />
              </div>
              <h3 className="mt-[clamp(1.5rem,2.5vw,2.5rem)] font-sans text-[clamp(1.25rem,1.7vw,1.625rem)] font-bold tracking-[-0.01em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-[15px] font-sans text-[clamp(0.95rem,1.2vw,1.19rem)] leading-[27px] text-pretty text-foreground">
                {step.description}
              </p>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
