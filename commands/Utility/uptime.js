import moment from "moment-timezone";

export default {
  name: "تايم",
  author: "Kaguya Project",
  cooldowns: 60,
  description: "بيانات البوت",
  role: "member",
  aliases: ["بيانات"],
  execute: async ({ args, api, event }) => {
    const currentTime = moment().tz('Africa/Casablanca').format('YYYY-MM-DD hh:mm:ss A');

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime - (hours * 3600)) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `  البوت كان شغالا منذ ${hours} 𝑯 ساعة ، ${minutes} دقيقة 𝒆𝑴 ، و ${seconds} 𝑺 ثانية`;

    const threads = await api.getThreadList(99999, null, ['INBOX']);

    let userCount = 0;
    let groupCount = 0;

    threads.forEach(thread => {
      if (thread.isGroup) {
        groupCount++;
      } else {
        userCount++;
      }
    });

    const output = `🤖 |حالة سيرفر 🌐\n\n` +
      `الوقت الحالي ☑️: ${currentTime},\n` +
      `إجمالي عدد المستخدمين 👥»: ${userCount}\n` +
      `إجمالي عدد المجموعات 〽️»: ${groupCount}\n\n` +
      `${uptimeStr}`;

    api.sendMessage(output, event.threadID);
  }
};
