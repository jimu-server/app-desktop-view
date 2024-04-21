<template>
  <q-scroll-area ref="scroll"  id="scroll">
    <slot></slot>
  </q-scroll-area>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";

const scroll = ref(null);


onMounted(() => {
  setTimeout(() => {

    // Register IntersectionObserver
    let options = {
      root: document.getElementById("scroll"),
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Add 'active' class if observation target is inside viewport
        if (entry.isIntersecting) {
          console.log("进入", entry.target.id)
        } else {
          console.log("离开", entry.target.id)
        }
      });
    }, options);

    let elements = document.querySelectorAll('.box');
    elements.forEach(element => {
      io.observe(element)
    })
  }, 1000)
})
</script>


<style scoped>
#scroll {
  overflow: auto;
}
</style>