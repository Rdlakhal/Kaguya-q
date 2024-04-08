import fs from 'fs';
import path from 'path';

export default {
  name: "ضفي",
  author: "Kaguya Project",
  cooldowns: 10,
  description: "قم بإضافة الأعضاء إلى المجموعة",
  role: "member",
  aliases: ["add"],
  async execute({ api, event, args }) {
    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    if (args.length === 0) {
      api.sendMessage("ℹ️ | يرجى تحديد قائمة الأعضاء التي تريد إضافتها.", event.threadID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return;
    }

    try {
      const threadID = event.threadID;
      const senderID = event.senderID;
      const uidsFilePath = path.join(process.cwd(), "uids.json");
      let uids = JSON.parse(fs.readFileSync(uidsFilePath, 'utf8'));

      let successCount = 0;
      let failCount = 0;

      function addUser(uid) {
        if (uids.length === 0) {
          const totalCount = successCount + failCount;
          const message = `✅ | المستخدمين اللذين تمت إضافتهم : ${successCount}\n❌ اللتي فشلت في إضافة : ${failCount}\nالعدد الإجمالي : ${totalCount}`;
          api.sendMessage(message, threadID)
            .then(() => {
              fs.writeFileSync(uidsFilePath, JSON.stringify(uids), 'utf8');
            })
            .catch((err) => {
              console.error('Error sending completion message:', err);
            });
          return;
        }

        api.addUserToGroup(uid, threadID)
          .then(() => {
            successCount++;
            const index = uids.indexOf(uid);
            if (index !== -1) {
              uids.splice(index, 1);
            }
            addUser(uids[0]);
          })
          .catch((err) => {
            console.error('Error adding user to the group:', err);
            failCount++;
            addUser(uids[0]);
          });
      }

      addUser(uids[0]);

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | عذرًا، حدث خطأ أثناء إضافة الأعضاء إلى المجموعة.", event.threadID);
    }
  }
};