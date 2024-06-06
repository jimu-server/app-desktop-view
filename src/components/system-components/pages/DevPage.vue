<template>
  <main-page class="fit">
    <div class="row justify-center" style="width: 500px;height: 500px;overflow: auto">

    </div>
  </main-page>
</template>

<script setup lang="ts">
import {h, onMounted, ref, render} from "vue";
import {useAppStore} from "@/store/app";


const app = useAppStore()


onMounted(() => {

})


</script>


<style scoped>

</style>