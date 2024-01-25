<template>
  <div class="file-picker-wrapper">
    <label
      for="file-upload"
      type="button"
      class="button-wrapper"
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
    </label>
    <input
      type="file"
      id="file-upload"
      accept=".jpg, .jpeg, .png, .webp, .gif"
      :class="{ disabled: props.disabled }"
      :disabled="props.disabled"
      @change="fileUpload" />
    <div class="file-upload-preview" ref="imagePreviewWrapper">
      <div
        class="cancel flex items-center justify-center"
        @click="cancelUpload">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
            fill="currentColor" />
        </svg>
      </div>
      <img ref="imagePreview" />
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits } from "vue";

const emit = defineEmits();
const props = defineProps(["disabled"]);

const imagePreview = ref(null);
const imagePreviewWrapper = ref(null);

const fileUpload = (event) => {
  const files = event.target.files;
  const filesLength = files.length;
  if (filesLength > 0) {
    let imageSrc = "/assets/discord-bot-messenger.png";

    const isImageOrGif = /^image\/(jpeg|jpg|png|gif)$/.test(files[0].type);

    if (isImageOrGif) {
      imageSrc = URL.createObjectURL(files[0]);
    }

    imagePreviewWrapper.value.style.display = "flex";
    imagePreview.value.src = imageSrc;
    imagePreview.value.style.display = "block";

    emit("file-selected", imageSrc);
  }
};

const cancelUpload = () => {
  const fileInput = document.getElementById("file-upload");
  fileInput.value = "";

  // Hide the image preview
  imagePreviewWrapper.value.style.display = "none";
};
</script>
