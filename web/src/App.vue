<script setup lang="ts">
import '@master/normal.css'
import '@master/styles'
import { onMounted, ref } from 'vue'
import { Convert } from 'master-styles-css-converter'
import Manaco from './components/Monaco/index.vue'

const css = ref(`body {
    background: red;
}`)

const result = ref('')

const convert = ($event: any) => {
  css.value = $event
  const styles = Convert(css.value)

  result.value = styles.reduce((all, style) => {
    if (style.selectors) {
      all += `selector: ${style.selectors.join(', ')}\n`
    }
    all += `styles: ${style.styles.join(' ')}\n\n`
    return all
  }, '')
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
    <pre>{{ result }}</pre>
  </div>
</template>
