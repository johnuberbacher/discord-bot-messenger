<template>
  <div class="file-picker flex flex-row">
    <button
      type="button"
      class="button-wrapper"
      @click="toggleModal"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m11 8c0-0.55228 0.4477-1 1-1s1 0.44772 1 1v3h3c0.5523 0 1 0.4477 1 1s-0.4477 1-1 1h-3v3c0 0.5523-0.4477 1-1 1s-1-0.4477-1-1v-3h-3c-0.55229 0-1-0.4477-1-1s0.44772-1 1-1h3v-3z"
          fill="currentColor" />
        <path
          d="m23 12c0 6.0751-4.9249 11-11 11-6.0751 0-11-4.9249-11-11 0-6.0751 4.9249-11 11-11 6.0751 0 11 4.9249 11 11zm-19.993 0c0 4.9668 4.0264 8.9932 8.9932 8.9932 4.9668 0 8.9932-4.0264 8.9932-8.9932 0-4.9668-4.0264-8.9932-8.9932-8.9932-4.9668 0-8.9932 4.0264-8.9932 8.9932z"
          clip-rule="evenodd"
          fill="currentColor"
          fill-rule="evenodd" />
      </svg>
    </button>
    <img v-if="media !== ''" :src="media" class="preview" />
    <div v-if="media !== ''" @click="deleteMedia" class="delete">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13px"
        height="13px"
        viewBox="0 0 1024 1024">
        <path
          fill="#FFFFFF"
          d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
      </svg>
    </div>
  </div>
  <div v-if="showWindow" class="modal shadow" @click.self="toggleModal">
    <div
      class="flex flex-column gap-1 items-end shadow"
      @click.stop
      :class="{ shake: isShaking }">
      <div class="w-full">
        <label>Media URL</label>
        <div class="input-wrapper">
          <input
            type="text"
            v-model="mediaInput"
            placeholder="Enter image or video URL..."
            class="input-field" />
        </div>
      </div>
      <div class="w-full flex flex-row items-center justify-between gap-1">
        <div class="error w-full">{{ error ?? "&nbsp;" }}</div>
        <div class="flex flex-row gap-1">
          <button
            class="button button-link"
            @click="toggleModal"
            :disabled="isLoading">
            Cancel
          </button>
          <button
            class="button button-primary"
            @click="saveConfig"
            :disabled="isLoading">
            <span v-if="!isLoading">Save</span>
            <span v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor">
                <!-- Your SVG loading icon code -->
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";

const emit = defineEmits(["update-media"]);
const props = defineProps(["disabled", "media"]);

const showWindow = ref(false);
const mediaInput = ref("");
const isLoading = ref(false);
const error = ref(null);

const deleteMedia = () => {
  mediaInput.value = "";
  emit("update-media", "");
};

const toggleModal = () => {
  mediaInput.value = "";
  showWindow.value = !showWindow.value;
};

const saveConfig = () => {
  // Validate URL here if needed
  const validExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]; // Add more if needed
  const validMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
  ]; // Add more if needed

  // Extract the file extension from the URL
  const urlParts = mediaInput.value.toLowerCase().split(".");
  const fileExtension = urlParts[urlParts.length - 1];

  // Check if the URL has a valid file extension or MIME type
  const isValidExtension = validExtensions.includes(fileExtension);
  const isValidMimeType = validMimeTypes.some((type) =>
    mediaInput.value.toLowerCase().includes(type)
  );

  if (!mediaInput.value || (!isValidExtension && !isValidMimeType)) {
    error.value = "Please enter a valid image or video URL.";
    return;
  }

  // Clear error if URL is valid
  error.value = null;

  // Assuming the media type is valid (image or video), emit the URL
  emit("update-media", mediaInput.value);

  // Reset modal state
  toggleModal();
};
</script>

<style lang="scss" scoped>
.file-picker {
  position: relative;
  .preview {
    height: 32px;
    width: 32px;
    min-width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: var(--base-500);
    padding: 0px;
    margin-top: 6px;
    margin-right: 10px;
    border: 2px solid white;
    &:hover + .delete {
      opacity: 1;
    }
  }
  .delete {
    cursor: pointer;
    opacity: 0;
    border-radius: 100px;
    background-color: var(--base-danger);
    border: 2px solid white;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 2px;
    right: 2px;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
