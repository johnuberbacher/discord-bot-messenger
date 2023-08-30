<template>
  <div class="window-content">
    <div class="flex flex-row gap-1">
      <div class="w-full flex flex-row items-center gap-1">
        <div
          class="bot-avatar"
          style="
            background-image: url('/assets/discord-bot-messenger.png');
          "
          :style="{ backgroundImage: `url(${props.botAvatar})` }">
          <div class="bot-status" :class="{ active: selectedGuild }"></div>
        </div>
        <div class="flex flex-column w-full">
          <div class="bot-title">
            {{ props.botName ?? "error" }}
            {{ props.botDiscriminator ? "#" + props.botDiscriminator : "" }}
          </div>
          <div v-if="selectedGuild" class="bot-guild">
            {{ selectedGuild ?? "error" }}
          </div>
        </div>
      </div>
      <div>
        <svg
          @click="$emit('toggleConfig')"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="icon-settings">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>
    <form class="flex flex-column gap-1" @submit.prevent="submitForm">
      <div>
        <label>Server</label>
        <div class="select">
          <select v-model="selectedGuildId" @change="onGuildSelected">
            <option value="" disabled selected hidden>
              Select a server...
            </option>
            <option v-for="guild in guilds" :key="guild.id" :value="guild.id">
              {{ guild.name }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label>Channel</label>
        <div class="select">
          <select
            v-model="selectedChannel"
            :disabled="!selectedGuildId"
            @change="onChannelSelected">
            <option value="" disabled selected hidden>
              Select a channel...
            </option>
            <option
              v-for="channel in channels"
              :key="channel.id"
              :value="channel.id">
              {{ channel.name }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label class="flex flex-row items-center justify-between">
          <span>Message</span>
          <div v-if="error" class="error">{{ error }}</div>
        </label>
        <div class="input-wrapper">
          <input
            type="text"
            v-model="message"
            :disabled="!selectedChannel || !selectedGuild"
            placeholder="Type your message here..." />
          <button
            type="submit"
            :class="{ disabled: !isValidForm }"
            :disabled="!isValidForm || !selectedChannel || !selectedGuild">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </form>
    <div class="footer">
      Discord Bot Messenger is a fan-made service created by John Uberbacher.
      This app is not affiliated with or endorsed by Discord, and no ownership
      or rights are claimed.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const emit = defineEmits();
const props = defineProps([
  "botName",
  "botAvatar",
  "botDiscriminator",
  "guilds",
  "channels",
  "botToken",
  "client",
]);

// State variables
const selectedGuildId = ref("");
const selectedChannel = ref("");
const error = ref("");
const message = ref("");

// Computed property to get the name of the selected guild
const selectedGuild = computed(() => {
  const selectedGuildObj = props.guilds.find(guild => guild.id === selectedGuildId.value);
  return selectedGuildObj?.name || "";
});

// Computed property to check if the form is valid
const isValidForm = computed(() => {
  return selectedChannel.value && message.value.trim() && selectedGuildId.value !== "";
});

// Method to submit the form and send the message
const submitForm = () => {
  if (isValidForm.value) {
    // Find the selected channel object
    const selectedChannelObj = props.channels.find(channel => channel.id === selectedChannel.value);

    if (selectedChannelObj) {
      // Send the message using the client instance and appropriate methods
      props.client.channels.cache
        .get(selectedChannelObj.id)
        .send(message.value.trim())
        .then(() => {
          // Message sent successfully
          emit("messageSent");
          // Clear the message input field
          message.value = "";
        })
        .catch(error => {
          console.error("Error sending message:", error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.window-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 1rem;
  gap: 1rem;
  height: calc(100% - 22px);
  overflow: hidden;
  max-width: 530px;
  margin: auto;
  > div:last-of-type {
    text-align: center;
  }
  .bot-avatar {
    position: relative;
    background-color: var(--base-500);
    width: 64px;
    height: 64px;
    min-width: 64px;
    min-height: 64px;
    border-radius: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    .bot-status {
      z-index: 2;
      position: absolute;
      bottom: -0.15rem;
      right: -0.15rem;
      border-radius: 100%;
      background-color: var(--base-danger);
      border: 0.3rem solid var(--base-200);
      width: 1.25rem;
      height: 1.25rem;
      &.active {
        background-color: var(--base-success);
      }
    }
  }
  .bot-title {
    font-size: 18px;
    font-family: "gg sans bold", sans-serif;
    color: var(--base-text);
  }
  .bot-guild {
    font-size: 12px;
    font-family: "gg sans semibold", sans-serif;
  }
}
</style>
