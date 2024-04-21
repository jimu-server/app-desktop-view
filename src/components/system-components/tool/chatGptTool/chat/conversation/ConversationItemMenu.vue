<template>
  <q-menu
      context-menu
  >
    <q-list dense>
      <q-item dense v-for="(item,index) in list" clickable v-close-popup @click="item.action(ConversationItem)"
              style="padding: 0"
      >
        <menu-item :icon="item.icon" :text="item.name"/>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {ActionMenu} from "@/model/system";
import {AppChatConversationItem} from "@/components/system-components/tool/chatGptTool/chat/model/gpt";

const props = defineProps<{
  list: ActionMenu[],
  ConversationItem: AppChatConversationItem
}>()

</script>


<style scoped>

</style>