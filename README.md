# Discord Bot Messenger

Discord Bot Messenger is a cross-platform (Windows, Linux, macOS) desktop application designed to simplify the process of sending messages from a Discord Bot to a specific channel on a server. This application is built using Electron, Vue, and Vite, providing a user-friendly GUI for efficient interaction with Discord bots.

![](https://i.imgur.com/2E4yli8.png)

## Features

- User-friendly GUI for easy message sending.
- Cross-platform compatibility, supporting Windows, Linux, and macOS.
- Seamless integration with Discord bots using the Discord.js library.
- Simplified setup and configuration using Electron, Vue, and Vite.
- Bot Token gets stored to local appdata for security and persistence.
- Real-time bot status updates: While the app is open and the bot token is active, the Bot will appear online on Discord.

## Installation

Before running the application, ensure you have the following dependencies installed:

- Node.js
- npm (Node Package Manager)

Follow these steps to install Discord Bot Messenger:

1. Clone this repository to your local machine.
2. Navigate to the project directory and install the required dependencies:


## Project setup
```
npm install
```

### To build the application for production and create distributable packages for different platforms
```
npm run build
```

### To run the application in development mode
```
npm run dev
```

## Usage

1. After launching Discord Bot Messenger, you will be prompted to configure your Discord bot's token. Provide the required information to establish a connection.

2. Once the bot is connected, you can select the target server and channel from the GUI.

3. Type your message in the designated input field and hit the send button to dispatch the message from the bot to the chosen channel.

## Dependencies
- `discord.js`: A powerful library for interacting with the Discord API and building Discord bots.
- `electron-store`: A simple data store for Electron applications.
- `@vitejs/plugin-vue`: A Vue.js plugin for Vite, enabling Vue components in the project.
- `electron`: The Electron framework for building cross-platform desktop applications.
- `electron-builder`: A plugin for Electron apps to package and build distributable packages.
- `vite`: A build tool that serves as the frontend development server for the application.
- `vite-plugin-electron`: A Vite plugin for Electron integration.
- `vite-plugin-electron-renderer`: A Vite plugin for Electron renderer process integration.
- `vue`: The Vue.js framework for building user interfaces.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Author

Discord Bot Messenger is developed by John Uberbacher.

## Contributions

Contributions to this project are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or create a pull request on the GitHub repository.

Happy messaging with your Discord bot! :rocket:
