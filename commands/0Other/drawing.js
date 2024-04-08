import axios from "axios";
import fs from "fs-extra";
import path from "path";
import moment from "moment-timezone";

const KievRPSSecAuth = process.env.KievRPSSecAuth || "FABaBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACISOJ7nKbKfJGAQsYVbgbZArsOc6qXCqxuTgz+8HD14/hPkMHCFBFc05OH3fQaUibGBxHUBhjyMNlNJ4G2xaE+3E3qboQW9Ssh6dHsy5sVebSbffFcCPja0jl32j+HNzCTyb2RjxgpOnZ4I5+s0EmKIK5fKbRR9R/qutMk8tUEMbKDWP3fkMPlbgqa08rYyazF5DuwXabb/5/EgIkkU9V2wVk5MBoUBWKAz0yVRg0YTTGL+iRZE/s3V4o1IfG8v/vy5YVPpp7xdDHl04oKrJB9ydMJnnAUd3gRVyuSevK4L/9XzkWkkh6ABDcaWbnOdPTzcLHYbGqhfFivQeQQqr0Yucfvn0XrLlKoTcvK1TpFMdcF3sN3OSwNBJ93vVZsxH+da8yQUPc3aHQNGTq+YNhROD+q8y/z4SMx6IH0U51parpHyVFdrrtYbZerZjfpiGYVt2xLhz3VlUSgwkkiGhMrkWwDYHgmkwA6j2wRq44X12Uq4hOYe+3ROPoF/F4i5ZZDd/SWy8ibIrhvxE7Avt+jaOwUsLZOqaqhyGHX8gxq6cYfaq93EAR+nCEsUtA9iLX6QQK4cXtIs1HzZlvHw4MxZLqJSu2b327FClNd3G1aiQt2aFbwSpYflIiei8mhGyiJmR8KNE55uZTWN/4ibC48voNsfsqs/q1Lb4TRBFVkR7FjJrs5EPdzCS0Qid1U+IhlBkIFNgXBkq1KZjZO/4QW3SBVqUaVogqCIjOKkPXzNfHv4/5DlnebopbJ7H3joaQWFfnRk34hH+h7T/3T3vxbDJTFtHW6ic6N/EFEDRGF3mHV9GbKFOWtEE9fdqmF8W8jS9Kg+wPAY3MwhXsr201hqF32fJNT3CkOkZ0UdbHlImjUkWu0sd8rWzhVPaT3+UH7QIcK4enEj/74iwK64S/89EhQ0VZZunLsZ+EMe1b05fyFfkflki8R2vkQjie/ZdShC8RClxAhMMybwKC6qXrFCPoFfUiupooGvflCxTqB58URMSeTstViqO1IDx/zu51l3YOXrVz214y3yJVSVa5wEu9rkkmygGnMuaZ5pSwJhUl7LMpiHos76alDSTjnTkQrWqkVinSpf1B6oSIjUIVvxHVaojJL2XQMauQGVpDfyoTj7VLchm/mL1ARTa2jBd/2pz8RUXVcxD8ajam3a3xiwZFowlIokze+h2nR6U4MDi7Sbui+1gee7j9k2W9dqe5rQAtVWnFN0CvzpJdGy5WkMfKOIcKk4gJCd9TTw1pcBBB0SS+7tU3EyDQo9HqANmVDff8DJub4KSJ8CyhKXHXC9Z4FG108SA6szQI86wvJr81LGwS88STuBH4/PJUxYiH1Wmbe4D0SRqcsB72nvU0IYujCi9BWZbdJONYIVL0c4NZqg8diQCLCDIQ3/yTV5Z3gJTFACCwEr3M47cbStGo5bhBcM5ACSvgQ==";
const _U = process.env._U || "10SrkyDrapYjO80Wly3mALjCck-UTsifkB2bolD-YP4MGLymzDyAXDQcK7zpskZh04o0AFXxV3Mdv3q22EiEK3rPgg8ZhSn6Eyg5XhklK5ACd1Dp4S8PtLR1oKe4VcgjGnbhUWgm4nOmEwv1rbNpoFDelVDlw9We9jZAxXDvfp0EwoZBTtjKd0qBbhGh7J6fJQzqsoG4TzqhkXqCJ2JTkAg";

export default {
  name: "تخيلي",
  author: "kaguya project",
  cooldowns: 50,
  description: "فم بتوليد ثور بإستخدام الذكاء الإصطناعي dalle",
  role: "member",
  aliases: ["dalle", "دايل"],
  execute: async ({ api, event, args }) => {
    const prompt = args.join(" ");
    const senderID = event.senderID;

    try {
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(prompt)}`);
      const translatedText = translationResponse?.data?.[0]?.[0]?.[0];

      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?auth_cookie_U=${encodeURIComponent(_U)}&auth_cookie_KievRPSSecAuth=${encodeURIComponent(KievRPSSecAuth)}&prompt=${encodeURIComponent(translatedText)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("تم تلقي الاستجابة ولكن عناوين URL للصورة مفقودة", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(process.cwd(), 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      // استخدام moment-timezone لجلب الوقت والتاريخ
      const now = moment().tz("Asia/Kuwait");
      const timeString = now.format("HH:mm:ss");
      const dateString = now.format("YYYY-MM-DD");
      const executionTime = ((Date.now() - event.timestamp) / 1000).toFixed(2);

      api.getUserInfo(senderID, async (err, userInfo) => {
        if (err) {
          console.log(err);
          return;
        }
        const userName = userInfo[senderID].name;

        await api.sendMessage({
          attachment: imgData,
          body: `✿━━━━━━━━━━━━━━━━━✿\n✅ | تفضل صورك \nتم التنفيذ من طرف: ${userName}\n⏰ | ❏ الوقت: ${timeString}\n📅 | ❏ التاريخ: ${dateString}\n⏳ | ❏ وقت التنفيذ: ${executionTime} ثانية\n📝 | ❏الوصف: ${prompt}\n✿━━━━━━━━━━━━━━━━━✿`
        }, event.threadID, event.messageID);
      });

    } catch (error) {
      api.sendMessage("آسفة لا أستطيع 🥺", event.threadID, event.messageID);
    }
  }
};