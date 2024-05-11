import axios from 'axios';

let isEnabled = true; // تم تعريف متغير لتمكين أو تعطيل SimSimi

export default {
  name: "سيم",
  author: "Kaguya Project",
  role: "member",
  description: "التفاعل مع SimSimi للحصول على ردود آلية.",
  async execute({ api, event, args }) {
    try {
      if (args[0] === "إيقاف") {
        isEnabled = false;
        return api.sendMessage(" ❌ | سيم تم إيقافه", event.threadID, event.messageID);
      } else if (args[0] === "تشغيل") {
        isEnabled = true;
        return api.sendMessage(" ✅ | سيم تم تشغيله.", event.threadID, event.messageID);
      } else {
        const ask = args.join(" ");
        const response = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ar&message=${encodeURIComponent(ask)}`);
        const result = response.data.respond;
        api.sendMessage(result, event.threadID, event.messageID);
      }
    } catch(error) {
      api.sendMessage(`خطأ: ${error}`, event.threadID);
      console.log(error);
    }
  }
};

export const handleEvent = async function ({ api, event }) {
  try {
    if (!isEnabled) return; 

    const message = event.body.toLowerCase();
    const response = await axios.get(`https://eurix-api.replit.app/sim?ask=${encodeURIComponent(message)}`);
    const result = response.data.respond;
    api.sendMessage(result, event.threadID, event.messageID);
  } catch(error) {
    api.sendMessage(`خطأ: ${error}`, event.threadID);
    console.log(error);
  }
};
