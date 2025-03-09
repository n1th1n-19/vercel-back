import youtubedl from "youtube-dl-exec";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET method allowed" });
  }

  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: "No video URL provided" });
  }

  try {
    const outputPath = path.join("/tmp", "video.mp4"); // Use Vercel's temporary storage

    await youtubedl(videoUrl, {
      output: outputPath,
      format: "mp4",
    });

    const videoStream = fs.createReadStream(outputPath);
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="downloaded-video.mp4"');
    videoStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to process video" });
  }
}
