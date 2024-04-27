<template>
  <div class="scroll-box" v-size="sizeChange">
    <div class="scroll-x">
      <div class="scroll-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, reactive} from "vue";

const s = reactive({
  w: 0,
  h: 0,
})

const vSize = {
  updated(el, binding, vnode, prevVnode) {
    if (typeof binding.value === 'function') {
      binding.value(el.clientWidth, el.clientHeight);
    }
  },
}

function sizeChange(widht: number, height: number) {
  console.log(widht, height)
  s.w = widht
  s.h = height
}

onMounted(() => {
  console.log(s.w, s.h)
})

onUnmounted(() => {
  console.log(s.w, s.h)
})
</script>


<style scoped>
.scroll-x {
  width: calc(v-bind('s.h') * 1px);
  height: calc(v-bind('s.w') * 1px);
  position: relative;
  overflow: auto;
  transform-origin: 0 0;
  transform: translateY(calc(v-bind('s.h') * 1px)) rotate(-90deg);
}

.scroll-content {
  height: calc(v-bind('s.h') * 1px);
  position: absolute;
  left: 100%;
  transform-origin: 0 0;
  transform: rotate(90deg);
}
</style>

<style>

.scroll-x::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}

.scroll-x::-webkit-scrollbar-thumb {
  border-radius: 0px;
  box-shadow: none;
  background: none;
}

.scroll-x::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(255, 255, 255);
  border-radius: 0;
  background: rgb(255, 255, 255);
}
</style>