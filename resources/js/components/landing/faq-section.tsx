import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const FAQS = [
  {
    id: "item-1",
    question: "Does InternTrack officially replace physical university paper logbooks?",
    answer:
      "Yes. InternTrack is engineered to meet and exceed higher education accreditation criteria (including CUE, TVETA, and ABET). The auto-generated Defense Dossier replicates the standardized university logbook booklet layout, complete with authenticated date stamps, supervisor comments, hour tallies, and dual digital sign-offs.",
  },
  {
    id: "item-2",
    question: "Do host company supervisors have to install special software or register accounts?",
    answer:
      "No. Host organization field mentors receive secure, one-click magic link digests sent directly to their work email or phone. They can review weekly intern activity, submit feedback, and digitally sign off in under 60 seconds from any desktop or mobile browser.",
  },
  {
    id: "item-3",
    question: "How does the geofenced clock-in prevent attendance fraud?",
    answer:
      "When a student clocks in, InternTrack cross-references their device's GPS coordinates against the verified polygon coordinates of the host company's premises (configured to a 50-meter perimeter). Mock GPS, VPN spoofing, and retroactive time alterations are automatically flagged for faculty audit.",
  },
  {
    id: "item-4",
    question:
      "Can students log their tasks if they are working in areas with poor internet connection?",
    answer:
      "Yes. The mobile web application caches draft logbook entries locally in encrypted client storage. As soon as network connectivity is restored, the queued entries are synchronized with the central server and cryptographically timestamped.",
  },
  {
    id: "item-5",
    question: "How does the platform support final academic defense clearance?",
    answer:
      "At the conclusion of the attachment period, students generate an accredited Defense Dossier with a single click. The document aggregates all daily logs, attendance percentages, mentor evaluation rubrics, and faculty assessor remarks into a standardized submission package ready for grading panels.",
  },
  {
    id: "item-6",
    question: "How can our university or faculty department run a pilot cohort?",
    answer:
      "You can launch a full pilot in under 48 hours. Our onboarding team provides pre-formatted student CSV imports, dual supervisor pairings, and customizes grading rubrics to match your department's specific syllabus.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-3.5 px-3 py-1 text-xs font-semibold tracking-wide border-primary/30 text-primary bg-primary/5 uppercase"
          >
            Clear Answers
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Everything universities, industry mentors, and students need to know.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-card">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border/60">
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
