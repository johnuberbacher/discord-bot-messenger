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
            v-model="boooootStorageItem"
            ref="botTokenInput"
          />
        </div>
      </div>
      <div class="w-full flex flex-row items-center justify-between gap-1">
        <div class="error w-full">{{ error ?? "" }}</div>
        <div class="flex flex-row gap-1">
          <button class="button button-link" @click="dismissConfig">
            Cancel
          </button>
          <button class="button button-primary" @click="saveConfig">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";

const Store = require("electron-store");
const store = new Store();
const props = defineProps(["connectedToBot", "botToken"]);
const emit = defineEmits();

const error = ref("");
const isShaking = ref(false);

// Set the initial value of boooootStorageItem from the store on component load
let boooootStorageItem = store.get("boooootStorageItem");

const shake = () => {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 250);
};

const validateBotConnection = () => {
  if (!props.connectedToBot) {
    error.value = `Invalid Bot Token, please try again`;
    shake();
    return false;
  }
  return true;
};

const saveConfig = async () => {
  if (!boooootStorageItem || boooootStorageItem.length < 12) {
    error.value = "Please enter a valid bot token";
    shake();
    return;
  }
  // Add a one-second delay here
  await new Promise(resolve => setTimeout(resolve, 1000));

  await store.set("boooootStorageItem", boooootStorageItem);
  
  // Add a one-second delay here
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await emit("connectToDiscordBot");

  if (!validateBotConnection()) {
    console.log('deleting local storage!')
    store.delete("boooootStorageItem");
    return;
  } else {
    console.log('lets gooooo!')
    error.value = "";
    emit("toggleConfig");
  }
};


const dismissConfig = () => {
  if (!store.get("boooootStorageItem")) {
    error.value = "Please enter a bot token";
    shake();
    return;
  }

  if (!validateBotConnection()) {
    return;
  }

  error.value = "";
  emit("toggleConfig");
};

onMounted(() => {
  // Set the initial value of boooootStorageItem from the store on component load
  console.log('getting load:', store.get("boooootStorageItem"))
  boooootStorageItem = store.get("boooootStorageItem");
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
  .shake {
    animation: shake 250ms 1 linear;
    -moz-animation: shake 250ms 1 linear;
    -webkit-animation: shake 250ms 1 linear;
    -o-animation: shake 250ms 1 linear;
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
