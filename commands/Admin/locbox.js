import sleep from "time-sleep";

class locbox {
  name = "تصفية";
  author = "Kaguya Project";
  cooldowns = 60;
  description = "مربع التصفية ضمن الأعضاء المحددين!";
  role = "owner";
  aliases = [];

  async execute({ api, event, Threads, args }) {
    try {
      const [length] = args.map(Number);

      if (isNaN(length) || length <= 0) {
        return kaguya.reply(" ⚠️ |من فضلك أدخل رقما صالحا!");
      }

      const threads = (await Threads.getAll()).data;
      const findThreads = threads.filter((thread) => thread.data.members < length);

      if(!findThreads.length){
        return kaguya.reply(` ❌ |لم يتم العثور على ${length} عضو في المجموعة ❗`)
      }

      for (const threadData of findThreads) {
        await api.removeUserFromGroup(api.getCurrentUserID(), threadData.threadID);
        await sleep(1000);
      }
    } catch (error) {
      console.error(error);
      return kaguya.reply("❌لقد | حدث خطأ غير متوقع!");
    }
  }
}

export default new locbox();
