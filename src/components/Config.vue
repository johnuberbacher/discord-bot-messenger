<template>
  <div class="config shadow" @click.self="dismissConfig">
    <div
      class="config-window flex flex-column gap-1 items-end shadow"
      @click.stop
      :class="{ shake: isShaking }">
      <div class="w-full">
        <label> Discord Bot Token </label>
        <div class="input-wrapper">
          <input
            type="text"
            @keyup.enter="saveConfig"
            placeholder="Enter your Discord Bot Token to get started..."
            v-model="discordBotTokenStorage" />
        </div>
      </div>
      <div class="w-full flex flex-row items-center justify-between gap-1">
        <div class="error w-full">{{ error ?? "" }}</div>
        <div class="flex flex-row gap-1">
          <button
            class="button button-link"
            @click="dismissConfig"
            :disabled="isLoading">
            Cancel
          </button>
          <button
            class="button button-primary"
            @click="saveConfig"
            :disabled="isLoading">
            <span v-if="!isLoading">Save</span
            ><span v-if="isLoading"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";

// Import electron-store directly instead of using require (CommonJS) syntax
import Store from "electron-store";
const store = new Store();

// Define component props and emit function
const props = defineProps(["connectedToBot", "botToken"]);
const emit = defineEmits();

// Reactive variables using the ref function
let isLoading = ref(false);
let error = ref("");
let isShaking = ref(false);

// Set the initial value of discordBotTokenStorage from the store on component load
let discordBotTokenStorage = ref(store.get("discordBotTokenStorage"));

// Function to shake the component for visual feedback
const shake = () => {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 250);
};

// Function to validate bot connection and show errors
const validateBotConnection = () => {
  if (!props.connectedToBot) {
    error.value = `Invalid Bot Token, please try again`;
    shake();
    isLoading.value = false;
    return false;
  }
  return true;
};

// Function to save the bot configuration
const saveConfig = async () => {
  isLoading.value = true;

  if (!discordBotTokenStorage.value || discordBotTokenStorage.value.length < 12) {
    error.value = "Please enter a valid bot token";
    shake();
    isLoading.value = false;
    return;
  }

  // Save the bot token to the store
  await store.set("discordBotTokenStorage", discordBotTokenStorage.value);

  // Add a one-second delay here
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Emit the "connectToDiscordBot" event to notify the parent component
  await emit("connectToDiscordBot");

  // Add a one-second delay here
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check bot connection validation and proceed accordingly
  if (validateBotConnection()) {
    error.value = "";
    isLoading.value = false;
    emit("toggleConfig");
  }
};

// Function to dismiss the configuration without saving
const dismissConfig = () => {
  if (!store.get("discordBotTokenStorage")) {
    error.value = "Please enter a bot token";
    shake();
    isLoading.value = false;
    return;
  }

  error.value = "";
  emit("toggleConfig");
};

// When the component is mounted, update the discordBotTokenStorage value from the store
onMounted(() => {
  discordBotTokenStorage.value = store.get("discordBotTokenStorage");
});
</script>

<style scoped lang="scss">
.config {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 3;
  padding: 1rem 2rem;
  top: 22px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  > div {
    width: 100%;
    max-width: calc(530px - 8rem);
    margin: 0px;
    padding: 1rem;
    border-radius: 3px;
    background-color: var(--base-200);
    font-family: "gg sans", sans-serif;
    font-size: 12px;
    color: var(--base-text-label);
  }
  .input-wrapper input {
    padding: 0px 16px;
    border-radius: 8px;
  }
  .button {
    &.button-primary {
      min-width: 65px;
      position: relative;
      display: block;
      svg {
        animation: 1.5s linear infinite spinner;
        width: 1.5rem;
        height: 1.5rem;
        min-width: 1.5rem;
        min-height: 1.5rem;
        position: absolute;
      }
    }
  }
  .shake {
    animation: shake 250ms 1 linear;
    -moz-animation: shake 250ms 1 linear;
    -webkit-animation: shake 250ms 1 linear;
    -o-animation: shake 250ms 1 linear;
  }
}

@keyframes spinner {
  0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
  }
}

@keyframes shake {
  0% {
    transform: translate(3px, 0);
  }
  10% {
    transform: translate(0, 3px);
  }
  20% {
    transform: translate(-3px, 0);
  }
  30% {
    transform: translate(0, -3px);
  }
  40% {
    transform: translate(2px, 3px);
  }
  50% {
    transform: translate(-1px, -2px);
  }
  60% {
    transform: translate(3px, 2px);
  }
  70% {
    transform: translate(-2px, -1px);
  }
  80% {
    transform: translate(1px, 3px);
  }
  90% {
    transform: translate(-3px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@-moz-keyframes shake {
  0% {
    transform: translate(3px, 0);
  }
  10% {
    transform: translate(0, 3px);
  }
  20% {
    transform: translate(-3px, 0);
  }
  30% {
    transform: translate(0, -3px);
  }
  40% {
    transform: translate(2px, 3px);
  }
  50% {
    transform: translate(-1px, -2px);
  }
  60% {
    transform: translate(3px, 2px);
  }
  70% {
    transform: translate(-2px, -1px);
  }
  80% {
    transform: translate(1px, 3px);
  }
  90% {
    transform: translate(-3px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@-webkit-keyframes shake {
  0% {
    transform: translate(3px, 0);
  }
  10% {
    transform: translate(0, 3px);
  }
  20% {
    transform: translate(-3px, 0);
  }
  30% {
    transform: translate(0, -3px);
  }
  40% {
    transform: translate(2px, 3px);
  }
  50% {
    transform: translate(-1px, -2px);
  }
  60% {
    transform: translate(3px, 2px);
  }
  70% {
    transform: translate(-2px, -1px);
  }
  80% {
    transform: translate(1px, 3px);
  }
  90% {
    transform: translate(-3px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@-ms-keyframes shake {
  0% {
    transform: translate(3px, 0);
  }
  10% {
    transform: translate(0, 3px);
  }
  20% {
    transform: translate(-3px, 0);
  }
  30% {
    transform: translate(0, -3px);
  }
  40% {
    transform: translate(2px, 3px);
  }
  50% {
    transform: translate(-1px, -2px);
  }
  60% {
    transform: translate(3px, 2px);
  }
  70% {
    transform: translate(-2px, -1px);
  }
  80% {
    transform: translate(1px, 3px);
  }
  90% {
    transform: translate(-3px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@-o-keyframes shake {
  0% {
    transform: translate(3px, 0);
  }
  10% {
    transform: translate(0, 3px);
  }
  20% {
    transform: translate(-3px, 0);
  }
  30% {
    transform: translate(0, -3px);
  }
  40% {
    transform: translate(2px, 3px);
  }
  50% {
    transform: translate(-1px, -2px);
  }
  60% {
    transform: translate(3px, 2px);
  }
  70% {
    transform: translate(-2px, -1px);
  }
  80% {
    transform: translate(1px, 3px);
  }
  90% {
    transform: translate(-3px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
