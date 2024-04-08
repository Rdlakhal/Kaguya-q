class Afk {
  name = "مشغول";
  author = "Kaguya Project";
  cooldowns = 10;
  description = "يرسل البوت تقرير إليك في حالة تم عمل منشن لك أو تحدث عليك شخص ما.";
  role = "member";
  dataUser = {}
  lang = {
    "vi_VN": {
      "afk": "Đã đặt trạng thái afk với lý do: $1",
      "afk_reply": "Người dùng $1 đang afk với lý do: $2",
      "afk_clear": "Chào mừng quay trở lại, những người đã tag bạn khi bạn afk:\n\n$1"
    },
    "ar_AE": {
      "afk": "قام بتشغيل ميزة عدم الإزعاج والسبب : $1",
      "afk_reply": "المستخدم $1 مشغول مع السبب : $2",
      "afk_clear": "مرحبا الأشخاص اللذين قامو بعمل منشن حين كنت غائبا هم كالتالي :\n\n$1"
    }
  }
  async execute({ api, event, args, Users }) {
    var reason = args.join(" ") || client.config.language == "ar_AE" ? "بدون سبب" : "بدون سبب";
    try {

      var nameUser = (await Users.find(event.senderID))?.data?.data?.name || event.senderID;
      this.dataUser[event.senderID] = { reason, nameUser, tag: [] };
      return api.sendMessage(getLang("plugins.afk.afk", reason), event.threadID, event.messageID);
      
    } catch (err) {
      console.log(err)
    }
  }
  async events({ event, api }) {
    try {

      if (event.senderID in this.dataUser) {
        return api.sendMessage(getLang("plugins.afk.afk_clear", this.dataUser[event.senderID].tag.join(`\n` + '-'.repeat(30) + "\n")), event.threadID, () => {
          delete this.dataUser[event.senderID];
        }, event.messageID);
      }

      if (!event.mentions) return;

      for (let id of Object.keys(event.mentions)) {
        if (id in this.dataUser) {
          this.dataUser[id].tag.push(`الآيدي 🧿 : ${event.senderID}\nمحتوى 📝 : ${event.body}\nوقت ⏰ : ${new Date().toLocaleString("ar-EA", { timeZone: "Africa/Casablanca" })}`);
          api.sendMessage(getLang("plugins.afk.afk_reply", this.dataUser[id].nameUser, this.dataUser[id].reason), event.threadID, event.messageID);
        }
      }

    } catch (err) {
      console.log(err)
    }
  }
}

export default new Afk();
