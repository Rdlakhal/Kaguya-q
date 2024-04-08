export default {
  name: "آيدي",
  author: "Thiệu Trung Kiên",
  cooldowns: 10,
  description: "قم بالإطلاع على الآيدي الخاص بك",
  role: "member",
  aliases: ["getuid"],
  execute: async ({ event }) => {
    const uid = event?.messageReply?.senderID || (Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : event.senderID);

    if (!uid) {
      return kaguya.reply(" ⚠️ |يرجى عمل منشن أو الرد على رسالة الشخص الذي تحتاج إلى الحصول على آيدي منه");
    }

    return kaguya.reply(uid);
  }
};
