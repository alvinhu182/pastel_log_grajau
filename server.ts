import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const COMMENTS_FILE = path.join(process.cwd(), "comments.json");

// Helper to get comments with local file persistence
async function loadComments(): Promise<any[]> {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      const data = await fs.promises.readFile(COMMENTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading comments file:", error);
  }
  return [];
}

// Helper to save comments
async function saveComments(comments: any[]): Promise<boolean> {
  try {
    await fs.promises.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing comments file:", error);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads
  app.use(express.json());

  // API Routes
  app.get("/api/comments", async (req, res) => {
    const comments = await loadComments();
    res.json(comments);
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const { author, message } = req.body;
      
      const trimmedAuthor = (author || "").trim().replace(/\s+/g, "_").toLowerCase();
      const trimmedMessage = (message || "").trim();

      if (!trimmedAuthor) {
        return res.status(400).json({ error: "Author name/handle is required." });
      }
      if (!trimmedMessage) {
        return res.status(400).json({ error: "Comment message cannot be empty." });
      }

      const randomHash = Math.random().toString(16).substring(2, 9);
      const currentTimeStr = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newComment = {
        id: `comment-${Date.now()}`,
        author: trimmedAuthor,
        message: trimmedMessage,
        timestamp: `Hoje às ${currentTimeStr}`,
        likes: Math.floor(Math.random() * 5) + 1, // Generate a friendly few upfront likes
        hash: randomHash
      };

      const comments = await loadComments();
      comments.unshift(newComment); // Insert at the top (newest first)
      await saveComments(comments);

      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error in POST /api/comments:", error);
      res.status(500).json({ error: "Failed to persist comment on the deployment server." });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "Pastel.log(grajaú)" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for all spa routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Pastel.log server running on port ${PORT}`);
  });
}

startServer();
