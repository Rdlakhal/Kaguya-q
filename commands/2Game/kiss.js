async function calculateAge({ event, args, api }) {
  const threadSetting = global.data.threadData.get(event.threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const input = args[0];

  if (!input) {
    return api.sendMessage(`أىجوك قم بإدخالها بالصيغة التالية ${prefix}عمري [يوك/شهر/سنة من تاريخ الإزدياد]`, event.threadID, event.messageID);
  }

  const cc = input.split("/");
  const ngay1 = parseInt(cc[0]);
  if (!ngay1 || isNaN(ngay1) || ngay1 > 31 || ngay1 < 1) {
    return api.sendMessage("تاريخ ميلاد غير صالح!", event.threadID, event.messageID);
  }

  const thang1 = parseInt(cc[1]);
  if (!thang1 || isNaN(thang1) || thang1 > 12 || thang1 < 1) {
    return api.sendMessage("شهر ميلاد غير صالح!", event.threadID, event.messageID);
  }

  const nam1 = parseInt(cc[2]);
  if (!nam1) {
    return api.sendMessage("سنة الميلاد غير صالحة!", event.threadID, event.messageID);
  }

  const moment = require("moment-timezone");
  const hientai = moment.tz("Aftica/Casablanca").format("DD/MM/YYYY HH:mm:ss");
  const djtme = hientai.split(" ");
  const dm = djtme[0].split("/");
  const ngay2 = parseInt(dm[0]);
  const thang2 = parseInt(dm[1]);
  const nam2 = parseInt(dm[2]);

  let ngay3 = ngay2 - ngay1;
  let thang3 = thang2 - thang1;
  let nam3 = nam2 - nam1;

  const duma = djtme[1].split(":");
  const hh = parseInt(duma[0]);
  const mm = parseInt(duma[1]);
  const ss = parseInt(duma[2]);

  let nam = nam3 + Math.round(thang3 / 12 * 100) / 100;
  let xthang = nam * 12 + thang3 + ngay1 / 31;
  let thang = Math.round(xthang * 100) / 100;
  let dcm = thang / 36;
  let tuan = Math.round(thang * 4 * 100) / 100;
  let xngay = (xthang * 31 + xthang * 30) / 2 - dcm * 3 / 2 + ngay3 + hh / 24;
  let wtf = (xthang * 31 + xthang * 30) / 2 - dcm * 3 / 2 + ngay3;
  let ngay = Math.round(xngay * 100) / 100;
  let gio = Math.round((wtf * 24 + hh) * 100) / 100;
  let xphut = gio * 60 + mm + ss / 60;
  let phut = Math.round(xphut * 100) / 100;
  let giay = Math.round((phut * 60 + ss) * 100) / 100;

  const message = `-تاريخ الميلاد: ${input}\n\n-عدد السنوات التي مرت: ${nam} سنة \n-عدد الأشهر التي مضت: ${thang} شهر \n-عدد الأسابيع التي مرت: ${tuan} أسبوع \n-عدد الأيام التي مرت: ${ngay} يوم \n-عدد الساعات التي مرت: ${gio} ساعة \n-عدد الدقائق التي مرت: ${phut} دقيقة \n-عدد الثواني التي مرت: ${giay} ثانية`;

  return api.sendMessage(message, event.threadID, event.messageID);
}

export default {
  name: "عمري2",
  author: "kaguya project",
  role: "member",
  description: "يقوم بحساب عمر العضو الحالي.",
  execute: calculateAge
};