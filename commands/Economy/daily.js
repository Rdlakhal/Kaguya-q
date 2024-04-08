class CheckTT {
  name = "هدية";
  author = "Kaguya Project";
  cooldowns = 3600; // 3600 ثانية تعني ساعة واحدة
  description = "الحصول على مال اليومي كل يوم";
  role = "member";
  aliases = ["diemdanh"];

  async execute({ api, event, Economy, Users }) {
    const currentTime = Math.floor(Date.now() / 1000);
    // ضبط الفاصل الزمني ليكون ساعة واحدة
    const timeStamps = this.cooldowns; // ساعة واحدة
    try {
      const lastCheckedTime = await Users.find(event.senderID);
      if (lastCheckedTime?.data?.data?.other?.cooldowns && currentTime - parseInt(lastCheckedTime?.data?.data?.other?.cooldowns) < timeStamps) {
        const remainingTime = timeStamps - (currentTime - lastCheckedTime?.data?.data?.other?.cooldowns);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return api.sendMessage(`⏱️ | قم بالعودة بعد: ${minutes} دقيقة ${seconds} ثانية`, event.threadID);
      }

      // قائمة المكافآت اليومية
      const dailyRewards = ["500", "1000", "1050", "1600", "1000", "1", "1000", "1000", "1400", "1581", "1980", "9910", "169", "69", "69", "699", "4231", "5482", "1581", "1510", "540"];
      
      // اختيار مكافأة عشوائية
      const randomIndex = Math.floor(Math.random() * dailyRewards.length);
      const rewardAmount = parseInt(dailyRewards[randomIndex]);

      await Economy.increase(rewardAmount, event.senderID);
      await Users.update(event.senderID, {
        other: {
          cooldowns: currentTime,
        },
      });
      return api.sendMessage(`✅ | 𝔡𝔬𝔫𝔢 𝔰𝔲𝔠𝔠𝔢𝔰𝔰𝔣𝔲𝔩𝔩𝔶 \n مكافئتك هي 🎁: ${rewardAmount} دولار`, event.threadID);
    } catch (error) {
      console.error("❌ | حدث خطأ:", error);
      return api.sendMessage("❌ | حدث خطأ أثناء تنفيذ العملية.", event.threadID);
    }
  }
}

export default new CheckTT();