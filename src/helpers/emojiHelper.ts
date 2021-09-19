import { Message, CommandInteraction, User, Emoji } from "discord.js";

export async function extractEmoji(input: (CommandInteraction | Message)): Promise<void>{
    if(input instanceof CommandInteraction){
        extractEmojiInteraction(input);
    }
    else{
        extractEmojiMessageCommand(input);
    }
}

async function extractEmojiInteraction(input: CommandInteraction): Promise<void>{
    //TODO: EXTRACT EMOJI FROM SEARCH PARAMETER
    //TODO: GET MESSAGE LINKED IN SEARCH PARAMETER=>EXTRACT EMOJI FROM THAT MESSAGE AND REACTIONS

}

async function extractEmojiMessageCommand(input: Message): Promise<void>{
    let messageFromUrl=getMessageFromUrl(input.content);
    let emoji= extractEmojiFromMessage(messageFromUrl?messageFromUrl:input);

    sendEmojiToUserFromMessage(input,emoji);

    //TODO: GET MESSAGE LINKED IN SEARCH PARAMETER=>EXTRACT EMOJI FROM THAT MESSAGE AND REACTIONS
}

function extractEmojiFromMessage(input: Message): Emoji[]{
    let emoji= new Array<Emoji>();
    //TODO: EXTRACT EMOJI FROM TEXT
    //TODO: EXTRACT EMOJI FROM REACTIONS
    return emoji;
}

function getMessageFromUrl(urlInput: string): Message|undefined{
    //TODO: MAKE SURE IT IS A URL
    //GET MESSAGE
    //EXTRACT EMOJI FROM MESSAGE AND REACTIONS

    return undefined;
} 

function sendEmojiToUserFromMessage(originalMessage: Message, emojiArray: Emoji[]): void{
    //TODO: HANDLE ERROR IF USER DOES NOT ALLOW DMS
    //turn emoji into urls
    //send urls to user, in multiple messages if too many emoji
    let emojiUrls:string[]=[];
    let message='';
    try{

        for(let i=0;i<emojiUrls.length;i+=10){
            if(i>9 && i%10===0){
                originalMessage.author.send(message);
                message='';
            }
            message+=`${emojiUrls[i]}\n`;
        }
        originalMessage.author.send(message);
        }
    catch(error){
        //User probably doesn't allow dms
        originalMessage.reply("An error occurred. Please change your DM permissions and try again");
    }
}

function getEmojiFromText(rawMessage: string):  Emoji[]{
    return [];
}