import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "زوجة",
  author: "kaguya project",
  role: "member",
  description: "توليد مقاطع فيديو Wifey عشوائية.",
  async execute({ api, event }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
      const response = await axios.get(`https://wifey-csz1.onrender.com/kshitiz`, { responseType: "stream" });

      const tempVideoPath = path.join(process.cwd(), "cache", `${Date.now()}.mp4`);

      const writer = fs.createWriteStream(tempVideoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);

        api.sendMessage({
          body : "تفضل إليك مقاطع عشواىية 🌟",
          attachment: stream,
        }, event.threadID);

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(" ❌ |عذرا، حدث خطأ أثناء معالجة طلبك.", event.threadID);
    }
  }
};