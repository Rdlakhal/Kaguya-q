import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
    name: "دمج2",
    author: "المستخدم",
    role: "message",
    description: "يقوم بتبديل الوجوه بين صورتين باستخدام API خارجي",
    execute: async function({ message, event, api }) {
        try {
            if (event.type != "message_reply") {
                return kaguya.reply(" ⚠️ |الرجاء الرد على الرسالة التي تحتوي على صورتين مرفقتين.");
            }

            let links = [];
            for (let attachment of event.messageReply.attachments) {
                links.push(attachment.url);
            }

            if (links.length < 2) {
                return kaguya.reply(" ⚠️ |يرجى التأكد من وجود صورتين مرفقتين بالضبط.");
            }

            const shortLink1 = await global.utils.uploadImgbb(links[0]);
            const Url1 = shortLink1.image.url;

            const shortLink2 = await global.utils.uploadImgbb(links[1]);
            const Url2 = shortLink2.image.url;

            let swapfaceUrl = `https://apis-samir.onrender.com/faceswap?sourceUrl=${Url1}&targetUrl=${Url2}`;
            const tempFilePath = path.join(process.cwd(), 'cache', `faceswap.${Date.now()}.jpg`);
            const writer = fs.createWriteStream(tempFilePath);

            axios({
                method: 'get',
                url: swapfaceUrl,
                responseType: 'stream',
            }).then(response => {
                response.data.pipe(writer);
                writer.on('finish', () => {
                      kaguya.reply({ body: "", attachment: fs.createReadStream(tempFilePath) }).then(() => {
                        fs.unlinkSync(tempFilePath);
                    });
                });
                writer.on('error', (error) => {
                    console.error("An error occurred while writing the file:", error);
                    message.reply("An error occurred while processing the face swap.");
                    fs.unlinkSync(tempFilePath); // Ensure deletion if an error occurs
                });
            }).catch(error => {
                console.error("An error occurred while fetching the face swap image:", error);
                  kaguya.reply(" ❌ | حدث خطأ أثناء دمج الصورتين.");
            });
        } catch (error) {
            console.error("A general error occurred:", error);
              kaguya.reply(" ❌ | حدث خطأ أناء إدماح");
        }
    }
};