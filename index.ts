import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
})

//@ts-ignore
client.commands = new Collection();

const eventsPath = path.join(__dirname, './src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    console.log(`Loading ${filePath} as EVENT`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const commandsPath = path.join(__dirname, './src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.ts'));
for (const file of commandFiles) {
    const fPath = path.join(commandsPath, file);
    const cmd = require(fPath);

    console.log(`Loading ${fPath} as COMMAND`)

    //@ts-ignore
    client.commands.set(cmd.data.name, cmd);
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isAutocomplete()) {
        //@ts-ignore
        const command = await interaction.client.commands.get(interaction.commandName)

        if (!command) return;

        try {
            await command.autocomplete(interaction)
        } catch (e) {
            console.log(e)
            return;
        }
    }
    if (!interaction.isCommand()) return;

    //@ts-ignore
    const command = await interaction.client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction)
    }
    catch (e) {
        return;
    }
});

console.log("Launching bot")
client.login(process.env.TOKEN)