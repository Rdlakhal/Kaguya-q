const JoinGroupCommand = {
  name: "إنضمام",
  author: "YourName",
  role: "member",
  description: "يضيف المستخدم إلى مجموعة معينة باستخدام آيدي المجموعة.",
  async execute({ api, args, event }) {
    const supportGroupId = args[0];
    if (!supportGroupId) {
      api.sendMessage("يرجى تقديم آيدي مجموعة.", event.threadID);
      return;
    }
    const threadID = event.threadID;
    const userID = event.senderID;
    try {
      const threadInfo = await api.getThreadInfo(supportGroupId);
      const participantIDs = threadInfo.participantIDs;
      if (participantIDs.includes(userID)) {
        api.sendMessage(
          "أنت بالفعل في هذه المجموعة. إذا لم تجده، يرجى التحقق من طلبات الرسائل الخاصة بك.",
          threadID
        );
      } else {
        await api.addUserToGroup(userID, supportGroupId);
        api.sendMessage(
          "لقد تمت إضافتك إلى هذه المجموعة. إذا لم تجد المجموعة في صندوق الوارد الخاص بك، فيرجى التحقق من طلبات الرسائل أو صندوق البريد العشوائي.",
          threadID
        );
      }
    } catch (error) {
      console.error("فشلت إضافة المستخدم إلى مجموعة الدعم:", error);
      api.sendMessage("لا أستطيع إضافتك لأن الآيدي الخاص بك غير مسموح بها لطلب الرسائل أو أن حسابك خاص. الرجاء إضافتي ثم حاول مرة أخرى...", threadID);
    }
  }
};

export default JoinGroupCommand;