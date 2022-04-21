<script setup lang="ts">
import '@master/normal.css'
import '@master/styles'
import { ref } from 'vue'
import { foo } from 'master-styles-css-converter'
import Manaco from './components/Monaco/index.vue'

const css = ref(`body {
    background: red;
}`)

const t = ref(foo)
</script>

<template>
  <div class="d:grid grid-cols:2 h:100vh">
    <Manaco :value="css" @update:value="css = $event" />
    <div>{{ css }} {{ t }}</div>
  </div>
</template>
