import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

async function reminiChat({ api, event }) {
    const { threadID, messageID } = event;
    const photoUrl = event.messageReply?.attachments[0]?.url;

    if (!photoUrl) {
        api.sendMessage("📸 | يرجى الرد على صورة من أجل المتابعة في تحسين الصور.", threadID, messageID);
        return;
    }

    api.sendMessage("🕟 | جاري رفع الحودة ، يرجى الانتظار لحظة..", threadID, async () => {
        try {
            const response = await axios.get(`https://haze-code-merge-0f8f4bbdea12.herokuapp.com/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
            const processedImageURL = response.data.image_data;
            const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

            const cachePath = path.join(process.cwd(), 'cache');
            await fs.ensureDir(cachePath); // تأكد من وجود المجلد
            const imagePath = path.join(cachePath, 'enhanced_image.jpg');

            await fs.writeFile(imagePath, Buffer.from(img, 'binary'));

            api.sendMessage({
                body: "✅ |تم رفع جودة الصورة بنجاح",
                attachment: fs.createReadStream(imagePath)
            }, threadID, () => fs.unlinkSync(imagePath), messageID);
        } catch (error) {
            api.sendMessage(`🚫 خطأ في معالجة الصورة: ${error}`, threadID, messageID);
        }
    });
};

export default {
    name: "رفع",
    author: "kaguya project",
    role: "member",
    description: "يقوم بتحسين الصور باستخدام API Remini.",
    execute: reminiChat
};