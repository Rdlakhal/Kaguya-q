import axios from 'axios';
import fs from 'fs';
import path from 'path';
import tinyurl from 'tinyurl'; // تأكد من تثبيت هذه المكتبة

async function generateAnimeImage({ api, event, args }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
        const promptApiUrl = "https://www.api.vyturex.com/describe?url=";
        const sdxlApiUrl = "https://www.api.vyturex.com/sdxl";

        if (event.type !== "message_reply") {
            return api.sendMessage("⚠️ | يرجى الرد على صورة", event.threadID, event.messageID);
        }

        const attachment = event.messageReply.attachments[0];
        if (!attachment || !["photo", "sticker"].includes(attachment.type)) {
            return api.sendMessage("⚠️ | يجب أن يكون الرد على صورة.", event.threadID, event.messageID);
        }

        const imageUrl = await tinyurl.shorten(attachment.url);

        const promptResponse = await axios.get(promptApiUrl + encodeURIComponent(imageUrl));
        let promptFromImage = promptResponse.data;

        const additionalPrompt = "Anime style"; 

        const combinedPrompt = additionalPrompt + " " + promptFromImage;

        let model = 20;

        if (args.length > 0) {
            const specifiedModel = parseInt(args[0]);
            if (!isNaN(specifiedModel)) {
                model = specifiedModel;
            }
        }

        const sdxlResponse = await axios.get(`${sdxlApiUrl}?prompt=${encodeURIComponent(combinedPrompt)}&model=${model}`, {
            responseType: "stream"
        });

        const cacheFolderPath = path.join(process.cwd(), "cache");
        if (!fs.existsSync(cacheFolderPath)) {
            fs.mkdirSync(cacheFolderPath);
        }
        const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
        const fileStream = fs.createWriteStream(imagePath);

        sdxlResponse.data.pipe(fileStream);

        await new Promise((resolve, reject) => {
            fileStream.on("finish", resolve);
            fileStream.on("error", reject);
        });

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        const stream = fs.createReadStream(imagePath);
        api.sendMessage({ body: "", attachment: stream }, event.threadID);

    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("❌ | حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.", event.threadID);
    }
}

export default {
    name: 'فيلتر',
    author: 'OpenAI',
    role: 'member',
    description: 'يولِّد صورة أنمي مستوحاة من الصورة المُردَّة كرد على الرسالة.',
    execute: generateAnimeImage
};