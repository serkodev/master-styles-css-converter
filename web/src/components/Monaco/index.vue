<script setup lang="ts">
import './worker'
import * as monaco from 'monaco-editor'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  value: String,
})

const emit = defineEmits(['update:value', 'delete'])

const el = ref()
let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
  if (el.value) {
    editor = monaco.editor.create(el.value, {
      automaticLayout: true,
      language: 'css',
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      overviewRulerLanes: 0,
      theme: 'vs-dark',
      fontSize: 14,
      value: props.value,
    })

    editor.onDidChangeModelContent((e) => {
      // props.value = editor.getValue();
      emit('update:value', editor.getValue())
    })

    nextTick(() => {
      editor.layout()
    })
  }
})
</script>

<template>
  <div class="ovf:hidden">
    <div ref="el" class="w:full h:full" />
  </div>
</template>
