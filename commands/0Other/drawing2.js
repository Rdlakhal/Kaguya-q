import axios from 'axios';
import fs from 'fs-extra';
import moment from 'moment-timezone';

async function emiChat({ api, event, args }) {
    api.setMessageReaction("⏱️", event.messageID, () => {}, true);

    async function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return sendMessage(' ⚠️ | قم بإدخال وصف!');

    try {
        // ترجمة الوصف إلى الإنجليزية قبل جلب الصور
        const descriptionEnglish = await translateToEnglish(args.join(" "));

        const startTime = moment();

        const responses = await axios.all([
            axios.get(`https://apis-samir.onrender.com/imagine?prompt=${encodeURIComponent(descriptionEnglish)}`, { responseType: 'arraybuffer' }),
            axios.get(`https://apis-samir.onrender.com/imagine?prompt=${encodeURIComponent(descriptionEnglish)}`, { responseType: 'arraybuffer' }),
            axios.get(`https://apis-samir.onrender.com/imagine?prompt=${encodeURIComponent(descriptionEnglish)}`, { responseType: 'arraybuffer' }),
            axios.get(`https://apis-samir.onrender.com/imagine?prompt=${encodeURIComponent(descriptionEnglish)}`, { responseType: 'arraybuffer' })
        ]);

        const endTime = moment();
        const executionTime = endTime.diff(startTime, 'seconds');
        const timeString = moment.tz("Africa/Casablanca").format("HH:mm:ss");
        const dateString = moment.tz("Africa/Casablanca").format("YYYY-MM-DD");

        const paths = [];
        for (let i = 0; i < responses.length; i++) {
            const filePath = `./cache/emi_${i}.png`;
            await fs.ensureDir('./cache'); // تأكد من وجود الدليل
            await fs.writeFile(filePath, responses[i].data); // كتابة البيانات المستلمة إلى الملف
            paths.push(filePath);
        }

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        sendMessage({
            attachment: paths.map(path => fs.createReadStream(path)),
            body: `✿━━━━━━━━━━━━━━━━━✿\n ✅ | تم التنفيذ \n ⏰ | ❏ الوقت : ${timeString}\n 📅 | ❏ التاريخ : ${dateString}\n ⏳ | ❏ وقت التنفيذ: ${executionTime} ثانية\n✿━━━━━━━━━━━━━━━━━✿`
        });
    } catch (error) {
        sendMessage("❌ | عذرًا، حدث خطأ أثناء معالجة طلبك.");
        console.error("Error:", error.message);
    }
}

async function translateToEnglish(text) {
    try {
        const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`);
        return translationResponse?.data?.[0]?.[0]?.[0] || text; // التأكد من أنه يتم إرجاع النص الأصلي في حالة عدم القدرة على الترجمة
    } catch (error) {
        console.error("Error translating text:", error.message);
        return text;
    }
}

export default {
    name: "أرسمي",
    author: "kaguya project",
    role: "member",
    description: "يقوم بإنشاء صورة إيمي معينة بناءً على الوصف المُدخل.",
    execute: emiChat
};