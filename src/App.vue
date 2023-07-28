<template>
  <div>
    <MenuBar />
    <Window
      v-if="isBotConnected"
      :botName="botName"
      :botAvatar="botAvatar"
      :botDiscriminator="botDiscriminator"
      :channels="channels"
      :guilds="guilds"
      :isBotConnected="isBotConnected"
      :client="client"
      :botToken="botToken"
      @toggleConfig="toggleConfig"
      @messageSent="messageSent" />
    <transition name="fade" appear>
      <Toast :toastMessage="toastMessage" v-show="showToast" />
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

const { Client, GatewayIntentBits } = require("discord.js");
const Store = require("electron-store");
const store = new Store();

let botToken = ref("");
const emit = defineEmits();

const connectedToBot = ref(false);
const botName = ref("");
const botAvatar = ref("");
const botDiscriminator = ref("");
const guilds = ref([]);
const channels = ref([]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  token: botToken,
});

const showConfig = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

const toggleConfig = () => {
  showConfig.value = !showConfig.value;
};

const messageSent = () => {
  toastMessage.value = "Message sent!";
  showToast.value = !showToast.value;
  setTimeout(() => {
    showToast.value = !showToast.value;
  }, 3000); // 3 seconds (3000 milliseconds)
};

const connectToDiscordBot = async () => {
  console.log("Fetching bot token from store...");
  botToken =  store.get("boooootStorageItem");
  console.log("Retreived bot token:", botToken);

  try {
    console.log("Attempting to connect to discord bot...");
    await client.login(botToken);
    console.log("attempting to connect to Discord with bot token:", botToken);
    client.once("ready", async () => {
      console.log("Discord bot connected!");
      const botUser = client.user;
      botAvatar.value = botUser.avatarURL();
      botName.value = botUser.username;
      botDiscriminator.value = botUser.discriminator;

      guilds.value = client.guilds.cache.map((guild) => ({
        id: guild.id,
        name: guild.name,
      }));

      channels.value = client.channels.cache.map((channel) => ({
        id: channel.id,
        name: channel.name,
      }));

      console.log(botUser);
      connectedToBot.value = true;
      console.log("Discord bot ready");
    });
  } catch (error) {
    connectedToBot.value = false;
    console.error("Error connecting to Discord bot:", error);
  } finally {
    // toggleConfig();
  }
};

const isBotConnected = ref(false);
onMounted(async () => {
  console.log("onMounted hook called");
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
