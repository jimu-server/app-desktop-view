<template>
  <q-card
      class="system-file-select-dialog"
  >
    <div class="fit column" style="padding: 5px">
      <div class="tool-bt full-width row justify-between">
        <div>
          选择文件
        </div>
        <div>
          <q-btn dense flat class="close-btn" icon="jimu-guanbi" @click="model=false"/>
        </div>
      </div>
      <div class="file-selector full-width">
        <el-select
            v-model="data"
            value-key="path"
            :teleported="false"
        >
          <el-option v-for="item in list"
                     :key="item.path"
                     :value="item">
            <div class="fit row">
              <div class="select-icon">
                <el-icon>
                  <span class="iconfont jimu-wenjianjia1"></span>
                </el-icon>
              </div>
              <div style="margin-left: 5px">
                {{ item.path }}
              </div>
            </div>
          </el-option>
          <template #label>
            <div class="fit row">
              <div class="select-icon">
                <el-icon>
                  <span class="iconfont jimu-wenjianjia1"></span>
                </el-icon>
              </div>
              <div style="margin-left: 5px">
                {{ data.path }}
              </div>
            </div>
          </template>
        </el-select>
      </div>
      <div class="file-view">
        <q-scroll-area class="fit">
          <el-tree
              :data="treeData"
              :props="fileProps"
              lazy
              :load="getChildren"
          >
            <template #default="{node,data}">
              <div class="fit row">
                <div class="select-icon column justify-center">
                  <el-icon>
                    <span :class="'iconfont '+getFileIcon(data)"></span>
                  </el-icon>
                </div>
                <div class=" column justify-center" style="margin-left: 5px">
                  {{ getFileName(data) }}
                </div>
              </div>
            </template>
          </el-tree>
        </q-scroll-area>
      </div>
      <div class="file-footer">

      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useElectronStore} from "@/store/electron";

const electron = useElectronStore()

const model = defineModel({default: false})


const data = ref<FileTree>()
const list = ref<FileTree[]>([])
const treeData = ref<FileTree[]>([])

interface FileTree {
  path: string
  name: string
  isDirectory: boolean
  parentPath: string
  children?: FileTree[]
}

const fileProps = {
  label: function (data, node) {
    let name = data.name;
    let endsWith = name.endsWith(".url");
    if (endsWith) {
      name = name.substring(0, name.length - 4)
    }
    endsWith = name.endsWith(".lnk");
    if (endsWith) {
      name = name.substring(0, name.length - 4)
    }
    return name
  },
  isLeaf: function (data, node) {
    return !data.isDirectory;
  },
  children: 'children',
}

function getChildren(node, resolve, reject) {
  setTimeout(async () => {
    let data = node.data;
    let newVar = []
    if (data.path && data.name) {
      let fullPath = data.path + "\\" + data.name
      console.log(fullPath)
      newVar = await electron.getChildPath(fullPath);
    }
    resolve(newVar)
  }, 200)

}

function getFileIcon(data: FileTree) {
  if (data.isDirectory) {
    return 'jimu-wenjianjia1'
  }
  return 'jimu-wenjian'
}

function getFileName(data) {
  let name = data.name;
  let endsWith = name.endsWith(".url");
  if (endsWith) {
    name = name.substring(0, name.length - 4)
  }
  endsWith = name.endsWith(".lnk");
  if (endsWith) {
    name = name.substring(0, name.length - 4)
  }
  return name
}


watch(data, async (val: FileTree) => {
  // 根据根目录加载当前目录下的子内容
  treeData.value = await electron.getChildPath(val.path)
})

onMounted(async () => {
  // 打开文件选择器,初始化选择器数据 默认初始化为用户桌面
  let desktopPath = await electron.getDesktopPath();
  if (desktopPath != "") {
    list.value = [
      {
        name: "Desktop",
        path: desktopPath,
        parentPath: desktopPath,
        isDirectory: true,
        children: []
      }
    ]
    data.value = list.value[0]
  }
})
</script>

<style scoped>
.system-file-select-dialog {
  width: 35vw !important;
  height: 50vh !important;
}

.close-btn:hover {
  background-color: red;
  color: white;
}

.file-selector {
  margin-top: 5px;
}

.file-view {
  flex-grow: 1 !important;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}


.file-footer {
  height: 30px;
}
</style>
<style>

</style>