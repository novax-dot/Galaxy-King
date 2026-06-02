const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {

    // 💬 SLASH COMMANDS
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, interaction.client);
      } catch (err) {
        console.error(err);
        if (!interaction.replied) {
          await interaction.reply({
            content: '❌ Error en el comando',
            ephemeral: true
          });
        }
      }
    }

    if (!interaction.isButton()) return;

    const { guild, user } = interaction;

    // 📩 APPLY SYSTEM
    if (interaction.customId === 'apply_staff') {

      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply('📩 Postulación creada correctamente');

      const channel = await guild.channels.create({
        name: `apply-${user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
        ],
      });

      // 🌌 INTRO EMBED
      const intro = new EmbedBuilder()
        .setTitle('﹒ㅤ⨯ㅤTicket abiertoㅤ﹐ㅤ⟢')
        .setColor(0x8E44AD)
        .setDescription(
`> <a:violet:1510958154052145252> **Bienvenido/a al sistema de postulaciones de Twings Star.**

> Aquí iniciarás tu proceso para formar parte del staff del servidor.

> ◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
> <a:yellow:1510958102432714801> ᵕ · El formulario es privado y será revisado por el staff
> <a:yellow:1510958102432714801> ᵕ · Responde con sinceridad y respeto
> <a:yellow:1510958102432714801> ᵕ · Evita respuestas vacías o spam
> ◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟

> <a:emailove:1510958245836099624> **Comienza respondiendo las preguntas abajo.**`
        )
        .setFooter({ text: 'Galaxy King • Applications System' });

      await channel.send({ embeds: [intro] });

      // 💬 PREGUNTAS
      await channel.send(
`> <a:yellow:1510958102432714801> **﹏ ᵕ · Pregunta 1**

💬 ¿Por qué quieres formar parte del staff del servidor?

◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
✨ Responde con honestidad`
      );

      await channel.send(
`> <a:yellow:1510958102432714801> **﹏ ᵕ · Pregunta 2**

💬 ¿Qué experiencia tienes en servidores o comunidades?

◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
✨ Cuéntanos tu experiencia`
      );

      await channel.send(
`> <a:yellow:1510958102432714801> **﹏ ᵕ · Pregunta 3**

💬 ¿Cuánto tiempo puedes estar activo diariamente?

◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
⏰ Sé realista con tu disponibilidad`
      );

      await channel.send(
`> <a:yellow:1510958102432714801> **﹏ ᵕ · Pregunta 4**

💬 ¿Cómo actuarías ante un problema entre usuarios?

◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
🧠 Explica cómo resolverías conflictos`
      );

      // 🌌 FINAL
      await channel.send(
`> <a:emailove:1510958245836099624> **Aplicación enviada correctamente**

Gracias por completar tu postulación ${user}.

👑 El equipo de <@&1507474158936653925> revisará tu solicitud pronto.

────────────────────
✨ Si eres seleccionado, serás contactado en este mismo canal o por DM.
◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟`
      );

      // 🔘 BOTONES
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('claim_apply')
          .setLabel('Reclamar')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('📌'),

        new ButtonBuilder()
          .setCustomId('close_apply')
          .setLabel('Cerrar')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      await channel.send({
        content: '🎟️ **Panel de Aplicación**',
        components: [row]
      });

      return;
    }

    // 📌 CLAIM (SOLO STAFF)
    if (interaction.customId === 'claim_apply') {

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
          content: '❌ Solo el staff puede reclamar este ticket.',
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('📌 Ticket Reclamado')
        .setColor(0xF1C40F)
        .setDescription(`👮 Reclamado por: ${interaction.user}`)
        .setTimestamp();

      await interaction.reply({
        content: '📌 Ticket reclamado.',
        ephemeral: true
      });

      await interaction.channel.send({ embeds: [embed] });

      return;
    }

    // 🔒 CLOSE
    if (interaction.customId === 'close_apply') {

      await interaction.reply({
        content: '🔒 Cerrando ticket...'
      });

      const logChannel = interaction.guild.channels.cache.find(c => c.name === 'ticket-logs');

      if (logChannel) {
        logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('📕 Ticket Cerrado')
              .setColor(0xE74C3C)
              .addFields(
                { name: 'Usuario', value: interaction.user.tag },
                { name: 'Canal', value: interaction.channel.name }
              )
              .setTimestamp()
          ]
        });
      }

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 3000);

      return;
    }
  }
};
