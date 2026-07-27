import {
  MessageCircle,
  Search,
  FileText,
  Handshake,
  type LucideIcon,
} from "lucide-react"

const STEPS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: MessageCircle,
    title: "Free Consultation",
    description:
      "consultation needs analysist. we determine what type of property you need",
  },
  {
    icon: Search,
    title: "Search & Selection",
    description:
      "we offer only verified properties that match your budget and goals",
  },
  {
    icon: FileText,
    title: "Data Verification",
    description: "we conduct a review all documents and ownership",
  },
  {
    icon: Handshake,
    title: "Finishing",
    description:
      "we provide support include contract and accompany you at all stages",
  },
]

export default function HowWeWork() {
  return (
    <section
      id="how"
      className="min-h-[768px] px-[clamp(1.5rem,5vw,4.5rem)] pt-[clamp(6rem,13vw,12rem)] pb-0"
    >
      <h2 className="m-0 text-center font-sans text-[clamp(2.5rem,5vw,3.9rem)] leading-none font-bold tracking-[-0.02em] text-foreground">
        How We Work
      </h2>

      <div className="mt-[clamp(2rem,4vw,3.3rem)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="h-[clamp(280px,24vw,385px)] box-border border border-primary bg-transparent rounded-3xl pt-[clamp(2.5rem,5vw,4.5rem)] px-7 flex flex-col items-center text-center"
            >
              <div className="w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-full bg-[#111] text-white flex items-center justify-center">
                <Icon size={28} strokeWidth={2.1} />
              </div>
              <h3 className="mt-[clamp(1.5rem,2.5vw,2.5rem)] font-sans text-[clamp(1.25rem,1.7vw,1.625rem)] font-bold tracking-[-0.01em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-[15px] font-sans text-[clamp(0.95rem,1.2vw,1.19rem)] leading-[27px] text-pretty text-foreground">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
