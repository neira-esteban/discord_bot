module.exports = {
  name: "stop",
  aliases: ["disconnect", "leave"],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.DisTube.getQueue(message);
    if (!queue) return message.reply(`¡No tienes nada en la cola!`);
    queue.stop();
    message.channel.send(`¡Detenido!`);
  },
};
