module.exports = {
  name: "skip",
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.DisTube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `${client.emotes.error} | ¡Ahora mismo no tienes nada en la cola!`
      );
    try {
      const song = await queue.skip();
      message.channel.send(
        `${client.emotes.success} | Saltada! Reproduciendo ahora:\n${song.name}`
      );
    } catch (e) {
      message.channel.send(`${client.emotes.error} | ${e}`);
    }
  },
};
