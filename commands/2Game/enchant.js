export default {
  name: "زخرفة",
  author: "Kaguya Project",
  role: "member",
  cooldowns: 10,
  description: "زخرفة النصوص العربية",
  async execute({ args, kaguya }) {
    try {
      const content = args.join(" ").toLowerCase();

      if (!content) return kaguya.reply(` ⚠️ | قم بإدخال نص من أجل زخرفته.`);

      const enchantmentMap = {
        أ: "آ", ب: "بۣۗہ", ت: "تۣۗہ", ث: "ثۣۗہ", ج: "جۣۗہ",
        ح: "حۣۗہ", خ: "خۣۗہ", د: "دُ", ذ: "ذۣ", ر: "ر",
        ز: "زۣ", س: "سۣۗہ", ش: "شۣۗہ", ص: "صۣۗہ", ض: "ضۣۗہ",
        ط: "طۣۗہ", ظ: "ظۣۗہ", ع: "عۣۗہ", غ: "غۣۗہ", ف: "فۣۗہ",
        ق: "قۣۗہ", ك: "كۣۗہ", x: "لَ", م: "مۣۗہ", ن: "نۣۗہ"
      };

      const decoratedContent = content.replace(/[أ-ي]/g, match => enchantmentMap[match] || match);

      return kaguya.reply(decoratedContent);
    } catch (err) {
      console.error(err);
    }
  },
};