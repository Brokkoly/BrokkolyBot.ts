import { Message } from "discord.js"
import { PostgresDatabase } from "../databases/PostgresDatabase";

export const onMessage = async (message: Message, database: PostgresDatabase) => {
	if(message.author.bot){
		return;
	}

	

	message.channel.send(message.content);
};
