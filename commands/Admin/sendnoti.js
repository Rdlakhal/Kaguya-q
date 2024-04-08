const evalCommand = {
  name: "إشعار",
  author: "Kaguya Project",
  cooldowns: 5,
  description: "إرسال إشعار إلى جميع المجموعات!",
  role: "admin",
  aliases: ["thongbao"],
  execute: async ({ api, event, args, Threads }) => {
    const noidung = args.join(" ");
    if (!noidung) return api.sendMessage(" ⚠️ |الرجاء إدخال محتوى الرسالة الذي تريد إرساله إلى جميع المجموعات!", event.threadID, event.messageID);

    let count = 0;
    let fail = 0;

    try {
      const { data: allThreads } = await Threads.getAll();

      for (const value of allThreads) {
        if (!isNaN(parseInt(value.threadID)) && value.threadID !== event.threadID) {
          const { error } = await sendMessage(api, `[ إشعار من المشرف ]\n\n${noidung}`, value.threadID);
          if (error){
            fail++
          }
          else {
            count++;
          }
        }
      }

      return api.sendMessage(`[ إشعار ]\nتم إرسال الإشعار إلى : ${count} مجموعة بنحاح ✅\nفشل إرسال الإشعار إلى : ${fail}`, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage(` ❌ | خطأ : ${err}`, event.threadID, event.messageID);
    }
  },
};

async function sendMessage(api, message, threadID) {
  return new Promise((resolve) => api.sendMessage(message, threadID, (error) => resolve({ error })));
}

export default evalCommand;
