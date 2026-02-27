import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, template, slideCount, language } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a world-class presentation designer who creates visually rich, data-driven presentations. Generate a presentation in JSON format.
The presentation must have exactly ${slideCount || 10} slides.
Language: ${language || "pt-BR"}
Template style: ${template?.style || "modern"}

Return ONLY valid JSON with this exact structure:
{
  "title": "Main title",
  "subtitle": "Subtitle",
  "slides": [
    {
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2"],
      "notes": "Speaker notes for presenter",
      "layout": "title|content|two-column|quote|closing|stats|highlight",
      "icon": "optional emoji for the slide topic e.g. 🚀",
      "stats": [{"value": "95%", "label": "Growth rate", "icon": "📈"}],
      "highlight": "A key takeaway sentence highlighted visually"
    }
  ]
}

SLIDE LAYOUT RULES:
- "title": First slide. Eye-catching title + subtitle. Always include icon.
- "closing": Last slide. Call-to-action or thank you.
- "stats": Use for slides with numerical data. MUST include "stats" array with 2-4 items. Each stat has "value" (short number/percentage), "label" (description), "icon" (emoji). Also include 1-2 bullet points in "content".
- "highlight": Use for key insights. MUST include "highlight" field with a powerful one-liner. Include 2-3 supporting bullet points in "content".
- "quote": Impactful quote. Title is the quote text, first content item is attribution.
- "two-column": Use for comparisons or pros/cons. 4-6 bullet points split into 2 columns.
- "content": Standard bullets with icon. 3-5 concise bullet points.

CRITICAL DESIGN RULES:
- At least 2 slides MUST use "stats" layout with real/realistic data
- At least 1 slide MUST use "highlight" layout
- At least 1 slide MUST use "quote" layout  
- Every slide MUST have an "icon" emoji that represents its topic
- Bullet points must be concise (max 12 words)
- Stats values should be impactful numbers (percentages, multipliers, currency)
- Make content professional, specific, and data-driven — avoid generic statements
- Speaker notes should add context not visible on the slide`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a visually rich, data-driven presentation about: ${topic}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits required. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    let jsonStr = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    const presentation = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(presentation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-presentation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
