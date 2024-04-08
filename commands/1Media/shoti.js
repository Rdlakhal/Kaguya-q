import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "شوتي",
  author: "kaguya project",
  role: "member",
  description: "يقوم بإرسال مقاطع فيديو من رابط معين.",
  async execute({ event, api }) {

    api.setMessageReaction("⏱️", event.messageID, (err) => { }, true);

    const apiUrl = 'https://shoti-server-v2.onrender.com/api/v1/get';

    try {
      const response = await axios.post(apiUrl, {
        apikey: "$shoti-1hnqbk45ppatrh94fi8",
      });
      const videoUrl = response.data.data.url;
      const videoPath = path.join(process.cwd(), 'temp', 'shoti.mp4');

      const writer = fs.createWriteStream(videoPath);
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      videoResponse.data.pipe(writer);

      writer.on('finish', async () => {
        api.setMessageReaction("✅", event.messageID, (err) => { }, true);
        api.sendMessage({
          body: `إسم المستخدم : @${response.data.data.user.username}`,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, event.messageID);
      });
    } catch (error) {
      api.sendMessage(`❌ | حدث خطأ أثناء إنشاء الفيديو. خطأ: ${error}`, event.threadID);
    }
  },
};