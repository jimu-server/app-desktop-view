<template>
  <main-page style="height: 800px">
    <div class="fit row justify-center">

    </div>

  </main-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

let observers = [];
const scroll = ref(null);
// scrollObserver.observe(document.getElementById("box0"))
onMounted(() => {

})


</script>


<style scoped>

.box {
  width: 100px;
  height: 100px;
  background-color: rgba(140, 147, 157, 0.42);
  margin-bottom: 20px;
}
</style>