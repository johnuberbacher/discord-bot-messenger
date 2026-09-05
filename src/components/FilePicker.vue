<template>
  <div class="file-picker flex flex-row">
    <button
      type="button"
      class="button-wrapper"
      @click="selectFile"
      :class="{ disabled: props.disabled || isLoading }"
      :disabled="props.disabled || isLoading">
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
    <img
      v-if="props.media?.preview"
      :src="props.media.preview"
      :title="props.media.name"
      class="preview" />
    <div
      v-else-if="props.media"
      :title="props.media.name"
      class="preview preview-fallback">
      {{ fileExtension }}
    </div>
    <div v-if="props.media" @click="deleteMedia" class="delete">
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
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { ipcRenderer } from "electron";

const emit = defineEmits(["update-media", "display-error"]);
const props = defineProps(["disabled", "media"]);

const isLoading = ref(false);

// Shown in place of a thumbnail when the file was too big to preview
const fileExtension = computed(() =>
  (props.media?.name.split(".").pop() ?? "").toUpperCase()
);

const deleteMedia = () => {
  emit("update-media", null);
};

const selectFile = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const file = await ipcRenderer.invoke("selectImageFile");

    // Null means the user cancelled the dialog
    if (!file) return;

    if (file.error) {
      emit("display-error", file.error);
      return;
    }

    emit("update-media", file);
  } catch (error) {
    emit("display-error", "Error selecting image: " + error.message);
  } finally {
    isLoading.value = false;
  }
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
    object-fit: cover;
    &:hover + .delete {
      opacity: 1;
    }
  }
  .preview-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 600;
    color: white;
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
