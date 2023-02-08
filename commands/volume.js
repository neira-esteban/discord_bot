module.exports = {
  name: "volume",
  aliases: ["v", "set", "set-volume"],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.DisTube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `${client.emotes.error} | ¡No tienes nada en la cola!`
      );
    const volume = parseInt(args[0]);
    if (isNaN(volume))
      return message.reply(
        `${client.emotes.error} | !Por favor ingresa un número válido!`
      );
    queue.setVolume(volume);
    message.channel.send(`${client.emotes.success} | Volumen en \`${volume}\``);
  },
};
