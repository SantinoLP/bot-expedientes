const fs = require('fs');

let data;

if (deepStrictEqual.existsSync('./data.json')) {
  data = JSON.parse(fs.readFileSync('./data.json'));
} else {
  data = {caseNumber: 8040};
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  MessageFlags
} = require('discord.js');

let caseNumber = JSON.parse(
  fs.readFileSync('./data.json', 'utf8')
).caseNumber



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
      type: ChannelType.PublicThread,
      reason: 'Nuevo caso creado'
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

  try {
    await interaction.reply({
      content: "Caso archivado.",
      flags: MessageFlags.Ephemeral
    });

    if (!interaction.channel.archived) {
      await interaction.channel.setArchived(true);
    }

  } catch (error) {
    console.error("Error al cerrar hilo:", error);
  }

}

  }
);



client.login(process.env.TOKEN);

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor web activo en puerto ${PORT}`);
});

