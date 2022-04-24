<script setup lang="ts">
import '@master/normal.css'
import '@master/styles'
import { onMounted, ref } from 'vue'
import { Convert } from 'master-styles-css-converter'
import Manaco from './components/Monaco/index.vue'
import StyleResult from './components/StyleResult.vue'

const css = ref(`body {
    background: red;
}`)

const results = ref()

const convert = ($event: any) => {
  css.value = $event
  const styles = Convert(css.value)
  if (styles === undefined)
    return
  results.value = styles
}

onMounted(() => {
  convert(css.value)
})
</script>

<template>
  <div class="d:grid grid-cols:2 h:100vh">
    <Manaco :value="css" @update:value="convert($event)">
      <div>{{ css }}</div>
    </Manaco>
    <div>
      <div class="px:16">
        <StyleResult
          v-for="result in results"
          :key="result"
          :result="result"
          class="my:16"
        />
      </div>
    </div>
  </div>
</template>
