<script setup lang="ts">
import ClipboardJS from 'clipboard'

import { computed, onMounted, onUpdated, ref } from 'vue'

const props = defineProps({
  result: Object,
})

const styleLabel = ref<Element>()

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

const blink = ref(false)

onMounted(() => {
  styleLabel.value && new ClipboardJS(styleLabel.value)
})
</script>

<template>
  <div v-if="props.result" class="font-family:Menlo,Monaco,monospace opacity:1:hover_.copy">
    <div v-if="selector" class="f:16 mb:8 f:blue-30">
      {{ selector }}
    </div>
    <div
      v-if="styles"
      class="
      bg:blue-90
      f:blue
      f:16
      d:inline-block
      p:8;12
      r:6
      "
    >
      {{ styles }}
    </div>

    <button
      v-if="styles"
      ref="styleLabel"
      :data-clipboard-text="styles"
      class="
      copy
      opacity:0
      f:gray-80
      f:gray-60:hover
      f:13
      d:block
      mt:4
      opacity:1.blink
      content:'COPY'::after
      content:'COPIED'.blink::after
      f:green-65.blink::after
      @fade;.75s;calc(2);alternate.blink::after
      "
      :class="{ blink: blink }"
      @click="blink = true"
      @animationend="blink = false"
    />

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
