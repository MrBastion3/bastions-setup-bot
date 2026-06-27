# Bastions Tools — Discord Auto-Setup Bot

This is a lightweight Discord.js v14 bot designed to instantly construct the entire roles, categories, and channels infrastructure for the Bastions Tools community server.

---

## 🛠️ Step-by-Step Installation

### Step 1: Create a Discord Application
1. Go to the **[Discord Developer Portal](https://discord.com/developers/applications)**.
2. Click **New Application** in the top right, name it "Bastions Setup Bot", and save.
3. In the left sidebar, click **Bot**, scroll down, and click **Add Bot**.

### Step 2: Configure Bot Permissions & Intents
1. Under the **Bot** settings page:
   - Turn **ON** **"Message Content Intent"** (under Privileged Gateway Intents). This allows the bot to read the setup command.
2. Under **OAuth2 ➔ URL Generator** in the left sidebar:
   - Select the `bot` scope.
   - Select **`Administrator`** in the bot permissions grid.
   - Copy the generated URL at the bottom and open it in a browser tab to invite the bot to your Discord server.

### Step 3: Local Configuration
1. Rename `.env.example` to `.env` in this directory.
2. In the **Bot** settings page in the Developer Portal, click **Reset Token** and copy the token string.
3. Paste this token into your `.env` file:
   ```env
   DISCORD_TOKEN=your_token_here
   ```

### Step 4: Run the Bot
Open your terminal inside this `discord-setup-bot` directory and run:

```bash
# Install dependencies
npm install

# Start the bot
npm start
```
You will see: `🤖 Bot is online as Bastions Setup Bot#XXXX!`.

---

## 📢 Running the Setup

1. Open your Discord server.
2. Go to any text channel and type:
   ```
   !setup-bastions
   ```
3. The bot will automatically:
   - Scaffold the `@everyone` role limits (read-only base).
   - Generate roles: `Owner`, `Developer`, `Support Staff`, `Premium Holder`, `Trial User`, and `Verified`.
   - Scaffold categories: Welcome Area, Community Tier, Support Tier, and Premium Lounge.
   - Inject the channels and lock the Premium lounge channels automatically.
4. Once completed, you can shut down the bot. It is no longer needed unless you want to re-run the setup on a new server.
