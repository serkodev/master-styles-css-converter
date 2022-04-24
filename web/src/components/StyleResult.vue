<script setup lang="ts">
// import type { DeclarationResult } from 'master-styles-css-converter'

import { computed } from 'vue'

const props = defineProps({
  result: Object,
})

// result.value = styles.reduce((all, style) => {
//   if (style.selectors) {
//     all += `selector: ${style.selectors.join(', ')}\n`
//   }
//   all += `styles: ${style.styles.join(' ')}\n\n`
//   return all
// }, '')

const selector = computed(() => {
  if (props.result && props.result.selectors) {
    return props.result.selectors.join(', ')
  }
  return ''
})

const styles = computed(() => {
  if (props.result && props.result.styles) {
    return props.result.styles.join(' ')
  }
  return ''
})

</script>

<template>
  <div v-if="props.result" class="font-family:Menlo,Monaco,monospace">
    <div v-if="selector" class="f:14 mb:6 f:gold-30">
      {{ selector }}
    </div>
    <div
      v-if="styles"
      class="bg:gold-10 f:gold f:14 d:inline-block p:4;8 r:6"
    >
      {{ styles }}
    </div>
  </div>
</template>
