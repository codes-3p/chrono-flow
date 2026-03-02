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

    const systemPrompt = `You are a world-class presentation designer at a top design agency (like McKinsey, Apple Keynote level). You create stunning, data-rich, visually diverse presentations that captivate audiences.

Generate a presentation with exactly ${slideCount || 10} slides in JSON format.
Language: ${language || "pt-BR"}
Template style: ${template?.style || "modern"}

Return ONLY valid JSON with this structure:
{
  "title": "Main title",
  "subtitle": "Compelling subtitle",
  "slides": [
    {
      "title": "Slide title",
      "content": ["Point 1", "Point 2"],
      "notes": "Speaker notes",
      "layout": "title|content|two-column|quote|closing|stats|highlight|process|comparison|bigNumber",
      "icon": "emoji",
      "stats": [{"value": "95%", "label": "Growth", "icon": "📈"}],
      "highlight": "Key insight sentence",
      "steps": [{"step": "Step name", "description": "What happens"}],
      "comparison": {"left": {"title": "Option A", "points": ["pro1"]}, "right": {"title": "Option B", "points": ["pro1"]}},
      "bigNumber": {"number": "3.2B", "suffix": "users", "context": "Explanation of significance"}
    }
  ]
}

LAYOUT TYPES (use ALL of them for variety):

1. "title" - FIRST slide only. Bold title + subtitle. Must have icon.
2. "closing" - LAST slide only. CTA or thank you. Must have icon.
3. "bigNumber" - ONE massive number that shocks. Must include "bigNumber" with {number, suffix, context}. Great for opening impact after title.
4. "stats" - Dashboard-style with 3-4 metric cards. Must include "stats" array. Each stat: {value, label, icon}.
5. "highlight" - Key insight with accent box. Must include "highlight" string + 2-3 supporting "content" bullets.
6. "process" - Step-by-step flow (3-5 steps). Must include "steps" array: [{step, description}]. Shows numbered sequence.
7. "comparison" - Side-by-side analysis. Must include "comparison" with {left: {title, points[]}, right: {title, points[]}}.
8. "quote" - Powerful quote. Title = quote text, content[0] = attribution.
9. "two-column" - 4-6 bullet points split into columns.
10. "content" - Standard bullets with 3-5 concise points.

MANDATORY DIVERSITY RULES:
- Slide 1: MUST be "title"
- Slide 2: MUST be "bigNumber" (set the tone with a shocking number)
- Must have at least 2 "stats" slides
- Must have at least 1 "process" slide  
- Must have at least 1 "comparison" slide
- Must have at least 1 "highlight" slide
- Must have at least 1 "quote" slide
- Last slide: MUST be "closing"
- NO two consecutive slides should have the same layout
- Every slide MUST have an "icon" emoji

CONTENT QUALITY RULES:
- Stats values: Use specific, impactful numbers ("+347%", "$4.2M", "10x", "99.7%")
- BigNumber: The number should be jaw-dropping and relevant
- Process steps: Clear, actionable, numbered progression
- Comparison: Fair, balanced analysis with real trade-offs
- Quotes: Attribute to real, well-known people when possible
- Bullet points: Max 10 words each, specific and data-backed
- Speaker notes: 2-3 sentences adding context not on the slide
- Make everything feel like a TED talk or McKinsey presentation`;

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
          { role: "user", content: `Create a stunning, data-rich presentation about: ${topic}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits required. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
