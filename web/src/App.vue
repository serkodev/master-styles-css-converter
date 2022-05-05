<script setup lang="ts">
import '@master/normal.css'
import '@master/styles'
import '@master/keyframes.css'

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
  <nav class="h:3.5rem f:gray-10 bg:gray-95">
    <div class="d:flex h:full align-items:center px:24">
      <svg id="Layer_1" width="1.5rem" height="1.5rem" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 175.06 192.01"><defs><linearGradient id="linear-gradient" x1="31.41" y1="188.67" x2="255.83" y2="273.91" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#bd781b" /><stop offset="1" stop-color="#f4ce7b" /></linearGradient><linearGradient id="linear-gradient-2" x1="269.63" y1="126.25" x2="100.53" y2="188.18" gradientUnits="userSpaceOnUse"><stop offset="0.04" stop-color="#c78c3d" /><stop offset="0.25" stop-color="#d4a45f" /><stop offset="0.59" stop-color="#e8c891" /><stop offset="0.85" stop-color="#f4deaf" /><stop offset="1" stop-color="#f9e6bb" /></linearGradient></defs><title>converter2</title><path d="M257,225a23,23,0,0,0-17.32,7.86l-.7.69-.11.29c-.24.3-.47.61-.69.92-16,19.86-45.23,25.24-70.12,7.67a29,29,0,0,1-7.73-8.15C153.83,224,151,213.69,151,204c0-7-3-10-8-2-12.25,19.6-13.3,20.24-23.48,45a6.46,6.46,0,0,0,.42,5.16C137.17,280.57,166.39,297,201,297c29,0,55-11,73.13-33.58A22.77,22.77,0,0,0,276,261l.28-.3.22-.45A23,23,0,0,0,257,225Z" transform="translate(-104.99 -104.99)" style="fill:url(#linear-gradient)" /><path d="M279.65,151.7a.64.64,0,0,0,0-.07c-9-27-44.84-42.71-66-45.66-75-10.42-128.31,64.12-101.73,129.61.58,1.44,1.49,1.45,2.07,0C141,168.8,197.82,123,238.9,170.25,254.62,189.07,283.69,175.09,279.65,151.7Z" transform="translate(-104.99 -104.99)" style="fill:url(#linear-gradient-2)" /></svg>

      <span class="mx:16 f:16 f:semibold">CSS to Master Styles Converter</span>
      <span class="opacity:.4">v0.0.3 Alpha</span>
      <a
        href="https://github.com/serkodev/master-styles-css-converter" target="_blank" class="
      ml:auto
      justify-self:end
      fill:gray_svg
      fill:gray-30_svg:hover
      transition:150ms;ease-in_svg
      "
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>
    </div>
  </nav>
  <div class="d:grid grid-cols:2 h:calc(100vh-3.5rem)">
    <Manaco :value="css" @update:value="convert($event)">
      <div>{{ css }}</div>
    </Manaco>
    <div class="bl:1;solid;gray-90">
      <div class="px:16 py:4">
        <StyleResult
          v-for="result in results"
          :key="result"
          :result="result"
          class="my:12"
        />
      </div>
    </div>
  </div>
</template>
