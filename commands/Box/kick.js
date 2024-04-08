class Kick {
  name = "طرد";
  author = "Kaguya Project";
  cooldowns = 60;
  description = "قم بطرد الأعضاء المحددين من المجموعة";
  role = "admin";
  aliases = ["إبلع"];

  async execute({ api, event, Threads }) {
    try {
        const mentions = Object.keys(event.mentions);
        const threadData = (await Threads.find(event.threadID))?.data?.data;

      if (!threadData.adminIDs.includes(api.getCurrentUserID())) {
        return kaguya.reply(" ⚠️ | يحتاج البوت أن يكون آدمن لإستخدام هذه الميزة");
      }

      if (!mentions[0]) {
        return kaguya.reply(" ⚠️ | يرحى عمل منشن للشخص اللذي تريد طرده من المحموعة");
      }

      await Promise.all(
        mentions.map(async (id) => {
          try {
            await api.removeUserFromGroup(id, event.threadID);
          } catch (err) {
            console.error(err);
          }
        })
      );
    } catch (err) {
      console.error(err);
      return kaguya.reply(" ⚠️ |لقد حدث خطأ غير متوقع!");
    }
  }
}