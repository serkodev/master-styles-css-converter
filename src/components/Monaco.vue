<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref } from "vue";

const root = ref<HTMLElement>();

onMounted(() => {
  root.value && monaco.editor.create(root.value);
});
</script>

<template>
  <div ref="root"></div>
</template>
