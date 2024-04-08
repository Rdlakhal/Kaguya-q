import axios from "axios";
import fs from "fs";
import path from "path";

async function fetchImages({ api, event, args }) {
  try {
    const { data } = await axios.get("https://sandipapi.onrender.com/dp");
    const maleImg = await axios.get(data.male, { responseType: "arraybuffer" });
    fs.writeFileSync(path.join(process.cwd(), "temp", "img1.png"), Buffer.from(maleImg.data, "utf-8"));
    const femaleImg = await axios.get(data.female, { responseType: "arraybuffer" });
    fs.writeFileSync(path.join(process.cwd(), "temp", "img2.png"), Buffer.from(femaleImg.data, "utf-8"));

    const msg = "✿━━━━━━━━━━━━━━━━━✿\n\t\t「 إليك التطقيم الخاص بك ✨ 」\n✿━━━━━━━━━━━━━━━━━✿";
    const allImages = [
      fs.createReadStream(path.join(process.cwd(), "temp", "img1.png")),
      fs.createReadStream(path.join(process.cwd(), "temp", "img2.png")),
    ];

    return api.sendMessage({
      body: msg,
      attachment: allImages
    }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
  }
}

export default {
  name: "تطقيم",
  author: "حسين يعقوبي",
  role: "Admin",
  description: "الحصول على تطقيم للأنمي",
  execute: fetchImages
};