<script setup lang="ts">
// import type { DeclarationResult } from 'master-styles-css-converter'

import { computed } from 'vue'

const props = defineProps({
  result: Object,
})

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
    <div v-if="selector" class="f:16 mb:8 f:blue-30">
      {{ selector }}
    </div>
    <div
      v-if="styles"
      class="bg:blue-90 f:blue f:16 d:inline-block p:8;12 r:6"
    >
      {{ styles }}
    </div>

    <div
      v-if="props.result.errorProperties.length > 0"
      class="mt:8 bg:gold-90 f:gold-56 p:10;12 r:8"
    >
      <span class="f:bold">
        Unsupported CSS {{ props.result.errorProperties.length == 1 ? "property" : "properties" }}:
      </span>
      <ul class="mt:8">
        <li v-for="errProp of props.result.errorProperties" :key="errProp" class="ml:14 list-style-type:disc">
          {{ errProp }}
        </li>
      </ul>
    </div>
  </div>
</template>
