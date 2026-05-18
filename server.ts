import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini API Route
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, options, model } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server." 
      });
    }

    const genAI = new GoogleGenAI({ apiKey });

    const result = await genAI.models.generateContent({
      model: model || "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: options?.system,
        responseMimeType: options?.json ? "application/json" : "text/plain",
        tools: options?.research ? [{ googleSearch: {} }] : undefined,
      }
    });

    const text = result.text || "";
    
    // Attempt to extract grounding metadata if present (for Copilot features)
    const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
      uri: c.web?.uri,
      title: c.web?.title || "Resource"
    })) || [];

    res.json({ text, sources });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(error.status || 500).json({ 
      error: error.message || "Internal Server Error",
      details: error.response?.data || error
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
