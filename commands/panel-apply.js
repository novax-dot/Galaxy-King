const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel-apply')
    .setDescription('Sistema de postulaciones'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('﹒ㅤ⨯ㅤGalaxy Applicationsㅤ﹐ㅤ⟢')
      .setColor(0x8E44AD)
      .setThumbnail(interaction.guild.iconURL())
      .setImage('https://media.discordapp.net/attachments/1510968550221676634/1510968646632083497/file_0000000026a071f8be11ab7eede506d6.png?ex=6a1ebeb5&is=6a1d6d35&hm=cf64dc558b9e820fef193621384b98895f8b74fd8199b619b01f732a0a0b68d0&=&format=webp&quality=lossless&width=1872&height=749')
      .setDescription(
`> <a:violet:1510958154052145252> **Bienvenido/a al sistema de aplicaciones de Galaxy King.**
>
> Aquí puedes postularte para formar parte del equipo del servidor.
>
> ◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
>
> <a:yellow:1510958102432714801> ﹏ ᵕ · Postúlate para ser parte del staff del servidor
> <a:yellow:1510958102432714801> ﹏ ᵕ · El proceso es automático y guiado dentro de un canal privado
> <a:yellow:1510958102432714801> ﹏ ᵕ · Solo usuarios activos y responsables serán considerados
>
> ◞ ྀི◟ ͜ ◞ ྀི◟ ͜ ◞ ྀི◟
>
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

await interaction.reply({
  embeds: [embed],
  components: [row]
});
