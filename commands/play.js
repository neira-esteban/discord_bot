module.exports = {
  name: "play",
  aliases: ["p"],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(" ");
    if (!string)
      return message.channel.send(`Estimado, ingrese el nombre de una canción`);
    client.DisTube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel,
      message,
    });
  },
};
