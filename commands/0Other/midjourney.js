import axios from 'axios';
import fs from "fs";
import path from "path";

export default {
  name: "كلب",
  author: "ChatGPT",
  role: "member",
  description: "يقوم بإرسال صور لكلاب عشوائي",
  async execute({ api, event }) {
    try {
      const response = await axios.get('https://random.dog/woof.json');
      const url = response.data.url;
      const ext = path.extname(url);
      // استخدام process.cwd() لتحديد مجلد temp بدلاً من __dirname
      const tempPath = path.join(process.cwd(), 'temp', `dog${ext}`);

      const writer = fs.createWriteStream(tempPath);
      writer.on('finish', () => {
        api.sendMessage(
          {
            attachment: fs.createReadStream(tempPath)
          }, 
          event.threadID, 
          () => fs.unlinkSync(tempPath),
          event.messageID
        );
      });

      axios({
        url,
        method: 'GET',
        responseType: 'stream',
      }).then(response => {
        response.data.pipe(writer);
      });

    } catch (error) {
      console.error(error);
      api.sendMessage("Sorry, an error occurred while fetching the dog image.", event.threadID);
    }
  }
};