import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  mode: z.enum(["activity", "weekly", "skills"]),
  text: z.string().trim().min(3).max(4000),
  context: z.string().trim().max(1000).optional(),
});

const PROMPTS: Record<string, string> = {
  activity:
    "Rewrite the intern's rough note into one professional, specific internship logbook entry of 2-4 sentences. Use past tense, active voice, concrete technical detail. Do not invent employers or metrics. Return only the rewritten paragraph.",
  weekly:
    "Summarise the intern's week from the notes below into a professional weekly internship summary of 3-5 sentences covering work done, skills applied and outcomes. Return only the summary.",
  skills:
    "From the intern's note, list 3-6 concrete professional or technical skills demonstrated. Return only a comma-separated list, no numbering.",
};

export const improveText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { text: "", error: "AI assistant is not configured." };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [
            { role: "system", content: PROMPTS[data.mode] },
            {
              role: "user",
              content: data.context ? `Context: ${data.context}\n\nNote: ${data.text}` : data.text,
            },
          ],
        }),
      });

      if (res.status === 429) return { text: "", error: "Rate limit reached. Try again shortly." };
      if (res.status === 402) return { text: "", error: "AI credits exhausted." };
      if (!res.ok) return { text: "", error: "The AI assistant is unavailable right now." };

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return {
        text: json.choices?.[0]?.message?.content?.trim() ?? "",
        error: null as string | null,
      };
    } catch {
      return { text: "", error: "The AI assistant is unavailable right now." };
    }
  });
