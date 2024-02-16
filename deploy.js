const { REST, Routes } = require('discord.js');
const clientId = process.env.BOT_ID;
require('dotenv').config();
const token = process.env.TOKEN;
const fs = require('fs');
const path = require('path');

const commands = [];
const foldersPath = path.join(__dirname, 'src');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();