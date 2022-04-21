<script setup lang="ts">
import * as monaco from "monaco-editor";
import { nextTick, onMounted, ref } from "vue";

const el = ref();

onMounted(() => {
  if (el.value) {
    const editor = monaco.editor.create(el.value, {
      automaticLayout: true,
      language: "css",
      value: `body {
    background: red;
}`
    });
    nextTick(() => {
      editor.layout();
    });
  }
});
</script>

<template>
  <div class="w:100vw h:100vh" ref="el"></div>
</template>
