import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';

async function welcomeAndFarewell({ api, event }) {
  switch (event.logMessageType) {
    case "log:unsubscribe": {
      const leftParticipantFbId = event.logMessageData.leftParticipantFbId;
      if (leftParticipantFbId == api.getCurrentUserID()) {
        return;
      }
      const profilePicUrl = `https://graph.facebook.com/${leftParticipantFbId}/picture?type=large&redirect=false`;
      const profileName = await getProfileName(leftParticipantFbId);
      const farewellMessage = `❏إسم العضو 👤 : 『${profileName}』 \n❏ سبب المغادرة 📝 : 『${getFarewellReason(event.logMessageData.reason)}』.`;
      await sendWelcomeOrFarewellMessage(api, event.threadID, farewellMessage, profilePicUrl);
      break;
    }
    case "log:subscribe": {
      const addedParticipants = event.logMessageData.addedParticipants;
      const threadName = event.threadName;
      const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
      for (const participant of addedParticipants) {
        const profilePicUrl = `https://graph.facebook.com/${participant.userFbId}/picture?type=large&redirect=false`;
        const profileName = await getProfileName(participant.userFbId);
        const welcomeMessage = `❏إسم العضو 👤: 『${profileName}』\n❏إسم المجموعة 🧭 : 『${threadName}』\n❏ تاريخ الإنضمام 📆 : 『${currentTime}』.`;

        // إرسال رسالة الترحيب باستخدام API.sendMessage
        await sendWelcomeOrFarewellMessage(api, event.threadID, welcomeMessage, profilePicUrl);
      }
      break;
    }
  }
}

function getFarewellReason(reason) {
  return reason === "leave" ? "قام غادر من تلقاء نفسه" : "تم طرده من المجموعة";
}

async function getProfileName(userID) {
  try {
    const response = await axios.get(`https://graph.facebook.com/${userID}?fields=name&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    return response.data.name;
  } catch (error) {
    console.error('Error fetching profile name:', error);
    return "Unknown";
  }
}

async function sendWelcomeOrFarewellMessage(api, threadID, message, profilePicUrl) {
  try {
    const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
    const profilePicPath = `./cache/profile_${Date.now()}.png`;
    fs.writeFileSync(profilePicPath, response.data);
    await api.sendMessage({
      body: message,
      attachment: fs.createReadStream(profilePicPath),
    }, threadID);
    fs.unlinkSync(profilePicPath); // حذف الملف بعد إرساله
  } catch (error) {
    console.error('Error sending welcome or farewell message:', error);
  }
}

export default {
  name: "welcomeAndFarewell",
  execute: welcomeAndFarewell
};