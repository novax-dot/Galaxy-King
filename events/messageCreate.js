const {
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

const spamMap = new Map();

module.exports = {
  name: 'messageCreate',

  async execute(message) {

    if (!message.guild) return;
    if (message.author.bot) return;

    // 🌌 WHITELIST STAFF
    if (
      message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
      message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) return;

    // 🌌 CANALES PERMITIDOS PARA LINKS
    const allowedChannels = [
      'ID_ALIANZAS',
      'ID_PLANTILLA'
    ];

    // 🌌 CANAL DE LOGS
    const logChannel =
  message.guild.channels.cache.get('1513071135527403621');

    // 🚫 ANTI EVERYONE / HERE
    if (
      message.content.includes('@everyone') ||
      message.content.includes('@here')
    ) {

      await message.delete().catch(() => {});

      await message.member.timeout(
        5 * 60 * 1000,
        'Mass mention detectado'
      ).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor(0x8E44AD)
        .setTitle('﹒⨯ Galaxy Security ﹐⟢')
        .setDescription(
`🚨 Usuario muteado por mass mention

👤 Usuario: ${message.author}
📍 Canal: ${message.channel}
⏰ Tiempo: 5 minutos`
        )
        .setTimestamp();

      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }

      return;
    }

    // 🔗 ANTI LINKS
    const linkRegex =
      /(https?:\/\/|discord\.gg\/|www\.)/i;

    if (
      linkRegex.test(message.content) &&
      !allowedChannels.includes(message.channel.id)
    ) {

      await message.delete().catch(() => {});

      await message.member.timeout(
        5 * 60 * 1000,
        'Links no permitidos'
      ).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor(0x8E44AD)
        .setTitle('﹒⨯ Galaxy Security ﹐⟢')
        .setDescription(
`🔒 Usuario muteado por links

👤 Usuario: ${message.author}
📍 Canal: ${message.channel}
⏰ Tiempo: 5 minutos`
        )
        .setTimestamp();

      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }

      return;
    }

    // ⚡ ANTI SPAM
    const data = spamMap.get(message.author.id) || {
      count: 0
    };

    data.count++;

    spamMap.set(message.author.id, data);

    if (data.count >= 5) {

      await message.member.timeout(
        60 * 1000,
        'Spam detectado'
      ).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor(0x8E44AD)
        .setTitle('﹒⨯ Galaxy Security ﹐⟢')
        .setDescription(
`⚠ Usuario muteado por spam

👤 Usuario: ${message.author}
📍 Canal: ${message.channel}
⏰ Tiempo: 1 minuto`
        )
        .setTimestamp();

      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }

      spamMap.delete(message.author.id);

      return;
    }

    setTimeout(() => {
      spamMap.delete(message.author.id);
    }, 5000);
  }
};