import axios from "axios";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
const streamPipeline = promisify(pipeline);

export default {
  name: "تحميل",
  author: "ChatGPT",
  description: "تحميل المقاطع من خلال روابط مختلفة",
  role: "member",
  execute: async ({ api, args }) => {
    const link = args.join(" ");
    if (!link) {
      api.sendMessage(`⚠️ | قم بتقديم رابط.`);
      return;
    }

    let BASE_URL;

    try {
      if (link.includes("facebook.com")) {
        BASE_URL = `https://apis-samir.onrender.com/fbdl?vid_url=${encodeURIComponent(link)}`;
      } else if (link.includes("twitter.com")) {
        BASE_URL = `https://apis-samir.onrender.com/twitter?url=${encodeURIComponent(link)}`;
      } else if (link.includes("tiktok.com")) {
        BASE_URL = `https://apis-samir.onrender.com/tiktok?url=${encodeURIComponent(link)}`;
      } else if (link.includes("open.spotify.com")) {
        // Spotify content is handled differently because of the metadata
        await handleSpotifyContent(link, api);
        return;
      } else if (link.includes("youtu.be") || link.includes("youtube.com")) {
        BASE_URL = `https://apis-samir.onrender.com/ytdl?url=${encodeURIComponent(link)}`;
        downloadAndSend(BASE_URL, api);
        return;
      } else if (link.includes("instagram.com")) {
        BASE_URL = `https://apis-samir.onrender.com/igdl?url=${encodeURIComponent(link)}`;
      } else {
        api.sendMessage(`⚠️ | مصدر غير مدعوم.`);
        return;
      }

      api.sendMessage("🔄 | جارٍ معالجة طلبك... الرجاء الانتظار.");

      const res = await axios.get(BASE_URL);
      let contentUrl = getContentUrl(link, res.data);

      if (contentUrl) {
        downloadAndSend(contentUrl, api);
      } else {
        api.sendMessage(`⚠️ | عذرًا، لا يمكن تنزيل المحتوى.`);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`⚠️ | عذرا، حدث خطأ أثناء معالجة طلبك.`);
    }
  }
};

async function downloadAndSend(url, api) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    const filePath = path.join(process.cwd(), 'cache', 'download.mp4');
    await streamPipeline(response.data, fs.createWriteStream(filePath));
    api.sendMessage({ attachment: fs.createReadStream(filePath) });
  } catch (error) {
    console.error(error);
    api.sendMessage(`⚠️ | عذرًا، فشل في تنزيل الملف.`);
  }
}

// The rest of the functions remain the same as in the previous example.