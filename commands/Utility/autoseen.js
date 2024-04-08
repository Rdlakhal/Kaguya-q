class AutoSeen {
  name = "ڤيو";
  author = "Thiệu Trung Kiên";
  cooldowns = 60;
  description = "انظر رسائل المستخدم!";
  role = "owner";
  aliases = ["as"];
  config = false;
  async events({ api }) {
    this.config && api.markAsReadAll(() => {});
  }
  async execute() {
    this.config = this.config ? false : true;
    return kaguya.reply(`تم ${this.config ? "تشغيل" : "إطفاء"} ميزة مراقبة الرسائل تلقائيا من طرف البوت`);
  }
}

export default new AutoSeen();
