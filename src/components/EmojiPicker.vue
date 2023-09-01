<template>
  <div class="emoji-picker-wrapper" ref="emojiPicker">
    <button
      type="button"
      class="button-wrapper"
      @click="showEmojiPicker = true"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled">
      <svg
        data-v-e74fd897=""
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    </button>
    <div class="emoji-picker shadow" v-if="showEmojiPicker">
      <div
        v-for="(emoji, index) in emojis"
        :key="index"
        class="emoji-item"
        @click="appendEmoji(emoji.emoji)">
        <span class="emoji">{{ emoji.emoji }}</span>
        <span class="description">{{ emoji.description }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, defineProps } from "vue";
const showEmojiPicker = ref(false);

// Import the JSON file
import emojiData from "../data/emoji.json";

// Create a ref for the emojis data
const emojis = ref([]);
const emojiPicker = ref(null);

const emit = defineEmits();
const props = defineProps(["disabled"]);

// Function to append an emoji to the message input
const appendEmoji = (emoji) => {
  showEmojiPicker.value = false;
  emit("emoji-selected", emoji);
};

// Function to close the div when clicking outside
const closeDivOnOutsideClick = (event) => {
  if (emojiPicker.value && !emojiPicker.value.contains(event.target)) {
    showEmojiPicker.value = false;
  }
};

// Populate the emojis ref with the JSON data on component mount
onMounted(() => {
  emojis.value = emojiData;
  document.addEventListener("click", closeDivOnOutsideClick);
});

// Remove the click event listener when the component is unmounted
onUnmounted(() => {
  document.removeEventListener("click", closeDivOnOutsideClick);
});
</script>
<style lang="scss" scoped>
.emoji-picker {
  position: absolute;
  z-index: 5;
  bottom: 22px;
  right: 22px;
  width: 280px;
  min-width: 280px;
  height: 200px;
  min-height: 200px;
  border-radius: 8px;
  background-color: var(--base-500);
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  align-items: center;
  grid-template-columns: 16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: var(--base-400);
    border-radius: 0px 8px 8px 0px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--base-100);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--base-text-label);
  }

  .emoji-item {
    align-items: center;
    justify-content: center;
    display: flex;
    height: 44px;
    width: 44px;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      background-color: var(--base-300);
    }
  }
  .description {
    display: none;
  }
}
</style>
