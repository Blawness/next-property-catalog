import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Phone, Calendar } from "lucide-react"

interface Agent {
  fullName: string
  phone: string | null
}

interface AgentCardProps {
  agent: Agent | null
  createdAt: Date | null
}

export default function AgentCard({ agent, createdAt }: AgentCardProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-20 rounded-3xl bg-secondary/60 p-6 space-y-4 border border-border/40">
        <h3 className="font-sans text-lg font-semibold text-foreground">Hubungi Agen</h3>
        {agent ? (
          <>
            <div>
              <p className="font-sans text-base font-semibold text-foreground">{agent.fullName}</p>
              {agent.phone && (
                <p className="text-sm text-muted-foreground">{agent.phone}</p>
              )}
            </div>
            {agent.phone && (
              <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Info agen tidak tersedia</p>
        )}
        <Separator />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Diposting{" "}
            {createdAt
              ? new Date(createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>
      </div>
    </div>
  )
}
