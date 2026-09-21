import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "BizHubKE", time: new Date().toISOString() });
  });

  // AI Assistant endpoint ("Ask BizHub AI")
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getGeminiClient();

      if (!client) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        return res.json({
          reply: `[Demo Mode / Offline Response]\nRegarding "${message}": For Kenyan businesses, managing working capital is key. Ensure your cash cycle is shorter than your supplier credit terms (aim for 14-30 days). Keep strict records on eTIMS for VAT compliance, and leverage WhatsApp CRM to follow up on outstanding receivables. Configure your Gemini API key in Settings > Secrets to unlock live, customized AI reasoning.`,
          model: "fallback",
        });
      }

      const systemPrompt = `You are "Ask BizHub AI", the expert digital business partner and strategic advisor dedicated to Kenyan SMEs, micro-enterprises, and fast-growing businesses.
You understand:
1. Kenyan business realities: M-Pesa business tills/Paybills, KRA tax compliance (eTIMS, VAT 16%, PAYE, Housing Levy, County Single Business Permits), supply chain bottlenecks along Mombasa Road or Industrial Area, informal trade, dukas, boutiques, restaurants, hardware shops, and tech startups.
2. Kenyan financial terms: KSh (Kenyan Shillings), chamas, SACCOs, working capital, inventory turn rates.
3. Tone: Direct, encouraging, culturally fluent, realistic, actionable, and professional.
${context ? `Current Business Context: ${JSON.stringify(context)}` : ""}

Important Rule: Always include a brief disclaimer if giving specific tax or legal calculations: "BizHubKE provides business intelligence workflow tools and does not replace certified tax (KRA) or legal counsel."`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `${systemPrompt}\n\nUser Business Owner Query: ${message}`,
      });

      return res.json({
        reply: response.text || "I was unable to generate a response at this moment. Please try again.",
        model: "gemini-3.8-flash",
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: "Failed to process request with AI provider",
        details: error?.message || "Unknown error",
      });
    }
  });

  // AI Marketing Generator endpoint
  app.post("/api/ai/marketing", async (req, res) => {
    try {
      const { channel, topic, tone, businessName, offer } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          content: `🌟 *SPECIAL OFFER from ${businessName || "BizHubKE"}!* 🇰🇪\n\n${topic || "Big discount on all top products!"} Enjoy ${offer || "exclusive deals"} today.\n\n📱 Order via WhatsApp or M-Pesa: Click to chat or call us today!\n\n_Limited time offer. T&Cs apply._`,
          model: "fallback",
        });
      }

      const prompt = `Write a high-converting marketing message tailored for Kenyan customers.
Channel: ${channel} (e.g., WhatsApp Broadcast, SMS, Instagram/Facebook, TikTok caption)
Business Name: ${businessName || "Kenyan Business"}
Topic/Product: ${topic || "New Arrivals and Specials"}
Special Offer / Call to Action: ${offer || "Order today via M-Pesa / WhatsApp"}
Tone: ${tone || "Engaging, trustworthy, and friendly"}

Use popular Kenyan business phrasing where natural (e.g., "Karibu", "Lipa na M-Pesa", "Free delivery within Nairobi CBD", "Call or WhatsApp"). Include emojis formatted cleanly.`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        content: response.text || "Could not generate content.",
        model: "gemini-3.8-flash",
      });
    } catch (error: any) {
      console.error("Marketing generation error:", error);
      return res.status(500).json({
        error: "Failed to generate marketing content",
        details: error?.message || "Unknown error",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BizHubKE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
