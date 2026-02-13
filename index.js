const fs = require('fs');

require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));


client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.content === "!panel") {

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📂 SUBIDA RÁPIDA DE EVIDENCIA")
      .setDescription(`
1️⃣ Pulse el botón "Abrir Expediente".
2️⃣ Se asignará número automático.
3️⃣ Se creará un hilo privado.
      `);

    const btn = new ButtonBuilder()
      .setCustomId('abrir_expediente')
      .setLabel('Abrir Nuevo Expediente')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(btn);

    message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'abrir_expediente') {

    data.caseNumber++;
fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));


    const thread = await interaction.channel.threads.create({
      name: `CASO #${data.caseNumber}`,
      type: ChannelType.PrivateThread,
      invitable: false
    });

    await thread.members.add(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle(`📝 CASO #${data.caseNumber}`)
      .setDescription(`
✅ Caso registrado.
🔹 ID: ${data.caseNumber}
🔹 Nombre del delincuente
    Delitos cometidos
    evidencia: (fotos)
🔒 Solo System Bureau puede cerrar.
      `);

    const cerrarBtn = new ButtonBuilder()
      .setCustomId('cerrar')
      .setLabel('Validar y Archivar')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(cerrarBtn);

    await thread.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: `Expediente creado: ${thread}`, ephemeral: true });
  }

  if (interaction.customId === 'cerrar') {
    await interaction.channel.setArchived(true);
    await interaction.reply({ content: "Caso archivado.", ephemeral: true });
  }
});



client.login(process.env.TOKEN);

