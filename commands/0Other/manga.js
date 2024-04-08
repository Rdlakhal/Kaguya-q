import axios from "axios";
import Scraper from 'mal-scraper';
import request from 'request';
import fs from "fs";
import path from "path";

async function animeSearch({ api, event }) {
    try {
        let input = event.body;
        let query = input.substring(5);
        let Replaced = query.replace(/ /g, " ");

        api.sendMessage(`🔎 جاري  البحث عن "${Replaced}"...`, event.threadID, event.messageID);

        // ترجمة المدخلات إلى اللغة الإنجليزية
        const translationInputResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(query)}`);
        const translatedQuery = translationInputResponse?.data?.[0]?.[0]?.[0];

        // بحث عن معلومات الأنمي باستخدام النص المترجم
        const Anime = await Scraper.getInfoFromName(translatedQuery).catch(err => {
            api.sendMessage("⚠️ " + err, event.threadID, event.messageID);
        });

        // ترجمة الملخص إلى اللغة العربية
        const translationSummaryResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(Anime.synopsis)}`);
        const translatedSummary = translationSummaryResponse?.data?.[0]?.[0]?.[0];

        // استخدام المعلومات المترجمة للبحث عن الصورة والمعلومات الأخرى
        let getURL = Anime.picture;
        let ext = getURL.substring(getURL.lastIndexOf(".") + 1);

        if (!Anime.genres[0] || Anime.genres[0] === null) Anime.genres[0] = "لا شيء";

        let callback = function () {
            api.sendMessage({
                body: `العنوان: ${Anime.title}\nالعنوان باليابانية: ${Anime.japaneseTitle}\nالنوع: ${Anime.type}\nالحالة: ${Anime.status}\nالعرض الأول: ${Anime.premiered}\nالبث: ${Anime.broadcast}\nالبث: ${Anime.aired}\nالمنتجون: ${Anime.producers}\nالاستوديوهات: ${Anime.studios}\nالمصدر: ${Anime.source}\nالحلقات: ${Anime.episodes}\nالمدة: ${Anime.duration}\nالأنواع: ${Anime.genres}\nالشعبية: ${Anime.popularity}\nالتصنيف: ${Anime.ranked}\nالتقييم: ${Anime.score}\nالتقييم: ${Anime.rating}\n\nالملخص: \n${translatedSummary}`,
                attachment: fs.createReadStream(path.join(process.cwd(), `/cache/mal.${ext}`))
            }, event.threadID, () => fs.unlinkSync(path.join(process.cwd(), `/cache/mal.${ext}`)), event.messageID);
        }

        request(getURL).pipe(fs.createWriteStream(path.join(process.cwd(), `/cache/mal.${ext}`))).on("close", callback);
    } catch (error) {
        console.error("حدث خطأ:", error);
        api.sendMessage("عذرًا! حدث خطأ ما.", event.threadID, event.messageID);
    }
}

export default {
    name: "مانجا",
    author: "kaguya project",
    role: "member",
    description: "البحث عن معلومات أنمي باستخدام MyAnimeList",
    execute: animeSearch
};