import axios from "axios";

export default {
  name: "تجربة",
  author: "Kaguya Project",
  role: "owner",
  cooldowns: 10,
  description: "تجربة الكودات",
  aliases: ['eval'],
  async execute({ api, event, args, Threads, Users, Economy }) {
    try {
      const code = args.join(" ");
      (function() {
        try {
          eval(`
            ${code}
          `);
        } catch (err) {
          console.error(err);
        }
      })(api, args, event, Threads, Users, Economy, axios);

    } catch (err) {
      console.error(err);
    }
  },
};
