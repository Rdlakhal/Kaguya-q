import axios from "axios";
import fs from "fs-extra";

export default {
  name: "توك",
  author: "Kaguya Project 1",
  cooldowns: 60,
  description: "تنزيل مقاطع التيك انطلاقا من الرابط",
  role: "member",
  aliases: ["tik"],
  execute: async ({ api, args, event }) => {
    api.setMessageReaction("⏱️", event.messageID, () => {}, true);

    var [url] = args;
    try {
      var { data } = await axios.get(`https://deku-rest-api.replit.app/tiktokdl?url=${url}`);
      if ("data" in data) {
        var { title, play } = data.data;
        var bufferVideo = await axios.get(play, { responseType: "arraybuffer" });
        var path = `./cache/tiktok_${event.senderID}.mp4`;
        fs.writeFileSync(path, Buffer.from(bufferVideo.data));
        api.sendMessage(
          {
            body: title,
            attachment: fs.createReadStream(path),
          },
          event.threadID,
          (err) => {
            if (err) console.error(err);
            fs.unlinkSync(path);
          },
          (err, messageInfo) => {
            if (err) {
              console.error(err);
              api.setMessageReaction("❌", event.messageID, () => {}, true);
            } else {
              api.setMessageReaction("✅", messageInfo.messageID, () => {}, true);
            }
          }
        );
      } else {
        api.sendMessage(data.msg || "حدث خطأ!", event.threadID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("حدث خطأ!", event.threadID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },
};