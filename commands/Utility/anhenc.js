import { existsSync, mkdirSync, writeFileSync, createReadStream } from "fs";
import { join } from "path";
import axios from "axios";
import tinyurl from "tinyurl";

export default {
  name: "جودة",
  author: "Kaguya Project",
  description: "تحسين الصورة وإرسالها مرة أخرى.",
  role: "member",
  async execute({ api, event, message }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    const { type, messageReply } = event;
    const { attachments, threadID, messageID } = messageReply || {};

    if (type === "message_reply" && attachments) {
      const [attachment] = attachments;
      const { url, type: attachmentType } = attachment || {};

      api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);

      if (!attachment || !["photo", "sticker"].includes(attachmentType)) {
        return kaguya.reply("⚠️ | يجب عليك أن تقوم بالرد على صورة.");
      }

      try {
        const shortUrl = await tinyurl.shorten(url);
        const response = await axios.get(`https://ai-tools.replit.app/remini?url=${encodeURIComponent(shortUrl)}`, {
          responseType: "arraybuffer"
        });

        const cacheDirectory = join(process.cwd(), "cache");
        if (!existsSync(cacheDirectory)) {
          mkdirSync(cacheDirectory, { recursive: true });
        }

        const imagePath = join(cacheDirectory, "remi_image.png");
        writeFileSync(imagePath, Buffer.from(response.data));

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        kaguya.reply({ attachment: createReadStream(imagePath) });
      } catch (error) {
        console.error(error);
        message.reply("❌ | حدث خطأ أثناء تحسين الصورة.");
      }
    } else {
      api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);
      kaguya.reply("⚠️ | الرجاء الرد على الصورة.");
    }
  }
};