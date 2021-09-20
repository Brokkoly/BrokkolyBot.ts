import { Message } from "discord.js"
import { PostgresDatabase } from "../databases/PostgresDatabase";

export const onMessage = async (message: Message, database: PostgresDatabase) => {
	if (message.author.bot || !message.guild) {
		return;
	}


	let commandArr = message.content.split(" ");
	//TODO: Get command prefix for server
	if (commandArr[0].startsWith('!') && commandArr[0].length > 1) {
		//TODO: split me out so that interactions use the same code
		let response = await database.getMessage({
			guild: message.guild ?? undefined,
			command: "test",
			search: commandArr.length >= 2 ? commandArr[2] : undefined,
		})
		if (response) {
			await message.reply(response);
		}
		else{
			//TODO: add reaction with X to indicate it is not correct
		}
	}


};
