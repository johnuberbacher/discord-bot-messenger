<template>
  <div class="toast error shadow">{{ errorMessage }}</div>
</template>
<script setup>
const props = defineProps(["errorMessage"]);
</script>
