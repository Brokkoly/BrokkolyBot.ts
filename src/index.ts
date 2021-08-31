import { Client, Intents } from "discord.js";
import { PostgresDatabase } from "./databases/PostgresDatabase";
import { onMessage } from "./events/onMessage";
//console.log("imported");
//require('dotenv').config();

(async () => {
	const BOT = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES] });

	const DATABASE = new PostgresDatabase();



	BOT.on("ready", (client) => {
		console.log("Connected to Discord!")
	});

	BOT.on("messageCreate", async (message) => await onMessage(message, DATABASE));

	await BOT.login(process.env.TOKEN);
})();