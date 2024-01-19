<template>
  <div class="h-full">
    <MenuBar />
    <Window
      v-if="isBotConnected"
      :botName="botName"
      :botAvatar="botAvatar"
      :botDiscriminator="botDiscriminator"
      :channels="channels"
      :guilds="guilds"
      :users="directMessageUsers"
      :isBotConnected="isBotConnected"
      :client="client"
      :botToken="botToken"
      @toggleConfig="toggleConfig"
      @messageSent="messageSent"
      @displayError="displayError" />
    <transition name="fade" appear>
      <Toast :toastMessage="toastMessage" v-show="showToast" />
    </transition>
    <transition name="fade" appear>
      <ErrorToast :errorMessage="errorMessage" v-show="showError"/>
    </transition>
    <Config
      v-if="showConfig || !connectedToBot"
      :connectedToBot="connectedToBot"
      :botToken="botToken"
      @connectToDiscordBot="connectToDiscordBot"
      @toggleConfig="toggleConfig" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import MenuBar from "./components/MenuBar.vue";
import Window from "./components/Window.vue";
import Config from "./components/Config.vue";
import Toast from "./components/Toast.vue";
import ErrorToast from "./components/ErrorToast.vue";

// Import specific items from the discord.js module
const { Client, GatewayIntentBits } = require("discord.js");

// Instead of using 'require', use 'import' for electron-store
import Store from "electron-store";
const store = new Store();

// Define reactive variables using 'ref'
const botToken = ref("");
const connectedToBot = ref(false);
const botName = ref("");
const botAvatar = ref("");
const botDiscriminator = ref("");
const guilds = ref([]);
const channels = ref([]);
const directMessageUsers = ref([]);
const showConfig = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const showError = ref(false);
const errorMessage = ref("");

// Define 'emit' for emitting custom events (defineEmits is not needed)
const emit = defineEmits();

// Create the Discord client instance with intents and token
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  token: botToken,
});

// Function to show/hide the configuration window
const toggleConfig = () => {
  showConfig.value = !showConfig.value;
};

// Function to show a toast message and hide it after 3 seconds
const displayError = (error) => {
  console.log('error here', error)
  errorMessage.value = error;
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 3000);
};

// Function to show a toast message and hide it after 3 seconds
const messageSent = () => {
  toastMessage.value = "Message sent!";
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Function to connect to the Discord bot
const connectToDiscordBot = async () => {
  botToken.value = store.get("discordBotTokenStorage");

  try {
    console.log("Attempting to connect to discord bot...");
    await client.login(botToken.value);
    client.once("ready", async () => {
      const botUser = client.user;
      botAvatar.value = botUser.avatarURL();
      botName.value = botUser.username;
      botDiscriminator.value = botUser.discriminator;

      guilds.value = client.guilds.cache.map((guild) => ({
        id: guild.id,
        name: guild.name,
      }));

      // Modify the channels.value array to exclude channels whose names end in " Channels"
      channels.value = client.channels.cache
        .filter((channel) => !channel.name.endsWith(" Channels"))
        .map((channel) => ({
          id: channel.id,
          name: channel.name,
        }));

      connectedToBot.value = true;
    });
  } catch (error) {
    connectedToBot.value = false;
    console.error("Error connecting to Discord bot:", error);
  } finally {
    // The 'toggleConfig' call is commented out as it's not used in the code
    // toggleConfig();
  }
};


// Define a reactive variable to track whether the bot is connected or not
const isBotConnected = ref(false);

// Execute the 'connectToDiscordBot' function on component mount
onMounted(async () => {
  try {
    await connectToDiscordBot();
    isBotConnected.value = true;
  } catch (error) {
    console.error("Error connecting to Discord bot:", error);
    isBotConnected.value = false;
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
