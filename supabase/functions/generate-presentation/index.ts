import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, template, slideCount, language, model, sourceText } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiModel = model || "google/gemini-3-flash-preview";
    const numSlides = slideCount || 10;
    const lang = language || "pt-BR";

    const systemPrompt = `You are the creative director of an elite design agency (Pentagram / IDEO / Apple-level). You create WORLD-CLASS presentations that win awards and close deals. Your presentations are used by Fortune 500 CEOs, TED speakers, and top consultants.

Generate a presentation with exactly ${numSlides} slides in JSON format.
Language: ${lang}
Template style: ${template?.style || "modern"}

Return ONLY valid JSON with this structure:
{
  "title": "Compelling, memorable title",
  "subtitle": "Sharp subtitle that hooks the audience",
  "slides": [
    {
      "title": "Slide title",
      "content": ["Bullet 1", "Bullet 2"],
      "notes": "Speaker notes (2-3 sentences)",
      "layout": "ONE OF THE LAYOUT TYPES BELOW",
      
      // Include the relevant data field for each layout type:
      "stats": [{"value": "95%", "label": "Growth Rate", "icon": "📈"}],
      "highlight": "One powerful sentence that changes perspective",
      "steps": [{"step": "Phase name", "description": "What happens and why it matters"}],
      "comparison": {"left": {"title": "Option A", "points": ["point"]}, "right": {"title": "Option B", "points": ["point"]}},
      "bigNumber": {"number": "3.2B", "suffix": "active users worldwide", "context": "Growing 47% year-over-year since 2023"},
      "gridItems": [{"icon": "🎯", "title": "Feature Name", "description": "One-line explanation"}],
      "columns": [{"title": "Column Title", "points": ["Point 1", "Point 2"]}],
      "milestones": [{"phase": "Q1 2024", "title": "Launch", "description": "Initial market entry"}],
      "members": [{"name": "Jane Doe", "role": "CEO", "description": "15+ years in fintech"}],
      "swot": {"strengths": ["s1"], "weaknesses": ["w1"], "opportunities": ["o1"], "threats": ["t1"]},
      "pyramidLevels": [{"label": "Vision", "description": "The north star"}]
    }
  ]
}

AVAILABLE LAYOUT TYPES (you have 16 to choose from — USE DIVERSITY):

1. "title" — FIRST slide ONLY. Bold, cinematic title + subtitle. Set the tone.
2. "closing" — LAST slide ONLY. Memorable CTA or thank you with contact info.
3. "bigNumber" — ONE massive, jaw-dropping statistic. MUST include "bigNumber" field. Use early for shock value.
4. "stats" — Dashboard: 3-4 metric cards. MUST include "stats" array. Each: {value, label, icon}.
5. "highlight" — Key insight in accent box + 2-3 supporting bullets. MUST include "highlight" string.
6. "process" — Step-by-step flow (3-5 steps). MUST include "steps" array. Numbered visual sequence.
7. "comparison" — Side-by-side. MUST include "comparison" with left/right {title, points[]}.
8. "quote" — Powerful quote. title = quote text, content[0] = attribution. Use a REAL person.
9. "two-column" — Split layout with 4-6 bullet points divided into 2 columns.
10. "content" — Standard bullets with 3-5 concise, data-backed points.
11. "iconGrid" — Feature showcase: 4-6 items in a grid. MUST include "gridItems" array: [{icon, title, description}]. Icons MUST be single emoji characters.
12. "threeColumn" — Three distinct categories/pillars. MUST include "columns" array with exactly 3 items: [{title, points[]}].
13. "roadmap" — Timeline/phases (3-5 milestones). MUST include "milestones" array: [{phase, title, description}].
14. "team" — Team/stakeholder spotlight (3-4 people). MUST include "members" array: [{name, role, description}].
15. "swot" — Strategic analysis. MUST include "swot" with {strengths[], weaknesses[], opportunities[], threats[]}.
16. "pyramid" — Hierarchical concept (3-5 levels). MUST include "pyramidLevels" array: [{label, description}]. Bottom = broadest.

MANDATORY STRUCTURE (non-negotiable):
- Slide 1: MUST be "title"
- Slide 2: MUST be "bigNumber" — set the tone with a SHOCKING number
- Last slide: MUST be "closing"
- MINIMUM required layouts (even for 10 slides): title, bigNumber, stats, process, iconGrid, highlight, closing
- Additional layouts for 12+ slides: add comparison, roadmap, threeColumn, quote
- Additional layouts for 15+ slides: add swot, team, pyramid
- NO TWO consecutive slides can use the same layout
- NEVER repeat a layout more than twice (except "content")

CONTENT QUALITY — THIS IS WHAT SEPARATES AMATEUR FROM PROFESSIONAL:
- Stats: Use SPECIFIC, REAL-FEELING numbers ("$4.2M ARR", "+347%", "99.7% uptime", "2.3x ROI")
- BigNumber: The number MUST make jaws drop. Add context that amplifies the impact.
- Process: Each step should feel actionable and sequential. Use verbs.
- Comparison: Present REAL trade-offs, not strawman arguments
- Quotes: Use REAL quotes from recognized leaders (Elon Musk, Steve Jobs, Peter Drucker, etc.)
- Bullet points: MAX 8 words each. Be specific and data-rich. No fluff.
- Icon grid: Each item title MAX 3 words. Description MAX 10 words. Icons must be relevant emojis.
- Speaker notes: 2-3 sentences adding context NOT visible on the slide
- Roadmap milestones: Use realistic timeframes and concrete deliverables
- SWOT: Be honest and strategic — weak SWOTs destroy credibility
- Team descriptions: Title + one impressive credential
- Pyramid: Build from concrete (bottom) to abstract (top)
- NEVER use placeholder text. Every word must add value.
- NEVER use generic phrases like "Lorem ipsum", "Example", "Sample"
- Make it feel like a $50,000 consulting deck`;

    const userMessage = sourceText
      ? `Create an award-winning presentation based on this content. Extract key data points, identify the narrative arc, and design slides that tell a compelling story:\n\n${sourceText.slice(0, 30000)}`
      : `Create an award-winning, data-rich presentation about: ${topic}\n\nResearch this topic deeply. Use specific data, real statistics, and actionable insights. The audience should walk away feeling informed and inspired.`;

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
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos necessários. Adicione fundos ao workspace." }), {
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
    jsonStr = jsonStr.trim();

    let presentation;
    try {
      presentation = JSON.parse(jsonStr);
    } catch (_parseErr) {
      console.warn("Initial parse failed, attempting to repair JSON...");
      let repaired = jsonStr.replace(/,\s*$/, "");
      const openBraces = (repaired.match(/{/g) || []).length;
      const closeBraces = (repaired.match(/}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;
      for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += "]";
      for (let i = 0; i < openBraces - closeBraces; i++) repaired += "}";
      try {
        presentation = JSON.parse(repaired);
      } catch (finalErr) {
        console.error("JSON repair failed. Raw content (first 2000 chars):", raw.slice(0, 2000));
        throw new Error("A IA retornou uma resposta incompleta. Tente novamente.");
      }
    }

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
