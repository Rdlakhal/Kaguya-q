import axios from "axios";
import fs from "fs-extra";
import path from "path";

export default {
  name: "لقطة_شاشة",
  author: "حسين يعقوبي",
  role: "member",
  description: "إنشاء لقطة شاشة لصفحة الويب المقدمة.",
  async execute({ api, event, args }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    let url;

    if (event.type === "message_reply") {
      if (event.messageReply.body && event.messageReply.body.startsWith("http")) {
        url = event.messageReply.body;
      } else {
        return api.sendMessage(" ⚠️ |الرسالة التي تم الرد عليها لا تحتوي على رابط صالح.", event.threadID, event.messageID);
      }
    } else {
      if (args.length === 0) {
        return api.sendMessage("يرجى تقديم رابط.", event.threadID, event.messageID);
      }
      url = args[0];
    }

    try {
      const response = await axios.get(`https://screen-shot-pi.vercel.app/ss?url=${encodeURIComponent(url)}`, { responseType: "stream" });

      const imagePath = path.join(process.cwd(), `/cache/ss_${Date.now()}.png`);

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await api.sendMessage({
        body: "✅ |تم لقطة شاشة للموقع بنجاح :",
        attachment: fs.createReadStream(imagePath)
      }, event.threadID);

      fs.unlinkSync(imagePath);

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    } catch (error) {
      api.sendMessage(`خطأ: ${error.message}`, event.threadID);
    }
  }
};