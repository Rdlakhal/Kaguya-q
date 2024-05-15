import axios from "axios";
import fs from "fs-extra";
import path from "path";

export default {
  name: "بوت",
  author: "ChatGPT",
  description: "نموذج للدردشة مع GPT-4 وإرفاق صورة ذات صلة",
  role: "member",
  execute: async ({ api, event, args }) => {

api.setMessageReaction("🔍", event.messageID, (err) => {}, true);
    
    try {
      let ask = args.join(" ");
      if (!ask && event.messageReply) {
        ask = event.messageReply.body;
      }
      if (!ask) {
        api.sendMessage("🤖 | قم بإدخال السؤال الذي تريدني الإجابة عنه.", event.threadID, event.messageID);
        return;
      }

      // جلب الإجابة من GPT-4
      const gptResponse = await axios.get(`https://markdevsapi-2014427ac33a.herokuapp.com/gpt4?ask=${encodeURIComponent(ask)}`);
      const answer = gptResponse.data.answer;

      // ترجمة الإجابة إلى الإنجليزية
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(answer)}`);
      const translatedText = translationResponse.data[0][0][0];

      // جلب الصورة من Pinterest
      const imageUrl = await getImage(translatedText, 1); // فرض أننا نريد صورة واحدة فقط

      // إنشاء ملف مؤقت للصورة
      const imageBuffer = await axios.get(imageUrl, {responseType: 'arraybuffer'});
      const imagePath = path.join(process.cwd(), 'cache', 'image.jpg');
      await fs.writeFile(imagePath, imageBuffer.data);

api.setMessageReaction("📝", event.messageID, () => {}, true);
      
    // إرسال الإجابة والصورة
      api.sendMessage({
        body: answer,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID);

    } catch (error) {
      console.error(error);
      api.sendMessage("حدث خطأ أثناء محاولة إجراء البحث.", event.threadID, event.messageID);
    }
  }
};

async function getImage(keywords, numberSearch) {
  const apiUrl = `https://turtle-apis.onrender.com/api/pinterest?search=${encodeURIComponent(keywords)}&keysearch=${numberSearch}`;
  const response = await axios.get(apiUrl);
  return response.data.images[0]; // نفترض هنا أن API يعيد قائمة من الصور، ونحن نأخذ الأولى
}
