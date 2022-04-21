<script setup lang="ts">
import '@master/normal.css'
import '@master/styles'
import { ref } from 'vue'
import Manaco from './components/Monaco/index.vue'

const css = ref(`body {
    background: red;
}`)
</script>

<template>
  <div class="d:grid grid-cols:2 h:100vh">
    <Manaco :value="css" @update:value="css = $event" />
    <div>{{ css }}</div>
  </div>
</template>
