import fs from 'fs';
import path from 'path';
import axios from 'axios';

async function downloadImage(url, localPath) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(localPath, Buffer.from(response.data, 'binary'));
}

export default {
    name: "فتيات",
    author: "kaguya project",
    cooldowns: 50,
    description: "يرسل لك صور فتيات جميلات",
    role: "member",
    aliases: ["بنات"],
    execute: async ({ api, event }) => {
        try {
            const imageURL = "https://i.imgur.com/MMcBfhQ.jpg",
                "https://i.imgur.com/bFDiwev.jpg",
                "https://i.imgur.com/SAOdnoK.jpg",
                "https://i.imgur.com/TZ1RHnm.jpg",
                "https://i.imgur.com/Ar8wDeL.jpg",
                "https://i.imgur.com/edI973K.jpg",
                "https://i.imgur.com/KeC6WlN.jpg",
                "https://i.imgur.com/pZ1RYOa.jpg",
                "https://i.imgur.com/Izft7RA.jpg",
                "https://i.imgur.com/jM1Xpga.jpg",
                "https://i.imgur.com/NTXJLbO.jpg",
                "https://i.imgur.com/txJ9OsI.jpg",
                "https://i.imgur.com/xBDRQj7.jpg",
                "https://i.imgur.com/rfP4uLF.jpg",
                "https://i.imgur.com/Srwy9OH.jpg",
                "https://i.imgur.com/FjfTktc.jpg",
                "https://i.imgur.com/54ZTqat.jpg",
                "https://i.imgur.com/giWZT5C.jpg",
                "https://i.imgur.com/9rvJ3NM.jpg",
                "https://i.imgur.com/tCAVuec.jpg",
                "https://i.imgur.com/6wd5DHO.jpg",
                "https://i.imgur.com/7gK5Tf4.jpg",
                "https://i.imgur.com/KvZrcw8.jpg",
                "https://i.imgur.com/0B2akj2.jpg",
                "https://i.imgur.com/MsPM3qs.jpg",
                "https://i.imgur.com/cANGlUv.jpg",
                "https://i.imgur.com/I0RUsfD.jpg",
                "https://i.imgur.com/MF6y3P1.jpg",
                "https://i.imgur.com/aeyKs27.jpg",
                "https://i.imgur.com/W4II2pG.jpg",
                "https://i.imgur.com/txL8OWM.jpg",
                "https://i.imgur.com/MIJ9FWu.jpg",
                "https://i.imgur.com/BXgOzif.jpg",
                "https://i.imgur.com/UOsW7qy.jpg",
                "https://i.imgur.com/oyhAzRg.jpg",
                "https://i.imgur.com/CykGuoX.jpg",
                "https://i.imgur.com/aVIuJ4x.jpg",
                "https://i.imgur.com/l4mWqE2.jpg",
                "https://i.imgur.com/39HVTF3.jpg",
                "https://i.imgur.com/R3T4Rq7.jpg",
                "https://i.imgur.com/bxId8wI.jpg",
                "https://i.imgur.com/scxppXG.jpg",
                "https://i.imgur.com/lDnPGOH.jpg",
                "https://i.imgur.com/NRWxB4I.jpg",
                "https://i.imgur.com/TdOhT1B.jpg";
            const localPath = path.join(process.cwd(), 'temp', 'girls.jpg');

            // تحميل الصورة المراد إرسالها
            await downloadImage(imageURL, localPath);

        api.setMessageReaction("🌸", event.messageID, (err) => {}, true);
          // إرسال الصورة
            await api.sendMessage({ attachment: fs.createReadStream(localPath) }, event.threadID);

            // حذف الملف المؤقت بعد إرسال الصورة
            fs.unlinkSync(localPath);
        } catch (error) {
            console.error("🙂👍🏻هناك بينتراست يابرو", error);
            api.sendMessage("🙂 عذرا طردني لموقع لاني روبوت😹", event.threadID);
        }
    }
};
