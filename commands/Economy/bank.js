export default {
  name: "توب",
  author: "kaguya project",
  cooldowns: 5,
  description: "عرض قائمة بالمستخدمين الأكثر رصيداً مالياً.",
  role: "member",
  async execute({ api, event, Economy }) {
    try {
      const topUsers = await Economy.getAll(); // جلب جميع بيانات المستخدمين

      // فرز المستخدمين بناءً على الرصيد بترتيب تنازلي
      topUsers.sort((a, b) => b.data.money - a.data.money);

      let replyMessage = "═══《متصدري الرصيد》═══\n";
      for (let i = 0; i < Math.min(topUsers.length, 10); i++) {
        const user = topUsers[i];
        const userName = user.data.name || "Unknown";
        const userBalance = user.data.money || 0;
        const rank = `🏅${i + 1}.`; // المرتبة

        replyMessage += `${rank} الإسم 👤: ${userName}\nالرصيد 💰: ${userBalance} دولار\n═════════════\n`;
      }

      // إرسال الرد
      return api.sendMessage(replyMessage, event.threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ | حدث خطأ أثناء جلب قائمة المتصدرين في الرصيد.", event.threadID);
    }
  },
};