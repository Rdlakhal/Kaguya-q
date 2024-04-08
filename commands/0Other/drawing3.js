import axios from "axios";
import fs from "fs-extra";

async function imagine({ api, event, args }) {
    async function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);

    const promptAndStyleList = `\t\t•——[النماذج المتاحة]——•\n\n1. سينيمائية\n2. فوتوغرافيه\n3. أنمي\n4. مانغا\n5. الفن الإفتراضي\n6. بيكسل فن\n7. الفن الفنتازي\n8. نيون بانك\n9. ثلاثي الأبعاد`;

    if (!args[0]) return sendMessage(promptAndStyleList);

    const [prompt, style] = args.join(" ").split("|").map(item => item.trim());

    if (!prompt) return sendMessage(' ⚠️ | قم بإخال وصف');
    if (!style) return sendMessage(` ⚠️ | نموذج غير صالح \n\n${promptAndStyleList}`);

    try {
        const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(prompt)}`);
        const translatedQuery = translationResponse?.data?.[0]?.[0]?.[0];

        const response = await axios.get(`https://deku-rest-api.onrender.com/sdxl?prompt=${encodeURIComponent(translatedQuery)}&styles=${style}`, { responseType: 'arraybuffer' });
        const data = Buffer.from(response.data, "utf8");
        const filePath = process.cwd() + '/cache/sdxl.png';
        fs.writeFileSync(filePath, data);

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        return sendMessage({ attachment: fs.createReadStream(filePath, () => fs.unlinkSync(filePath)) });
    } catch (error) {
        return sendMessage(error.message);
    }
}

export default {
    name: "أرسمي2",
    author: "حسين يعقوبي",
    cooldowns: 60,
    description: "توليد صورة استنادًا إلى النص المدخل",
    role: "member",
    aliases: ["رسمة", "توليد"],
    execute: imagine
};