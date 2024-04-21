<template>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {userStore} from "@/store/user";

const props = defineProps({
  url: {
    type: String,
  },
  protocols: {
    type: Array<string>
  }
})
let emits = defineEmits({
  receive: function (data) {

  },
  close: function () {
    console.log("close")
  },
  error: function () {
    console.log("error");
  }
});
const user = userStore()
const webSocket = ref<WebSocket>()
onMounted(() => {
  webSocket.value = new WebSocket(props.url, props.protocols);
  webSocket.value.onopen = function () {
    console.log("success");
  };
  webSocket.value.onmessage = function (evt) {
    let message: string = evt.data;
    let data = JSON.parse(message)
    emits('receive', data)
  };
  webSocket.value.onclose = function () {
    emits('close')
  };
  webSocket.value.onerror = function () {
    emits('error')
  };
})
</script>

<style scoped>

</style>