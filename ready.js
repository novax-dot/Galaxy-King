const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {

    console.log(`Bot listo: ${client.user.tag}`);

    const channelId = '1511105369194234056';
    const channel = client.channels.cache.get(channelId);

    if (!channel) return console.log("❌ Canal no encontrado");

    // 🔥 BUSCAR MENSAJES DEL BOT
    const messages = await channel.messages.fetch({ limit: 20 });
    const existing = messages.find(m =>
      m.author.id === client.user.id &&
      m.components.length > 0 &&
      m.embeds.length > 0 &&
      m.embeds[0].title?.includes('Galaxy Applications')
    );

    // 🎨 EMBED ORIGINAL (EL TUYO)
    const embed = new EmbedBuilder()
      .setTitle('﹒ㅤ⨯ㅤTwings Star Applicationsㅤ﹐ㅤ⟢')
      .setColor(0x8E44AD)
      .setThumbnail(channel.guild.iconURL())
      .setImage('https://media.discordapp.net/attachments/1510968550221676634/1510968646632083497/file_0000000026a071f8be11ab7eede506d6.png')
      .setDescription(
`> <a:violet:1510958154052145252> **Bienvenido/a al sistema de aplicaciones de Twings Star.**

> Aquí puedes postularte para formar parte del equipo del servidor.

> ◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
> <a:yellow:1510958102432714801> ﹏ ᵕ · __Postúlate para ser parte del staff del servidor__
> <a:yellow:1510958102432714801> ﹏ ᵕ · __El proceso es automático y guiado dentro de un canal privado___
> <a:yellow:1510958102432714801> ﹏ ᵕ · __Solo usuarios activos y responsables serán considerados__
> ◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟

> <a:emailove:1510958245836099624> **Presiona el botón para iniciar tu postulación.**
> El sistema te hará preguntas dentro de tu canal privado.`
      )
      .setFooter({ text: 'Galaxy King • Application System' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('apply_staff')
        .setLabel('Postularme')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🚀')
    );

    // 🧠 SI YA EXISTE → EDITA
    if (existing) {
      await existing.edit({
        embeds: [embed],
        components: [row]
      });

      console.log("♻ Panel actualizado (sin duplicar)");
    }

    // 🆕 SI NO EXISTE → ENVÍA
    else {
      await channel.send({
        embeds: [embed],
        components: [row]
      });

      console.log("✔ Panel creado por primera vez");
    }
  }
};