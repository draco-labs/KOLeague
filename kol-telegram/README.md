# ELIZA & TELEGRAM BOT KOL README

<p align="center">
  <img src="/Users/yondraco/Documents/hackathon/StarkNest/kol-telegram/static/logo.jpg" alt="KOL Chat Agent" width="200">
</p>

## Table of Contents
1. [Overview](#overview)
2. [Eliza](#eliza)
   - [Installation](#installation)
3. [Telegram](#telegram)
   - [Creating a Telegram Bot & Getting the Token](#creating-a-telegram-bot--getting-the-token)
   - [Configuring the Agent KOL](#configuring-the-agent-kol)
   - [Running the Project](#running-the-project)

---

## Overview
This guide explains how to integrate and run KOL bots on the **Eliza** and **Telegram** platforms simultaneously. You can create multiple **characters** (KOLs) tailored to your needs. Below is what this includes:

- Links to the official **Eliza** documentation.
- Instructions for generating a token for your Telegram bot.
- Guidance on creating a `characters` folder with detailed JSON configuration files for each KOL.
- Commands to run the application.

---

## Eliza

### Installation
Please refer to the Eliza Quickstart guide at [Eliza Docs Quickstart](https://elizaos.github.io/eliza/docs/quickstart/) to set up your environment, run a demo, and get familiar with the framework.

---

## Telegram

### Creating a Telegram Bot & Getting the Token
1. **Create a bot on Telegram**:
   - Open the Telegram app.
   - Search for and interact with the **@BotFather** account.
   - Send the command `/newbot` to create a new bot.
   - Follow the instructions to name your bot.
   - BotFather will return an **API Token** (a code in the format `123456:ABC-xx`).

2. **Store the Token**:
   - This token will be used to configure each **KOL** in their corresponding JSON files.

### Configuring the Agent KOL
1. **Create a `characters` folder** (if it doesn't already exist).

2. **Inside the `characters` folder, create JSON files** for each KOL, e.g., `char_kol_n.json`.
   Each file should have the following structure (customize as needed):

```json
{
  "name": "KOL Name",
  "clients": ["telegram"],
  "modelProvider": "Model Provider Name",
  "settings": {
    "secrets": {
      "TELEGRAM_BOT_TOKEN": "123456:ABC-xx"
    },
    "voice": {
      "model": "Voice Model Name (optional)"
    }
  },
  "plugins": [],
  "bio": ["Short introduction about the KOL"],
  "lore": [],
  "messageExamples": [
    [
      {
        "user": "User",
        "content": {
          "text": "Example content"
        }
      },
      {
        "user": "Bot",
        "content": {
          "text": "Example response"
        }
      }
    ]
  ],
  "postExamples": [],
  "topics": [],
  "style": {
    "all": [],
    "chat": [],
    "post": []
  },
  "adjectives": []
}
```

3. **Customize the bot's response prompts**:
   - Open the `messageManager.ts` file in project.
   - Adjust prompts, response logic, and message-handling logic as required.

### Running the Project
1. **Add KOL bots to a Telegram group**:
   - Create a new group on Telegram.
   - Add all configured KOL bots (with their respective tokens) to this group.

2. **Run Eliza with the list of KOLs**:
   - For example, if there are two KOL files: `char_kol_1.json` and `char_kol_1.json` in the `characters` folder.
   - Use the following command:

```bash
pnpm start --characters="characters/char_kol_1.json,characters/char_kol_2.json"
```

3. **Verify the logs**:
   - Ensure all bots are initialized and appear in the Telegram group.


