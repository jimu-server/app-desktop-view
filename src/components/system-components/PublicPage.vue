<template>
  <q-layout id="index" view="hHh lpR fFf">
    <q-header bordered >
      <q-toolbar class="row text-black justify-center">
        <div class="fit row justify-between">
          <div class="full-height column justify-center">
            Jimu
          </div>
          <div style="width: 50%" class="row justify-center">

          </div>
          <div>
            <q-btn outline color="white" text-color="black" label="登录" @click="to_login"/>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="fit column">
        <div>
          <q-carousel
              animated
              v-model="slide"
              navigation
              infinite
              :autoplay="autoplay"
              transition-prev="slide-right"
              transition-next="slide-left"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
              style="height: 500px"
          >
            <q-carousel-slide :name="1" img-src="public/box/1.jpg"/>
            <q-carousel-slide :name="2" img-src="public/box/2.jpg"/>
          </q-carousel>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import {ref} from 'vue'

import router from "@/route";


function to_login() {
  router.push({name: 'login'})
}

const infoShow = ref(false)
const infoShowOut = ref(false)
const slide = ref(1)
const autoplay = ref(true)

function popupOut() {
  infoShow.value = false
  infoShowOut.value = false
}

function infoOut() {
  setTimeout(() => {
    if (!infoShowOut.value) {
      infoShow.value = false
    }
  }, 200)
}


</script>



<style scoped>


</style>

<style>
</style>