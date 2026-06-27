require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField, 
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

// 100 Pre-approved 7-day trial keys (sync with app)
const APPROVED_TRIAL_KEYS = new Set([
  'BSTD-A3K7-MX2P-9QWL', 'BSTD-B8N4-TR6J-2FYH', 'BSTD-C5R2-PK9D-7VNX', 'BSTD-D1W9-GH4S-3ZBQ',
  'BSTD-E6T3-LJ8M-5KPF', 'BSTD-F2Y7-NX1R-8CWV', 'BSTD-G9P5-QZ4K-1DTM', 'BSTD-H4M1-WB7N-6XSJ',
  'BSTD-J7K8-FC3P-4RLY', 'BSTD-K3N6-VT5Q-9MZW', 'BSTD-L9X2-DG8B-7HPR', 'BSTD-M5W4-RK1J-2YCN',
  'BSTD-N1Q7-ZP6T-8FXD', 'BSTD-P8V3-YH2M-5KBL', 'BSTD-Q4T9-BN7R-3WJS', 'BSTD-R6D2-MX5P-1GVK',
  'BSTD-S2K8-FQ3N-9TLZ', 'BSTD-T7R1-JB6W-4DYP', 'BSTD-U3M5-PV9X-6CHN', 'BSTD-V9Y4-KT2Q-8RWF',
  'BSTD-W1B6-NZ7D-3MXS', 'BSTD-X8P3-GR4L-5JKV', 'BSTD-Y5N9-WC1T-7QBH', 'BSTD-Z2T7-HK8M-4PFR',
  'BSTD-A4W6-XJ3B-2NQL', 'BSTD-B1M9-QV5R-8TDK', 'BSTD-C7K3-FY2N-6WPZ', 'BSTD-D9R5-LB8X-1HCJ',
  'BSTD-E3T1-MN6P-9KYW', 'BSTD-F8V4-ZQ7D-5RBG', 'BSTD-G2J6-PK3W-7XNT', 'BSTD-H5X8-CR1M-4FLQ',
  'BSTD-J9B2-TN9K-6DPW', 'BSTD-K4Y7-VG5R-3ZHM', 'BSTD-L1P3-BW8J-9XQF', 'BSTD-M7N6-DF2T-5KRC',
  'BSTD-N3Q9-XH4M-8WBY', 'BSTD-P6K1-JZ7V-2TNL', 'BSTD-Q8W5-RB3N-7PCX', 'BSTD-R2T4-MK9D-1FYH',
  'BSTD-S9V7-QJ6B-4LWZ', 'BSTD-T5M3-NP2X-8GKR', 'BSTD-U1B8-WH7T-3QDJ', 'BSTD-V4R6-FK5N-9YCM',
  'BSTD-W7Y2-DX1Q-6PMB', 'BSTD-X3K9-BT4R-5NWL', 'BSTD-Y8P5-JM7V-2HQZ', 'BSTD-Z6W1-GN3K-4TBF',
  'BSTD-A7T4-XQ8P-9RLD', 'BSTD-B5N2-VJ6W-3MKY', 'BSTD-C9R8-KD1T-7FBX', 'BSTD-D3M6-PH5N-2QWJ',
  'BSTD-E1Y9-BT3R-8KCZ', 'BSTD-F7V5-NX2M-4DPQ', 'BSTD-G4K3-WJ9B-6TLH', 'BSTD-H2P8-FQ1D-5RNY',
  'BSTD-J6T7-MZ4K-3XBW', 'BSTD-K9N1-DV8R-7GJC', 'BSTD-L5W4-QB2T-9PXF', 'BSTD-M3B6-YK7N-1HRD',
  'BSTD-N8R2-FP5W-4MQL', 'BSTD-P1X7-TJ3V-6KNZ', 'BSTD-Q4D9-BH8M-2WCY', 'BSTD-R7M5-NQ6K-8FTB',
  'BSTD-S2Y1-PW4R-5DVX', 'BSTD-T6K8-JB7N-3QHM', 'BSTD-U9V3-XF2T-1LPW', 'BSTD-V5N7-DM9B-6RKQ',
  'BSTD-W1T4-QH3R-8YCJ', 'BSTD-X8B6-KN5P-4FWZ', 'BSTD-Y3P2-WT7M-9XDL', 'BSTD-Z7R9-MV1K-5BNH',
  'BSTD-A5W3-JQ8T-2GXP', 'BSTD-B9K7-FN4R-6YMD', 'BSTD-C1T5-BX2V-8QPJ', 'BSTD-D6M4-RH9W-3KLN',
  'BSTD-E8N2-PD7T-5FBZ', 'BSTD-F3V9-WK1M-7RQY', 'BSTD-G7P6-TJ5B-4NXH', 'BSTD-H4Q1-DY8N-9WCK',
  'BSTD-J2B8-MR3V-6TPF', 'K6X5-NW7D-1QHR', 'L9T3-BK4M-8JNZ', 'M1N7-QV6P-3WYX',
  'BSTD-N5R4-FT9B-7KDC', 'BSTD-P8W2-XM1K-5LJQ', 'BSTD-Q3Y6-DH8N-2VBT', 'BSTD-R7K9-PJ4W-6MXF',
  'BSTD-S4T1-NB5R-9QLD', 'BSTD-T2M8-VX3K-4FYH', 'BSTD-U6N5-WQ7T-1RBP', 'BSTD-V9B3-JD2M-8KCZ',
  'BSTD-W5P7-MH6N-3TXQ', 'BSTD-X1K4-BT9R-6WDJ', 'BSTD-Y8V2-FN5W-7PML', 'BSTD-Z4R6-QX3T-2KBY',
  'BSTD-A9M1-DK8P-5NWH', 'BSTD-B3T7-VJ4N-9RQX', 'BSTD-C6W5-MB2K-1FPD', 'BSTD-D8N3-PH7T-4YBZ',
  'BSTD-E2K9-QR1V-6MJW'
]);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`🤖 Bot is online as ${client.user.tag}!`);
  console.log(`🔒 Owner-only commands: "!setup-bastions", "!clear-bastions".`);
});

// ─── Welcome Handler (When new user joins) ──────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  const welcomeChannel = member.guild.channels.cache.find(c => c.name === '🚪-welcome');
  const rulesChannel = member.guild.channels.cache.find(c => c.name === '📜-rules');
  const downloadsChannel = member.guild.channels.cache.find(c => c.name === '📥-downloads');

  if (welcomeChannel) {
    welcomeChannel.send(`👋 Hey ${member}, welcome to **Bastions Tools**! Head over to ${rulesChannel || '#📜-rules'} to unlock the server, and check out ${downloadsChannel || '#📥-downloads'} to install the desktop suite! 🚀`).catch(console.error);
  }
});

// ─── Command Message Handler ─────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // 1. Handle Suggestion Channel (Wipe text, generate Embed + Reactions + Thread)
  if (message.channel.name === '💡-suggestions') {
    const suggestionText = message.content;
    if (!suggestionText.trim()) return;

    await message.delete().catch(() => {});

    const suggestionEmbed = new EmbedBuilder()
      .setAuthor({ 
        name: message.member?.displayName || message.author.username, 
        iconURL: message.author.displayAvatarURL({ dynamic: true }) 
      })
      .setTitle('💡 New Suggestion')
      .setDescription(suggestionText)
      .setColor('#ff6b00')
      .setTimestamp();

    try {
      const suggestionMsg = await message.channel.send({ embeds: [suggestionEmbed] });
      await suggestionMsg.react('👍');
      await suggestionMsg.react('👎');

      const cleanThreadName = suggestionText.slice(0, 35).replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'suggestion';
      await suggestionMsg.startThread({
        name: `Discuss: ${cleanThreadName}`,
        autoArchiveDuration: 1440,
        reason: 'Suggestion Discussion Thread'
      });
    } catch (err) {
      console.error('Failed to process suggestion:', err);
    }
    return;
  }

  // 2. FAQ Auto-Responder (Trigger Word Assistant)
  // Run only in public text categories, skip read-only rooms (announcements/faq)
  const isPublicChannel = ['💬-general', '🪙-bitcoin-heist', '🦺-mvs-bastions-edition', '🤝-mod-support'].includes(message.channel.name);
  if (isPublicChannel) {
    const textLower = message.content.toLowerCase();
    
    // Antivirus Trigger
    if (textLower.match(/\b(defender|smartscreen|blocked|virus|trojan|malware|danger)\b/)) {
      const faqChannel = message.guild.channels.cache.find(c => c.name === '❓-faq');
      return message.reply(`⚠️ **Windows Defender / SmartScreen Info:**\nSince this application is compiled locally and not yet digitally signed, Windows SmartScreen will flag the installer as untrusted. This is normal for custom software. You can safely bypass this by clicking **"More Info"** ➔ **"Run Anyway"**.\n\n*Check out ${faqChannel || '#❓-faq'} for more details.*`).catch(() => {});
    }

    // Download Trigger
    if (textLower.match(/\b(download|installer|setup file|get app|where is the link)\b/)) {
      const dlChannel = message.guild.channels.cache.find(c => c.name === '📥-downloads');
      return message.reply(`📥 **Download Bastions Tools Desktop Suite:**\nYou can download the latest installer files in the ${dlChannel || '#📥-downloads'} channel, or grab the direct installer here: \n💾 **Installer (v1.1.6):** <https://github.com/MrBastion3/bastions-tools-releases1/releases/download/v1.1.6/Bastions-Dayz-Tools-Setup-1.1.6.exe>`).catch(() => {});
    }

    // License Trigger
    if (textLower.match(/\b(license key|activation|activate|key help|trial key|claim role)\b/)) {
      const supportChannel = message.guild.channels.cache.find(c => c.name === '🎫-open-ticket');
      return message.reply(`🔑 **Need to activate your key or claim your role?**\n- **In Discord:** Go to ${supportChannel || '#🎫-open-ticket'} and click **"Claim Premium Role"** to type in your key.\n- **In the App:** Go to **Settings ➔ Tool Customizations ➔ Premium Activation** and paste your key inside the app to unlock pro tools.`).catch(() => {});
    }
  }

  // 🔒 SECURITY GATE: Only the server Owner can trigger prefix commands
  if (!message.content.startsWith(PREFIX)) return;
  if (message.author.id !== message.guild.ownerId) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // COMMAND: CLEAR BASTIONS
  if (command === 'clear-bastions') {
    const statusMsg = await message.reply('⏳ **Clearing Bastions Tools configuration...**');

    try {
      await updateStatus(statusMsg, '⏳ Deleting channels and categories...');
      const targetCategoryNames = ['👋 welcome area', '💬 community tier', '🛠️ support tier', '📦 bastions mods', '👑 premium lounge'];
      const targetChannelNames = [
        '🚪-welcome', '📜-rules', '📢-announcements', '📥-downloads',
        '💬-general', '📸-showcase', '💡-suggestions',
        '❓-faq', '🐛-bug-reports', '🎫-open-ticket', '📋-ticket-logs',
        '📢-mod-announcements', '🪙-bitcoin-heist', '🦺-mvs-bastions-edition', '🤝-mod-support', '💡-mod-suggestions',
        '🔥-premium-chat', '🎯-premium-feedback', '🚨-priority-support'
      ];

      const guildChannels = await message.guild.channels.fetch();
      
      for (const [_, channel] of guildChannels) {
        if (!channel) continue;
        if (channel.id === message.channelId) continue;

        const normalizedName = channel.name.toLowerCase();
        const parentName = channel.parent?.name.toLowerCase();
        
        const isTargetChannel = targetChannelNames.includes(normalizedName);
        const isTargetCategoryParent = parentName && targetCategoryNames.includes(parentName);

        if (isTargetChannel || isTargetCategoryParent) {
          await channel.delete('Bastions Tools Reset').catch(() => {});
        }
      }

      const remainingChannels = await message.guild.channels.fetch();
      for (const [_, channel] of remainingChannels) {
        if (channel && channel.type === ChannelType.GuildCategory && targetCategoryNames.includes(channel.name.toLowerCase())) {
          await channel.delete('Bastions Tools Reset').catch(() => {});
        }
      }

      await updateStatus(statusMsg, '⏳ Deleting roles...');
      const targetRoles = ['Owner', 'Developer', 'Support Staff', 'Premium Holder', 'Trial User', 'Verified'];
      const guildRoles = await message.guild.roles.fetch();

      for (const [_, role] of guildRoles) {
        if (targetRoles.includes(role.name)) {
          await role.delete('Bastions Tools Reset').catch(() => {});
        }
      }

      await updateStatus(statusMsg, '✅ **Clear Completed!** All Bastions categories, channels, and roles have been removed.');
    } catch (err) {
      console.error(err);
      await updateStatus(statusMsg, `❌ **Clear Failed:** ${err.message}`);
    }
    return;
  }

  // COMMAND: SETUP BASTIONS
  if (command === 'setup-bastions') {
    const statusMsg = await message.reply('⏳ **Initializing Bastions Tools Server Setup...**');

    try {
      await updateStatus(statusMsg, '⏳ Creating Roles...');
      
      const rolesConfig = [
        { name: 'Owner', color: '#ffbd00', hoist: true },
        { name: 'Developer', color: '#00f5ff', hoist: true },
        { name: 'Support Staff', color: '#10b981', hoist: true },
        { name: 'Premium Holder', color: '#ff6b00', hoist: true },
        { name: 'Trial User', color: '#eab308', hoist: true },
        { name: 'Verified', color: '#9ca3af', hoist: false }
      ];

      const roles = {};
      for (const rCfg of rolesConfig) {
        let role = message.guild.roles.cache.find(r => r.name === rCfg.name);
        if (!role) {
          role = await message.guild.roles.create({
            name: rCfg.name,
            color: rCfg.color,
            hoist: rCfg.hoist,
            reason: 'Bastions Tools Setup'
          });
        }
        roles[rCfg.name] = role;
      }

      const everyoneRole = message.guild.roles.everyone;
      await everyoneRole.setPermissions([
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory
      ]);

      await updateStatus(statusMsg, '⏳ Creating Welcome Area Category...');
      const welcomeCategory = await message.guild.channels.create({
        name: '👋 welcome area',
        type: ChannelType.GuildCategory
      });

      const readOnlyOverrides = [
        { id: everyoneRole.id, deny: [PermissionsBitField.Flags.SendMessages] }
      ];

      const cWelcome = await createTextChannel(message.guild, '🚪-welcome', welcomeCategory, readOnlyOverrides);
      const cRules = await createTextChannel(message.guild, '📜-rules', welcomeCategory, readOnlyOverrides);
      const cAnnounce = await createTextChannel(message.guild, '📢-announcements', welcomeCategory, readOnlyOverrides);
      const cDownloads = await createTextChannel(message.guild, '📥-downloads', welcomeCategory, readOnlyOverrides);

      await cWelcome.send('👋 **Welcome to Bastions Tools community server!**\nPlease read our server #📜-rules and verify your account to unlock the rest of the channels. If you have a Premium Key, check out #📥-downloads to get started!');
      
      const rulesEmbed = new EmbedBuilder()
        .setTitle('📜 Server Rules & Verification')
        .setDescription(`To access the community channels, please read and agree to our guidelines:

1. **Be Respectful:** Treat moderators, developers, and other users with respect.
2. **Keep it Relevant:** Post support issues in tickets and mod feedback in the mod channels.
3. **No Piracy or Hacks:** Do not share cracked versions of the tool, bypass codes, or malicious links.
4. **No Spam:** Keep formatting clean.

*Click the button below to verify your account and unlock the server!*`)
        .setColor('#ff6b00');

      const verifyRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_user')
          .setLabel('Verify Account')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
      );

      await cRules.send({ embeds: [rulesEmbed], components: [verifyRow] });

      await cAnnounce.send('📢 **Welcome to the Announcements channel!**\nAll major tool updates, feature releases, changelogs, and licensing updates will be posted here. Make sure to keep notifications enabled so you don\'t miss out on important announcements.');

      await cDownloads.send({
        content: `📥 **Download Bastions Tools Desktop Suite**
The latest and most secure version of the server configuration manager is always hosted at our portal.

🔗 **Landing Page Website:** <https://bastions-dayz-tools.vercel.app/>
💾 **Direct Installer (v1.1.6):** <https://github.com/MrBastion3/bastions-tools-releases1/releases/download/v1.1.6/Bastions-Dayz-Tools-Setup-1.1.6.exe>

> [!NOTE]
> *If Windows Defender or SmartScreen blocks the installation, click **"More Info"** ➔ **"Run Anyway"**. This is normal for unsigned application binaries.*`
      });

      await updateStatus(statusMsg, '⏳ Creating Community Tier Category...');
      const communityCategory = await message.guild.channels.create({
        name: '💬 community tier',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: roles['Verified'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.AddReactions] },
          { id: roles['Support Staff'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });

      await createTextChannel(message.guild, '💬-general', communityCategory);
      await createTextChannel(message.guild, '📸-showcase', communityCategory);
      await createTextChannel(message.guild, '💡-suggestions', communityCategory);

      await updateStatus(statusMsg, '⏳ Creating Support Tier Category...');
      const supportCategory = await message.guild.channels.create({
        name: '🛠️ support tier',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: roles['Verified'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles] },
          { id: roles['Support Staff'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });

      const cFaq = await createTextChannel(message.guild, '❓-faq', supportCategory, readOnlyOverrides);
      const cBugReports = await createTextChannel(message.guild, '🐛-bug-reports', supportCategory);
      const cOpenTicket = await createTextChannel(message.guild, '🎫-open-ticket', supportCategory, readOnlyOverrides);

      const staffLogOverrides = [
        { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: roles['Support Staff'].id, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.SendMessages] },
        { id: roles['Developer'].id, allow: [PermissionsBitField.Flags.ViewChannel], deny: [PermissionsBitField.Flags.SendMessages] },
        { id: message.guild.ownerId, allow: [PermissionsBitField.Flags.ViewChannel] }
      ];
      await createTextChannel(message.guild, '📋-ticket-logs', supportCategory, staffLogOverrides);

      await cFaq.send(`❓ **Bastions Tools Frequently Asked Questions (FAQ)**

**Q: Why does Windows block the setup file?**
A: Since the app executable is compiled locally and is not yet digitally signed, Windows Defender SmartScreen blocks it. Click **"More Info"** ➔ **"Run Anyway"** to install.

**Q: Does this tool store my FTP passwords?**
A: No. All workspace connection configurations and keys are saved locally inside your private Windows AppData folder (\`app-config.json\`). They are never uploaded to our servers.

**Q: How does the auto-update work?**
A: The application automatically checks for updates on launch. When a new version is available, it downloads in the background and prompts you with a dialog box to apply the restart cleanly.

**Q: How do I activate a trial or license key?**
A: Go to **Settings ➔ Tool Customizations ➔ Premium Activation** inside the application and paste your key.`).then(m => m.pin());

      await cBugReports.send(`🐛 **How to submit a Bug Report**
If you run into an error or crash inside the editor, please post a new report using this template:

\`\`\`markdown
1. **Description:** What did the app do?
2. **Steps to Reproduce:** What buttons did you click to trigger the error?
3. **App Version:** (Check Settings ➔ App Version)
4. **Log Data:** Copy the error text or search %APPDATA%\\bastions-dayz-tools\\updater-debug.log
\`\`\`

*Please verify if your bug has already been reported before posting.*`).then(m => m.pin());

      const ticketEmbed = new EmbedBuilder()
        .setTitle('🎫 Bastions Tools Support Desk')
        .setDescription('Need assistance? Click the button below that matches your request to open a private ticket with our Support Staff.')
        .setColor('#ffbd00');

      const ticketRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_general')
          .setLabel('General Support')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎫'),
        new ButtonBuilder()
          .setCustomId('ticket_claim_premium')
          .setLabel('Claim Premium Role')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🔑'),
        new ButtonBuilder()
          .setCustomId('ticket_bug_help')
          .setLabel('Bug & Mod Help')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🐛')
      );

      await cOpenTicket.send({ embeds: [ticketEmbed], components: [ticketRow] });

      await updateStatus(statusMsg, '⏳ Creating Bastions Mods Category...');
      const modsCategory = await message.guild.channels.create({
        name: '📦 bastions mods',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: roles['Verified'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles] },
          { id: roles['Support Staff'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });

      const cModAnnounce = await createTextChannel(message.guild, '📢-mod-announcements', modsCategory, readOnlyOverrides);
      const cBitcoinHeist = await createTextChannel(message.guild, '🪙-bitcoin-heist', modsCategory);
      const cMVSBastions = await createTextChannel(message.guild, '🦺-mvs-bastions-edition', modsCategory);
      await createTextChannel(message.guild, '🤝-mod-support', modsCategory);
      await createTextChannel(message.guild, '💡-mod-suggestions', modsCategory);

      await cModAnnounce.send('📢 **Bastions Mod Updates & Releases**\nFollow this channel for announcements, updates, patches, and configurations for our community mods.');
      
      await cBitcoinHeist.send(`🪙 **Bitcoin Heist Mod — Overview & Configs**
Welcome to the official channel for the **Bitcoin Heist** mod! 

- Configure Crypto Mining USB Drives, Bitcoin ATMs, and Hackable Terminals directly using the **Bitcoin Heist** module inside Bastions Tools.
- Share your spawn coordinates, custom terminal event settings, and ATM exchange rates here!

🔗 **Steam Workshop Link:** <https://steamcommunity.com/sharedfiles/filedetails/?id=3750034137>`).then(m => m.pin());

      await cMVSBastions.send(`🦺 **Modular Vest System — Bastions Edition — Overview & Configs**
Welcome to the official channel for the **Modular Vest System - Bastions Edition** mod!

- Configure vest attachments, loadout presets, item slot scales, and weight configurations using the editor tools inside Bastions Tools.
- Share your preset setups, slot modifications, and custom loadout configs here!

🔗 **Steam Workshop Link:** <https://steamcommunity.com/sharedfiles/filedetails/?id=3748668435>`).then(m => m.pin());

      await updateStatus(statusMsg, '⏳ Creating Locked Premium Category...');
      const premiumCategory = await message.guild.channels.create({
        name: '👑 premium lounge',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: everyoneRole.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: roles['Premium Holder'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles] },
          { id: roles['Support Staff'].id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });

      const cPremChat = await createTextChannel(message.guild, '🔥-premium-chat', premiumCategory);
      await createTextChannel(message.guild, '🎯-premium-feedback', premiumCategory);
      const cPrioritySupport = await createTextChannel(message.guild, '🚨-priority-support', premiumCategory, readOnlyOverrides);

      await cPremChat.send('🔥 **Welcome to the VIP lounge!**\nThank you for activating your Premium license. This chat is exclusive to paid holders and developers. Chat freely!');
      
      const premTicketEmbed = new EmbedBuilder()
        .setTitle('🚨 Priority Support Ticket')
        .setDescription('Active premium license holders get fast, dedicated assistance from the developers.\nClick the button below to open a priority support ticket.')
        .setColor('#ff6b00');

      const premTicketRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('create_premium_ticket')
          .setLabel('Open Priority Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🚨')
      );

      await cPrioritySupport.send({ embeds: [premTicketEmbed], components: [premTicketRow] });

      await updateStatus(statusMsg, '✅ **Server Configuration Completed Successfully!**\n\n- Created roles: Owner, Developer, Support Staff, Premium Holder, Trial User, Verified.\n- Created categories & channels including hidden **#📋-ticket-logs**.\n- Configured **button verification**, **multiticket selection**, and **logs**.');

    } catch (error) {
      console.error(error);
      await updateStatus(statusMsg, `❌ **Setup Failed:** ${error.message}`);
    }
  }
});

// ─── Interaction (Button/Modal) Handler ──────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  const { member, guild } = interaction;

  // A. HANDLE BUTTON INTERACTIONS
  if (interaction.isButton()) {
    const { customId } = interaction;

    // 1. ACCOUNT VERIFICATION
    if (customId === 'verify_user') {
      const verifiedRole = guild.roles.cache.find(r => r.name === 'Verified');
      if (!verifiedRole) {
        return interaction.reply({ content: '❌ The "Verified" role does not exist.', ephemeral: true });
      }

      if (member.roles.cache.has(verifiedRole.id)) {
        return interaction.reply({ content: 'ℹ️ You are already verified!', ephemeral: true });
      }

      try {
        await member.roles.add(verifiedRole);
        return interaction.reply({ content: '✅ **Verification successful!** You have unlocked the community channels.', ephemeral: true });
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: '❌ Failed to assign Verified role. Contact staff.', ephemeral: true });
      }
    }

    // 2. CLAIM PREMIUM (MODAL POPUP)
    if (customId === 'ticket_claim_premium') {
      const modal = new ModalBuilder()
        .setCustomId('claim_premium_modal')
        .setTitle('Claim Premium / Trial Role');

      const keyInput = new TextInputBuilder()
        .setCustomId('license_key_input')
        .setLabel('License or Trial Key:')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('BSTD-XXXX-XXXX-XXXX')
        .setMinLength(15)
        .setMaxLength(25)
        .setRequired(true);

      const actionRow = new ActionRowBuilder().addComponents(keyInput);
      modal.addComponents(actionRow);

      return await interaction.showModal(modal);
    }

    // 3. TICKET CREATIONS (General, Bug Help, Priority Support)
    const ticketTypes = ['ticket_general', 'ticket_bug_help', 'create_premium_ticket'];
    if (ticketTypes.includes(customId)) {
      await interaction.deferReply({ ephemeral: true });

      const isPremium = customId === 'create_premium_ticket';
      const supportStaffRole = guild.roles.cache.find(r => r.name === 'Support Staff');
      const categoryName = isPremium ? '👑 premium lounge' : '🛠️ support tier';
      const category = guild.channels.cache.find(c => c.name.toLowerCase() === categoryName && c.type === ChannelType.GuildCategory);

      if (!category) {
        return interaction.editReply(`❌ Target category "${categoryName}" not found.`);
      }

      try {
        const permissionOverwrites = [
          { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.EmbedLinks] }
        ];

        if (supportStaffRole) {
          permissionOverwrites.push({ id: supportStaffRole.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
        }

        let prefix = 'support';
        let title = 'General Support Ticket';
        let description = `Hello ${member}! Welcome to your support ticket. Please explain your issue or question in detail.`;
        let color = '#ffbd00';

        if (customId === 'ticket_bug_help') {
          prefix = 'bug-help';
          title = '🐛 Bug & Mod Support';
          description = `Hello ${member}! Please explain the bug or mod issue you are experiencing.\n- Share screenshots or logs.\n- Copy updater-debug.log from AppData if applicable.`;
          color = '#6b7280';
        } else if (isPremium) {
          prefix = 'priority';
          title = '🚨 Priority Premium Support';
          description = `Hello ${member}! As an active premium customer, you have opened a priority ticket. Developers will assist you shortly.`;
          color = '#ff6b00';
        }

        const cleanUsername = member.user.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
        const ticketChannel = await guild.channels.create({
          name: `${prefix}-${cleanUsername}`,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites
        });

        const welcomeEmbed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(`${description}\n\n*Click the button below to close this ticket.*`)
          .setColor(color);

        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
        );

        await ticketChannel.send({ embeds: [welcomeEmbed], components: [closeRow] });

        // LOG TICKET OPENING
        const logChannel = guild.channels.cache.find(c => c.name === '📋-ticket-logs');
        if (logChannel) {
          logChannel.send(`🟢 **Ticket Opened:** ${ticketChannel} was created by ${member} (Type: ${title}).`);
        }

        return interaction.editReply(`✅ Ticket created successfully: ${ticketChannel}`);
      } catch (err) {
        console.error(err);
        return interaction.editReply('❌ Failed to open a ticket.');
      }
    }

    // 4. TICKET CLOSURE & TRANSCRIPT GENERATION
    if (customId === 'close_ticket') {
      const channelName = interaction.channel.name;
      const isAuthorized = member.permissions.has(PermissionsBitField.Flags.ManageChannels) || channelName.includes(member.user.username.toLowerCase());

      if (!isAuthorized) {
        return interaction.reply({ content: '❌ You do not have permission to close this ticket.', ephemeral: true });
      }

      await interaction.reply('⏳ **Generating transcript and closing ticket in 5 seconds...**');

      try {
        // Fetch up to 100 messages for transcript
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const sortedMessages = Array.from(messages.values()).reverse();
        
        let transcriptText = `==================================================\n`;
        transcriptText += `TRANSCRIPT FOR SUPPORT TICKET: #${channelName}\n`;
        transcriptText += `Closed By: ${member.user.tag} (${member.id})\n`;
        transcriptText += `Closed At: ${new Date().toUTCString()}\n`;
        transcriptText += `==================================================\n\n`;

        for (const msg of sortedMessages) {
          // Ignore welcome button message logs to keep transcript clean
          if (msg.author.bot && msg.components.length > 0) continue;
          
          const time = msg.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '');
          const atts = msg.attachments.size > 0 ? ` [Attachment: ${msg.attachments.first().url}]` : '';
          transcriptText += `[${time}] ${msg.author.tag}: ${msg.content}${atts}\n`;
        }

        const logChannel = guild.channels.cache.find(c => c.name === '📋-ticket-logs');
        if (logChannel) {
          // Send log message
          const embed = new EmbedBuilder()
            .setTitle(`🔴 Ticket Closed: #${channelName}`)
            .setDescription(`Ticket closed and deleted by ${member}. Transcript compiled successfully.`)
            .setColor('#ef4444')
            .setTimestamp();

          // If transcript is short, post it inline. If it's long, upload as .txt attachment
          if (transcriptText.length < 1800) {
            embed.addFields({ name: 'Conversation history', value: `\`\`\`\n${transcriptText.slice(0, 1024)}\n\`\`\`` });
            await logChannel.send({ embeds: [embed] });
          } else {
            const buffer = Buffer.from(transcriptText, 'utf-8');
            await logChannel.send({
              content: `🔴 **Ticket Closed:** \`#${channelName}\` was closed by ${member}. Full transcript log:`,
              files: [{ attachment: buffer, name: `transcript-${channelName}.txt` }]
            });
          }
        }
      } catch (transErr) {
        console.error('Failed to compile transcript:', transErr);
      }

      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch (err) {
          console.error('Failed to delete channel:', err);
        }
      }, 5000);
    }
  }

  // B. HANDLE MODAL SUBMISSIONS (LICENSE CLAIMS)
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'claim_premium_modal') {
      await interaction.deferReply({ ephemeral: true });

      const key = interaction.fields.getTextInputValue('license_key_input').trim().toUpperCase();
      const premiumRole = guild.roles.cache.find(r => r.name === 'Premium Holder');
      const trialRole = guild.roles.cache.find(r => r.name === 'Trial User');

      if (!premiumRole || !trialRole) {
        return interaction.editReply('❌ Support roles not found.');
      }

      const result = await processVerification(member, key, premiumRole, trialRole);
      
      // LOG LICENSE CLAIM STATUS
      const logChannel = guild.channels.cache.find(c => c.name === '📋-ticket-logs');
      if (logChannel) {
        logChannel.send(`🔑 **License Claim Attempt:** ${member} submitted key \`${key.slice(0, 9)}-XXXX\` -> ${result.valid ? '✅ Success' : '❌ Failed'} (${result.message})`);
      }

      if (result.valid) {
        return interaction.editReply(`🎉 **Success:** ${result.message}`);
      } else {
        return interaction.editReply(`❌ **Failed:** ${result.message}`);
      }
    }
  }
});

// ─── Helper Functions ────────────────────────────────────────────────────────
async function processVerification(member, key, premiumRole, trialRole) {
  // 1. Local check for trial keys
  if (APPROVED_TRIAL_KEYS.has(key)) {
    if (member.roles.cache.has(trialRole.id)) {
      return { valid: true, message: 'You already have the **Trial User** role!' };
    }
    try {
      await member.roles.add(trialRole);
      return { valid: true, message: 'Trial key validated! The **Trial User** role has been added to your account.' };
    } catch (err) {
      console.error(err);
      return { valid: false, message: 'Failed to assign Trial role. Bot hierarchy is too low.' };
    }
  }

  // 2. Live API check for Lemon Squeezy licenses
  try {
    const response = await fetch('https://bastions-dayz-tools.vercel.app/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: key })
    });

    if (!response.ok) {
      return { valid: false, message: `Validation server error (${response.statusText})` };
    }

    const data = await response.json();
    if (data.success && data.valid) {
      if (member.roles.cache.has(premiumRole.id)) {
        return { valid: true, message: 'You already have the **Premium Holder** role!' };
      }
      await member.roles.add(premiumRole);
      return { valid: true, message: 'License key verified! The **Premium Holder** role has been assigned.' };
    } else {
      return { valid: false, message: data.error || 'Invalid license key.' };
    }
  } catch (err) {
    console.error(err);
    return { valid: false, message: 'Network error contacting validation endpoint.' };
  }
}

async function updateStatus(msg, text) {
  try {
    if (!client.channels.cache.has(msg.channelId)) {
      await client.channels.fetch(msg.channelId).catch(() => {});
    }
    await msg.edit(text);
  } catch (e) {
    console.log(`[Status] ${text.replace(/\*\*/g, '')}`);
  }
}

async function createTextChannel(guild, name, category, permissionOverwrites = []) {
  return await guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites
  });
}

client.login(process.env.DISCORD_TOKEN);

// Clean exit handlers
const handleShutdown = () => {
  console.log('\n🤖 Logging out and shutting down...');
  try {
    client.destroy();
  } catch (e) {
    console.error('Error during client destruction:', e);
  }
  process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
