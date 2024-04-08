import axios from "axios";
import fs from "fs-extra";

export default {
  name: "تخيلي2",
  author: "حسين يعقوبي",
  cooldowns: 60,
  description: "توليد صورة استنادًا إلى النص المدخل",
  role: "member",
  aliases: ["رسمة", "2تخيلي"],
  async execute({ api, args, event }) {
    const query = args.join(" ");

    try {
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(query)}`);
      const translatedQuery = translationResponse?.data?.[0]?.[0]?.[0];

      if (!translatedQuery) {
        throw new Error("فشل الترجمة أو الناتج كان فارغًا.");
      }

      const { threadID, messageID } = event;
      let path = `./cache/generated_image.png`;

      const poli = (await axios.get(`https://image.pollinations.ai/prompt/${translatedQuery}`, {
        responseType: "arraybuffer",
      })).data;

      fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
      api.sendMessage{ 
      api.setMessageReaction("✅"), event.messageID, (err) => {}, true );

      api.sendMessage({
        body: "✅ | تم توليد الصورة بنجاح\n⚠️ | ستحذف الصورة بعد ساعة",
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ | حدث خطأ. يرجى إدخال وصف.", event.threadID);
    }
  },
};