import { SlashCommandBuilder} from 'discord.js/node_modules/@discordjs/builders';
export interface CommandFromDb{
    command_id: string;
    server_id?: string;
    command_string: string;
    description?: string;
    entry_value: string;
    mod_only: number;
}
export interface SingleCommand{
    command_string: string;
    description: string;
    entry_value: string;
}
//TODO: need descriptions of each option
export interface ServerCommand{
    command_string: string;
    subCommands: SingleCommand[];
    description?: string;
}

/**
 * 
 * @param commandsArray a list of commands from the database
 * @returns 
 */
function createSlashCommands(commandsArray: CommandFromDb[]): Map<string, SlashCommandBuilder[]>{
    let commandsByServer=new Map<string, ServerCommand[]>();
    commandsArray.forEach(command=>{
        let server_id=command.server_id??'';
        if(!commandsByServer.has(server_id)){
            commandsByServer.set(server_id,new Array<ServerCommand>())
        }
        let commandsForServer=commandsByServer.get(server_id)!;//  todo: refactor so that we have a more efficient get
        let serverCommand=commandsForServer.find(cmd=>{
            return cmd.command_string===command.command_string;
        });
        if(!serverCommand){
            serverCommand= {
                command_string:command.command_string,
                description:'', //todo: descriptions for command groups
                subCommands:[]
            }
            commandsForServer.push(serverCommand);
        }
        serverCommand.subCommands.push({
            command_string:command.command_string,
            description:command.description??'',
            entry_value:command.entry_value
        });
    });
    let slashCommandsByServer=new Map<string, SlashCommandBuilder[]>();
    commandsByServer.forEach((serverCommands, serverId)=>{
        if(!slashCommandsByServer.has(serverId)){
            slashCommandsByServer.set(serverId,[]);
        }
        let server=slashCommandsByServer.get(serverId)!;
        serverCommands.forEach(cmd=>{
            server.push(createSlashCommand(cmd));
        });
    })
    return slashCommandsByServer;
}

function createSlashCommand(command: ServerCommand): SlashCommandBuilder{
    let slashCommand=new SlashCommandBuilder().setName(command.command_string);

    if(command.description){
        slashCommand.setDescription(command.description);
    }
    command.subCommands.forEach(cmd=>{

        slashCommand.addSubcommand(subCommand=>
                subCommand.setName(cmd.description?makeSlashCommandName(cmd.description):makeSlashCommandName(cmd.entry_value))
                .setDescription(cmd.description?makeSlashCommandDescription(cmd.description):makeSlashCommandDescription(cmd.entry_value))
        )
    })
    return slashCommand;
}

function makeSlashCommandName(input: string){
    if(input.length>32){
        return input.slice(0,32);
    }
    return input;
}
function makeSlashCommandDescription(input: string){
    if(input.length>100){
        return input.slice(0,100);
    }
    return input;
}