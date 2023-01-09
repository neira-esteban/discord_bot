const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
const { config } = require("dotenv");
config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in!`);
});

client.on('messageCreate', (message)=>{
  console.log(`${message.content}`);
  return message.reply('RESPONDIDO');
})
