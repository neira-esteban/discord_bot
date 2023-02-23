//const { Client, GatewayIntentBits, Collection } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const emotes = require("./utils/emojis.json");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
});
const { config } = require("dotenv");
const { DisTube } = require("distube");
config();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.emotes = emotes.emoji;

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

/* client.on("messageCreate", (message) => {
  console.log(`${message.content}`);
  return message.reply("RESPONDIDO");
}); */

//------------------------------------------------

client.DisTube = new DisTube(client, {
  leaveOnStop: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.log("Could not find any commands!");
  const jsFiles = files.filter((f) => f.split(".").pop() === "js");
  if (jsFiles.length <= 0) return console.log("Could not find any commands!");
  jsFiles.forEach((file) => {
    const cmd = require(`./commands/${file}`);
    console.log(`Loaded ${file}`);
    client.commands.set(cmd.name, cmd);
    if (cmd.aliases)
      cmd.aliases.forEach((alias) => client.aliases.set(alias, cmd.name));
  });
});

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = "$";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(
      `¡Debes estar en un canal de voz!`
    );
  }

  try {
    cmd.run(client, message, args);
  } catch (e) {
    console.error(e);
    message.channel.send(`Error: \`${e}\``);
  }

  /* if (!message.content.toLowerCase().startsWith(prefix)) return;

  if (args.shift().toLowerCase() === "play") {
    client.DisTube.play(message.member.voice.channel, args.join(" "), {
      member: message.member,
      textChannel: message.channel,
      message,
    });
  } */
});

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.names.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.DisTube
  .on("playSong", (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Reproduciendo: \`${song.name}\` - \`${
        song.formattedDuration
      }\`\Solicitada por: ${song.user}\n${status(queue)}`
    )
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Agregada ${song.name} - \`${song.formattedDuration}\` a la playlist`
    )
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Agregada \`${playlist.name}\` a la playlist (${
        playlist.songs.length
      } canciones) \n${status(queue)}`
    )
  )
  .on("error", (channel, e) => {
    if (channel)
      channel.send(
        `${client.emotes.error} | Se ha encontrado un error: ${e
          .toString()
          .slice(0, 1974)}`
      );
    else console.error(e);
  })
  .on("empty", (channel) =>
    channel.send("El canal de voz está vacío")
  )
  .on("searchNoResult", (message, query) =>
    message.channel.send(
      `${client.emotes.error} | No se encontraron resultados \`${query}\`!`
    )
  )
  .on("finish", (queue) => queue.textChannel.send("Terminado!"));
