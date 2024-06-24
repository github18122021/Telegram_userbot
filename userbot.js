const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
require('dotenv').config();
const fs = require('fs');
const { start } = require('repl');

const apiId = parseInt(process.env.TG_API_ID, 10);
const apiHash = process.env.TG_API_HASH;
let stringSession = process.env.TG_STRING_SESSION;

const client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, { connectionRetries: 5 });


async function main() {
  try {
    // Check if stringSession exists 
    if (!stringSession) {
      await loginAndSaveSession();
    } else {
      // If session exists, connect to Telegram
      await client.connect();

      console.log('Bot started.');

      // Run bot logic
      await runBotLogic();
    }
  } catch (error) {
    console.error('Failed to start the bot:', error);
  } finally {
    // Ensure client disconnects after use (optional)
    // await client.disconnect();
  }
}

async function loginAndSaveSession() {
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () => await input.text('Please enter the code you received: '),
    onError: (err) => console.error('Error:', err),
  });

  // Save session string after successful login
  stringSession = client.session.save();
  console.log('Saving session string to environment variable...');

  //saving explicitly 
  console.log(stringSession);

  // Connect client after saving session
  await client.connect();
}


async function runBotLogic() {

  // getStatusOfAllUsers();
  // startListeningForMessages();
  startListeningForCommands();
}

async function getStatusOfAllUsers() {

  // Example: Fetch dialogs (chats and conversations)
  const dialogs = await client.getDialogs();

  // Store to store user IDs
  let storedUsers = {};
  let onlineUsers = [];
  let recentlyOnlineUsers = [];
  let weekBeforeOnlineUsers = [];
  let monthBeforeOnlineUsers = [];

  for (const dialog of dialogs) {
    const user = dialog.entity;
    if (user.className === 'User') {
      // Skip bots
      if (user.bot) {
        console.log(`Skipping bot: ${user.username || user.id}`);
        continue;
      }

      console.log(`Checking status of ${user.username || user.id}...`);

      // Fetch user info and handle status
      try {
        const fullUser = await client.getEntity(user.id);
        if (fullUser && fullUser.status) {
          console.log(`Status of ${user.username || user.id}: ${fullUser.status.className}`);

          // Store user ID with basic details for later retrieval
          storedUsers[user.id] = {
            id: user.id,
            username: user.username || '',
            first_name: fullUser.firstName || '',
            last_name: fullUser.lastName || '',
            // Add any other relevant user information you may need
          };

          if (fullUser.status.className === "UserStatusOnline") {
            onlineUsers.push(storedUsers[user.id]);
          } else if (fullUser.status.className === "UserStatusRecently") {
            recentlyOnlineUsers.push(storedUsers[user.id]);
          } else if (fullUser.status.className === "UserStatusLastWeek") {
            weekBeforeOnlineUsers.push(storedUsers[user.id]);
          }
          else if (fullUser.status.className === "UserStatusLastMonth") {
            monthBeforeOnlineUsers.push(storedUsers[user.id]);
          }

        } else {
          console.log(`Could not fetch status for ${user.username || user.id}.`);
        }
      } catch (error) {
        console.error(`Error fetching status for ${user.username || user.id}:`, error);
      }
    }
  }

  console.log('Online Users: ', onlineUsers);
  console.log('Recently Online Users: ', recentlyOnlineUsers);
  console.log('Week Before Online Users: ', weekBeforeOnlineUsers);
  console.log('Month Before Online Users: ', monthBeforeOnlineUsers);

  // Save stored users data to a file
  await saveUsersToFile('stored_users.json', storedUsers);
  await saveUsersToFile('online_users.json', onlineUsers);
  await saveUsersToFile('recently_online_users.json', recentlyOnlineUsers);
  await saveUsersToFile('week_before_online_users.json', weekBeforeOnlineUsers);
  await saveUsersToFile('month_before_online_users.json', monthBeforeOnlineUsers);
}

//   saving users to file
async function saveUsersToFile(filename, data) {
  try {
    await fs.promises.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Stored users data saved to ${filename}`);
  } catch (error) {
    console.error(`Error saving stored users data to ${filename}:`, error);
  }
}

async function startListeningForMessages() {
  // Example: Listen for new messages
  client.addEventHandler(async (event) => {
    if (event._ == 'message' && event.message) {
      const message = event.message;
      console.log(`New message from ${message.fromId}: ${message.text}`);
    }
  });

  console.log('Listening for new messages...');
}

async function startListeningForCommands() {
  // how to know whether the command is working or not ? 
  // send a message to let the user know userbot is running
  const me = await client.getMe();
  await client.sendMessage(me.id, { message: 'Userbot is now running!' });

  // command works only if user/owner of bot writes command in the chat

  client.addEventHandler(async (event) => {
    
    // check if the event is a draft message

    // writing event in a txt file to know the structure of the event

    // fs.writeFileSync('event.txt', JSON.stringify(event, null, 2));

    if(event.className === 'UpdateDraftMessage' && event.draft.message) {
      console.log('Draft message event');
      console.log(event.draft.message);
    }

    if(event.className === "UpdateShortMessage" && event.message) {
      console.log('Short message event');
      console.log(event.message);
    }
  });

  // client.disconnect();
  console.log('Listening for commands...');
}
// Run the main function
main().catch(console.error);
