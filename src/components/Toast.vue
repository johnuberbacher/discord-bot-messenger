<template>
  <div class="toast shadow">{{ toastMessage }}</div>
</template>
<script setup>
const props = defineProps(["toastMessage"]);
</script>
