import { Message, CommandInteraction, User, Emoji, Client, TextChannel, GuildEmoji, ReactionEmoji } from "discord.js";

export class EmojiExtractor {
    private client!: Client;
    EmojiExtractor(client: Client) {
        this.client = client;
    }

    public async extractEmoji(
        input: CommandInteraction | Message
    ): Promise<void> {
        if (input instanceof CommandInteraction) {
            this.extractEmojiInteraction(input);
        } else {
            this.extractEmojiMessageCommand(input);
        }
    }

    extractEmojiInteraction(
        input: CommandInteraction
    ): void {
        //TODO: EXTRACT EMOJI FROM SEARCH PARAMETER
        //TODO: GET MESSAGE LINKED IN SEARCH PARAMETER=>EXTRACT EMOJI FROM THAT MESSAGE AND REACTIONS
    }

    async extractEmojiMessageCommand(input: Message): Promise<void> {
        let message = input;
        if (input.reference) {

            let replyMessage = await this.client.guilds.fetch(input.reference.guildId)
                .then(guild => guild.channels.fetch(input.reference!.channelId))
                .then(channel => {
                    if (channel instanceof TextChannel) {
                        return channel.messages.fetch(input.reference!.messageId!);
                    }
                });
            if (replyMessage) {
                message = replyMessage;
            }
        } else {
            let messageFromUrl = await this.getMessageFromUrl(input.content);
            if (messageFromUrl) {
                message = messageFromUrl;
            }
        }

        let emoji = this.extractEmojiFromMessage(message);

        this.sendEmojiToUserFromMessage(input, emoji);
    }

    extractEmojiFromMessage(input: Message): string[] {
        let emojiArr = new Array<string>();

        let re: RegExp = /<a?:\w*:\d*>/;
        let emojiMatches = input.content.match(re);
        if (emojiMatches) {
            emojiMatches.forEach(e => {
                e = e.slice(0, e.length - 1).slice(1);
                //TODO: test
                let parts = e.split(':');
                let emoji = this.client.emojis.resolve(parts[2]);
                if (emoji) {
                    emojiArr.push(emoji.url);
                }
            });
        }
        input.reactions.cache.forEach(messReact => {
            if (messReact.emoji.url) {
                emojiArr.push(messReact.emoji.url);
            }
        })

        return emojiArr;
    }
    /**
     * Returns a message object based on a string that may contain a url
     * @param urlInput a string that may contain a url to a message
     * @returns a message object if it finds a url otherwise undefined
     */
    async getMessageFromUrl(urlInput: string): Promise<Message | undefined> {
        const re: RegExp =
            /https:\/\/(?:canary\.)?discord\.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+/;
        let urls = urlInput.match(re);
        if (urls?.length === 0) {
            return undefined;
        }
        let parts = urls![0].split("/");
        let lastIndex = parts.length - 1;
        let messageId = parts[lastIndex];
        let channelId = parts[lastIndex - 1];
        let guildId = parts[lastIndex - 2];

        return this.client.guilds.fetch(guildId)
            .then(guild => guild.channels.fetch(channelId))
            .then((channel) => {
                if (channel instanceof TextChannel) {
                    return channel.messages.fetch(messageId)
                }
            })
    }

    sendEmojiToUserFromMessage(
        originalMessage: Message,
        emojiUrls: string[]
    ): void {
        //TODO: HANDLE ERROR IF USER DOES NOT ALLOW DMS
        //turn emoji into urls
        //send urls to user, in multiple messages if too many emoji
        let message = '';
        try {
            for (let i = 0; i < emojiUrls.length; i += 10) {
                if (i > 9 && i % 10 === 0) {
                    originalMessage.author.send(message);
                    message = "";
                }
                message += `${emojiUrls[i]}\n`;
            }
            originalMessage.author.send(message);
        } catch (error) {
            //User probably doesn't allow dms
            originalMessage.reply(
                "An error occurred. Please change your DM permissions and try again"
            );
        }
    }
}