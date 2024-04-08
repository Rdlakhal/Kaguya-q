import axios from 'axios';

export default {
  name: "علمني",
  author: "Kaguya Project",
  role: "member",
  description: "تعلم البوت ردودًا تلقائية عن طريق تحديد سؤال وجواب.",
  async execute({ api, event, args }) {
    try {
      const text = args.join(" ");
      const [text1, text2] = text.split(" =» ");

      if (!text1 || !text2) {
        return api.sendMessage(`الاستخدام: ${global.config.PREFIX}تعلم مرحبًا => مرحبًا بك`, event.threadID, event.messageID);
      }

      const response = await axios.get(`https://eurix-api.replit.app/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
      api.sendMessage(` ✅ | تم تعليم سيم بنجاح \n سؤالك : ${text1}\nرد سيم : ${text2}`, event.threadID, event.messageID);
    } catch (error) {
      console.error("حدث خطأ:", error);
      api.sendMessage("عذرًا! حدث خطأ ما.", event.threadID, event.messageID);
    }
  }
};