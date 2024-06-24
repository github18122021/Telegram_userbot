# Telegram Bot with User Status Monitoring

This project demonstrates how to create a Telegram bot using Node.js that monitors user statuses and listens for commands. The bot uses the `telegram` library to interact with the Telegram API.

## Prerequisites

Before running the bot, ensure you have the following:

- Node.js installed on your machine.
- A Telegram API ID and Hash. You can obtain these by creating a Telegram application at [my.telegram.org](https://my.telegram.org).
- Environment variables set up:
  - `TG_API_ID`: Your Telegram API ID.
  - `TG_API_HASH`: Your Telegram API hash.
  - `TG_STRING_SESSION`: Optional, stores the session string for persistent login.

## Setup

1. Clone this repository:

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API credentials:

   ```
   TG_API_ID=your_api_id
   TG_API_HASH=your_api_hash
   TG_STRING_SESSION=your_initial_session_string_if_any
   ```

## Usage

To start the bot, run:

```bash
node index.js
```

### Functionality

- **Login and Session Management:** Handles initial login and saves session for subsequent runs.
- **User Status Monitoring:** Retrieves and categorizes user statuses into online, recently online, etc.
- **Command Handling:** Listens for specific commands from users and responds accordingly.

### Events

The bot listens for the following events:

- **Draft Message Updates:** Monitors draft messages.
- **Short Message Updates:** Handles incoming short messages.

## Files

- **index.js:** Main script that initializes the bot and handles logic.
- **stored_users.json:** JSON file storing all users' basic details.
- **online_users.json, recently_online_users.json, week_before_online_users.json, month_before_online_users.json:** JSON files categorizing users based on their online status.

### Future Enhancements

- Implement more commands and event handlers based on your bot's specific use case.
- Improve error handling and logging for better reliability.
