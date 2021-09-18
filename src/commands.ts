import { SlashCommandBuilder} from 'discord.js/node_modules/@discordjs/builders';
export interface CommandFromDb{
    command_id: string;
    server_id?: string;
    command_string: string;
    entry_value: string;
    mod_only: number;
}



function createCommandsFromDB(commands: CommandFromDb[]): any[]{
    
}