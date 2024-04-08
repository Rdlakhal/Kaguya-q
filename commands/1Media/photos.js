import axios from "axios";
import path from "path";
import fs from "fs-extra";

export default {
  name: "صور",
  author: "kaguya project",
  description: "البحث عن صور على Pinterest باستخدام النص المترجم",
  role: "member",
  execute: async ({ api, event, args }) => {

api.setMessageReaction("🔍", event.messageID, (err) => {}, true)    
    
    try {
      // تحويل النص المعطى إلى اللغة الإنجليزية
      const translationResponse = await translateText(args.join(" "));
      const translatedText = translationResponse.data[0][0][0];

      // البحث عن الصور على Pinterest
      const images = await searchPinterestImages(translatedText);

      // إرسال الصور إلى المستخدم
      await sendImages(api, event, images);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ حدث خطأ أثناء البحث عن الصور.", event.threadID, event.messageID);
    }
  }
};

// ترجمة النص إلى اللغة الإنجليزية
async function translateText(text) {
  const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`);
  return translationResponse;
}

// البحث عن الصور على Pinterest
async function searchPinterestImages(keywords) {
  const numberSearch = 20; // عدد الصور المطلوبة
  const apiUrl = `https://turtle-apis.onrender.com/api/pinterest?search=${encodeURIComponent(keywords)}&keysearch=${numberSearch}`;
  const response = await axios.get(apiUrl);
  return response.data.images.slice(0, numberSearch); // استرجاع عدد محدود من الصور
}

// إرسال الصور إلى المستخدم
async function sendImages(api, event, images) {
  try {
    const imgData = [];
    for (let i = 0; i < images.length; i++) {
      const imgResponse = await axios.get(images[i], { responseType: "arraybuffer" });
      const imgPath = path.join(process.cwd(), `cache${i + 1}.jpg`);
      await fs.outputFile(imgPath, imgResponse.data);
      imgData.push(fs.createReadStream(imgPath));
    }

    api.setMessageReaction("📸", event.messageID, (err) => {}, true)

    await api.sendMessage({ attachment: imgData }, event.threadID, event.messageID);

    // حذف الصور المخزنة مؤقتًا
    await fs.remove(path.join(process.cwd(), "cache"));
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ حدث خطأ أثناء إرسال الصور.", event.threadID, event.messageID);
  }
}