<template>
  <main-page>
    <q-splitter
      v-model="splitterModel"
      :limits="[10,30]"
      :style="{height:app.ui.page.height}"
    >
      <template v-slot:before>
        <div class="full-width row justify-center">
          <q-input outlined dense v-model="filterText" style="width: 95%;margin-top: 5px;margin-bottom: 5px"/>
        </div>
        <q-list>
          <el-tree
            ref="treeRef"
            :data="trees"
            :props="treeProps"
            node-key="entity.id"
            :icon="OrgNodeIcon"
            @node-click="orgClick"
            :filter-node-method="filterNode"
            table-layout="auto"
            size="large"
          />
        </q-list>
      </template>

      <template v-slot:after>
        <div class="fit column justify-between">
          <div class="filter row full-width" style="padding:5px;">
            <q-input class="opt" dense outlined v-model="filter.name" label="昵称" style="width: 100px"/>
            <q-select class="opt" v-model="filter.gender" label="性别" :options="genderOptions"
                      dropdown-icon="jimu-xiangxia-2"
                      outlined dense options-dense
                      style="width: 80px"/>
            <q-input class="opt" dense outlined v-model="filter.phone" label="手机" style="width: 200px"/>
            <q-input class="opt" dense outlined v-model="filter.email" label="邮箱" style="width: 200px"/>
            <q-btn dense flat label="查询" style="width: 85px" icon="jimu-chaxun" color="primary"/>
          </div>
          <div style="flex-grow: 1" class="full-width">
            <el-table :data="users" style="background: transparent" class="fit">
              <el-table-column type="selection" width="55"/>
              <el-table-column fixed prop="account" label="账号"/>
              <el-table-column prop="name" label="昵称">
                <template #default="scope">
                  <div class="fit row">
                    <q-chip>
                      <q-avatar>
                        <img :src="scope.row.picture">
                      </q-avatar>
                      {{ scope.row.name }}
                    </q-chip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="gender" label="性别">
                <template #default="scope">
                  {{ app.get('user', scope.row.gender) }}
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机"/>
              <el-table-column prop="email" label="邮箱"/>
              <el-table-column fixed="right" label="Operations" align="right">
                <template #default="scope">
                  <div class="row">
                    <q-btn dense flat color="primary" icon="jimu-bianji1"/>
                    <q-btn dense flat color="warning" icon="jimu-quanxianguanli"/>
                    <q-btn dense flat color="red" icon="jimu-shanchu"/>
                  </div>
                </template>
                <template #header>
                  <q-input v-model="filter.account" outlined dense label="账号"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="row justify-center" style="padding-top: 5px;padding-bottom: 5px">
            <Pagination :page="page" :total="count" @action="action"/>
          </div>
        </div>
      </template>
    </q-splitter>
  </main-page>
</template>
<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {userStore} from "@/store/user";
import {getOrgChildTree, getOrgUserList} from "@/components/system-components/tool/manageTool/manageRequest";
import {Org, Tree, User} from "@/model/system";
import OrgNodeIcon from "@/components/system-components/tool/manageTool/icon/OrgNodeIcon.vue";
import {useAppStore} from "@/store/app";

const user = userStore()
const app = useAppStore()
const splitterModel = ref(10)

const trees = ref<Tree<Org>[]>([])
const currentOrg = ref(user.info.org)
const users = ref<User[]>([])

const filterText = ref('')
const treeRef = ref()

let treeProps = {
  label: function (data, node) {
    return data.entity.name
  },
}

const filter = ref({
  account: '',
  name: '',
  gender: {
    value: 0,
    label: '男'
  },
  phone: '',
  email: '',
})

let genderOptions = [
  {value: 0, label: '男'},
  {value: 1, label: '女'},
]


const page = ref(1)
const count = ref(0)

/*
* @description: 切换组织机构
* */
function orgClick(data: Tree<Org>) {
  currentOrg.value = data.entity
  page.value = 1
  load()
}

/*
* @description: 翻页动作
* */
function action(page: number, size: number) {
  // 加载组织下所有角色
  load(page, size)
}

/*
* @description: 加载当前组织下所有用户
* */
function load(page: number = 1, size: number = 5) {
  getOrgUserList(currentOrg.value.id, page, size).then(data => {
    users.value = data.rows
    count.value = data.count
  })
}

/*
* @description: 初始化页面数据
* */
function init() {
  // 加载组织
  getOrgChildTree(currentOrg.value.id).then((data) => {
    trees.value = data
  })
  load()
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree<Org>) => {
  if (!value) return true
  return data.entity.name.includes(value)
}

onMounted(init)
</script>


<style scoped>
.filter > .opt {
  margin-right: 10px;
}
</style>
<style>
.el-tree {
  --el-tree-node-content-height: 40px;
}

.el-checkbox__inner, .el-checkbox__inner {
  transition: none !important;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  transition: none !important;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  transition: none !important;
}
</style>