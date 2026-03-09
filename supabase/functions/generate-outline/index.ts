import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, slideCount, language, model, sourceText } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiModel = model || "google/gemini-3-flash-preview";
    const numSlides = slideCount || 10;
    const lang = language || "pt-BR";

    const systemPrompt = `You are a presentation strategist. Create an outline/structure for a presentation.
Language: ${lang}
Number of slides: ${numSlides}
NEVER use emojis.

Return ONLY valid JSON:
{
  "title": "Suggested presentation title",
  "subtitle": "Subtitle",
  "outline": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "layout": "title|content|bigNumber|stats|process|comparison|quote|highlight|two-column|closing",
      "keyPoints": ["Main point 1", "Main point 2"],
      "notes": "Brief description of what this slide covers"
    }
  ]
}

Rules:
- Slide 1: must be "title" layout
- Last slide: must be "closing" layout
- Use diverse layouts (bigNumber, stats, process, comparison, quote, highlight)
- NO two consecutive slides with the same layout
- keyPoints: 2-4 bullet points per slide describing what will be covered`;

    const userMessage = sourceText
      ? `Create an outline for a presentation based on:\n\n${sourceText.slice(0, 15000)}`
      : `Create an outline for a presentation about: ${topic}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    let jsonStr = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    jsonStr = jsonStr.trim();

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      let repaired = jsonStr.replace(/,\s*$/, "");
      const ob = (repaired.match(/{/g) || []).length;
      const cb = (repaired.match(/}/g) || []).length;
      const obr = (repaired.match(/\[/g) || []).length;
      const cbr = (repaired.match(/\]/g) || []).length;
      for (let i = 0; i < obr - cbr; i++) repaired += "]";
      for (let i = 0; i < ob - cb; i++) repaired += "}";
      result = JSON.parse(repaired);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-outline error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
