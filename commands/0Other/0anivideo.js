import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "مقطع_أنمي2",
  author: "kaguya project",
  role: "member",
  description: "توليد مقاطع فيديو أنمي عشوائية.",
  async execute({ api, event, message }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
      const response = await axios.get("https://ani-vid.onrender.com/kshitiz");
      const postData = response.data.posts;
      const randomIndex = Math.floor(Math.random() * postData.length);
      const randomPost = postData[randomIndex];

      const videoUrls = randomPost.map(url => url.replace(/\\/g, "/"));

      const selectedUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

      const videoResponse = await axios.get(selectedUrl, { responseType: "stream" });

      const tempVideoPath = path.join(process.cwd(), "cache", `${Date.now()}.mp4`);
      const writer = fs.createWriteStream(tempVideoPath);
      videoResponse.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);
        const user = response.data.user || "@user_unknown";
        await api.sendMessage({
          body: ` 💫 | تفضل مقطع الأنمي | 💫 `,
          attachment: stream,
        }, event.threadID);
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        fs.unlink(tempVideoPath, (err) => {
          if (err) console.error(err);
          console.log(`Deleted ${tempVideoPath}`);
        });
      });
    } catch (error) {
      console.error(error);
      api.sendMessage(" ❌ |عذرا، حدث خطأ أثناء معالجة طلبك.", event.threadID);
    }
  }
};