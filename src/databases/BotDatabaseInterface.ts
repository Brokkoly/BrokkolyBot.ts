import { Guild } from "discord.js";

export interface BotDatabaseInterface {

	getMessage(inputs: CommandSearchInputs): Promise<string>;

}

export interface CommandSearchInputs {
	guild: Guild;
	command: string;
	optionId?: string;
	search?: string;
}