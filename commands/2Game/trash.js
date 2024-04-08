import fs from 'fs-extra';
import request from 'request';
import path from 'path';

export default {
  name: "إصفعي",
  author: "kahuya project",
  role: "member",
  description: "صفع شخص معين.",
  execute: async ({ api, event }) => {
    try {
      const links = ["https://i.postimg.cc/1tByLBHM/anime-slap.gif"];
      const mention = Object.keys(event.mentions)[0];
      const tag = mention ? event.mentions[mention].replace("@", "") : null;

      if (!mention) {
        return api.sendMessage("⚠️ | إعمل منشن و حتشوف.", event.threadID);
      }

      const link = links[Math.floor(Math.random() * links.length)];
      const imagePath = path.join(process.cwd(), "cache", "slap.gif");

      const callback = () => {
        api.sendMessage({
          body: ` ✅ | تم صفع  ${tag} من طرف كاغويا بنجاح\n*عذرًا، ظننت أن هناك بعوضة على وجهك القبيح 🙂`,
          mentions: [{ tag, id: mention }],
          attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => fs.unlinkSync(imagePath));
      };

      request(encodeURI(link)).pipe(fs.createWriteStream(imagePath)).on("close", callback);
    } catch (error) {
      console.error(error);
      api.sendMessage("حدث خطأ أثناء عملية الصفع.", event.threadID);
    }
  }
};