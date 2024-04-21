<template>
  <div id="login-page" class="row justify-center">
    <div class="fit column justify-center">
      <div class="row justify-center">
        <div class="column">
          <q-card id="login" ref="logRef" class="login-box">
            <div class="fit" id="loginBox">
              <!-- 账号登录 -->
              <transition
                  enter-active-class="animate__animated animate__flipInY"
              >
                <div v-show="!register" class="fit row justify-center">
                  <div class=" full-height column" style="width: 100%">
                    <div class="row">
                      <div class="full-width">
                        <q-bar class="bg-transparent" style="padding: 0;-webkit-app-region: drag;">
                          <q-space/>
                          <WindowMinimizeBtn/>
                          <WindowCloseBtn/>
                        </q-bar>
                      </div>
                    </div>
                    <q-form class="input  justify-center" autofocus autocorrect="off" autocomplete="off"
                            autocapitalize="off"
                            spellcheck="false">
                      <div>
                        <q-tabs
                            v-model="tab"
                            indicator-color="transparent"
                            active-color="primary"
                            class="bg-transparent"
                        >
                          <q-tab name="default" :ripple="false" label="账号密码"/>
                          <q-tab name="phone" :ripple="false" label="短信登录"/>
                        </q-tabs>
                        <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
                          <q-tab-panel name="default">
                            <div class="full-width row justify-center">
                              <q-input table-index
                                       :ref="el=> loginInputRef[0]=el"
                                       dense
                                       outlined
                                       v-model="account"
                                       placeholder="账号/手机/邮箱"
                                       style="width: 100%"
                                       :error="false"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="jimu-yonghuming" size="20px"/>
                                </template>
                              </q-input>
                            </div>
                            <div class="full-width row justify-center">
                              <q-input table-index :ref="el=> loginInputRef[1]=el" dense outlined v-model="passwd"
                                       type="password"
                                       :error="false"
                                       style="width: 100%"
                                       placeholder="密码"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="jimu-mima" size="20px"/>
                                </template>
                              </q-input>
                            </div>
                          </q-tab-panel>
                          <q-tab-panel name="phone">
                            <div class="full-width row justify-center">
                              <q-input table-index
                                       :ref="el=> loginInputRef[0]=el"
                                       dense
                                       outlined
                                       v-model="phone"
                                       placeholder="手机"
                                       :error="false"
                                       style="width: 100%"
                              >
                                <template v-slot:before>
                                  <q-select v-model="area" :options="areaOptions"
                                            dense
                                            options-dense
                                            dropdown-icon=""
                                            outlined
                                            style="width: 50px"
                                  />
                                </template>
                              </q-input>
                            </div>
                            <div class="full-width row justify-center">
                              <q-input table-index :ref="el=> loginInputRef[1]=el" dense outlined v-model="code"
                                       :error="false"
                                       style="width: 100%"
                                       placeholder="验证码"
                              >
                                <template v-slot:append>
                                  <q-btn flat dense no-caps :disable="phone==''||flag" @click="sendCode">
                                    <template v-if="!flag">
                                      发送验证码
                                    </template>
                                    <template v-else>
                                      {{ timepiece }}
                                    </template>
                                  </q-btn>
                                </template>
                              </q-input>
                            </div>
                          </q-tab-panel>
                        </q-tab-panels>
                      </div>
                      <div>
                        <div class="row justify-between" style="padding-right: 8px;margin-bottom: 10px">
                          <q-checkbox size="xs" v-model="keep" @update:model-value="keepChange" val="xs"
                                      label="记住用户名"/>
                          <q-space/>
                                                  <div><span @click="register=true" class="register-but text-primary">注册账号</span></div>
                        </div>

                        <div class="full-width row justify-center">
                          <q-btn dense color="primary" style="width: 96%" @click="login" :loading="loading">
                            登录/注册
                            <template v-slot:loading>
                              <q-spinner style="margin-right: 5px"/>
                              登录
                            </template>
                          </q-btn>
                        </div>
                        <div class="row" style="margin-top: 10px;padding-right: 1px" @click="clause=!clause">
                          <q-checkbox size="xs" v-model="clause" val="xs"/>
                          <div class="column justify-center">
                            <div style="user-select: none">
                              已阅读并同意：&nbsp;
                              <span class="clause-opt text-blue" @click.stop>隐私政策</span>&nbsp;、
                              <span class="clause-opt text-blue" @click.stop>产品服务协议</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-form>
                  </div>
                </div>
              </transition>
              <!-- 注册账号 -->
              <transition
                  enter-active-class="animate__animated animate__flipInY"
              >
                <div v-show="register" class="row justify-center" style="width:100%;height: 100%">
                  <div class="column justify-center" style="width: 70%">
                    <q-form class="input" autocorrect="off" autocomplete="off" autocapitalize="off"
                            spellcheck="false">
                      <div>
                        <div>
                          <q-input :ref="el=> loginInputRef[2]=el" dense outlined v-model="registerAccount"
                                   autocomplete="off" label="账号"
                                   :rules="accountCheck">
                            <template v-slot:prepend>
                              <q-icon name="jimu-yonghuming" size="20px" color="primary"/>
                            </template>
                          </q-input>
                        </div>

                        <div>
                          <q-input :ref="el=> loginInputRef[3]=el" dense outlined v-model="registerName"
                                   autocomplete="off"
                                   label="昵称"
                                   :rules="nameCheck">
                            <template v-slot:prepend>
                              <q-icon name="jimu-bianji-2" size="20px" color="primary"/>
                            </template>
                          </q-input>
                        </div>
                        <div>
                          <q-input :ref="el=> loginInputRef[4]=el"
                                   dense
                                   outlined
                                   v-model="registerPassword"
                                   type="password"
                                   label="密码"
                                   :rules="passwordCheck"
                          >
                            <template v-slot:prepend>
                              <q-icon name="jimu-mima" size="20px" color="primary"/>
                            </template>
                          </q-input>
                        </div>
                        <div>
                          <q-input :ref="el=> loginInputRef[5]=el"
                                   dense
                                   outlined
                                   v-model="rregisterPassword"
                                   type="password"
                                   label="确认密码"
                                   :rules="rpasswordCheck">
                            <template v-slot:prepend>
                              <q-icon name="jimu-mima" size="20px" color="primary"/>
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-form>
                    <div class="row justify-between" style="margin-top: 10px">
                      <q-btn v-if="step==1" flat color="primary" @click="cleanRegister" label="取消"/>
                      <q-btn v-show="step == 1" @click="doRegister" color="primary" label="注册"/>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <el-dialog
        v-model="centerDialogVisible"
        title="提示"
        width="200"
        center
        :show-close="false"
        :append-to-body="false"
        :append-to="loginBox"
    >
      <span class="row">
        登陆前请先阅读并同意：&nbsp;
        <span class="clause-opt text-blue" @click.stop>隐私政策</span>&nbsp;、
        <span class="clause-opt text-blue" @click.stop>产品服务协议</span>
      </span>
      <template #footer>
        <div class="full-width row justify-between">
          <el-button @click="centerDialogVisible = false">返回</el-button>
          <el-button type="primary" @click="agree">同意</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import {Result} from "@/model/system";
import {useQuasar} from "quasar";
import {homePath} from "@/variable";
import {userStore} from "@/store/user";
import axiosForServer from "@/plugins/axiosForServer";
import {ElMessage} from "element-plus";
import {loadUserInfo} from "@/components/system-components/utils/userutil";
import {defaultLogin, getPhoneCode} from "@/components/system-components/request";
import WindowMinimizeBtn from "@/components/system-components/desktop/WindowMinimizeBtn.vue";
import WindowCloseBtn from "@/components/system-components/desktop/WindowCloseBtn.vue";
import {desktop_login} from "@/components/system-components/desktop/desktop";


const $q = useQuasar()
const user = userStore()
const router = useRouter()
const centerDialogVisible = ref(false)


const logRef = ref()
const account = ref('')
const passwd = ref('')
const loading = ref(false)
const tab = ref('default')
const area = ref('+86')

const areaOptions = [
  '+86',
  '+87',
  '+88',
  '+89',
  '+90',
  '+91',
]

const step = ref(1)


const register = ref(false)

const card = ref();
const keep = ref(false);
const clause = ref(false);


const phone = ref('')
const code = ref('')
const value = ref(30)
const flag = ref(false)
let count


const registerPassword = ref('')
const rregisterPassword = ref('')
const registerName = ref('')
const registerAccount = ref('')

const slide = ref(1)
const autoplay = ref(true)

const loginBox = ref()

const loginInputRef = ref([])


function keepChange(value) {

}


const timepiece = computed(() => {
  return `${value.value} s后可重发`
})

function agree() {
  centerDialogVisible.value = false
  clause.value = true
}


function cleanRegister() {
  registerName.value = ''
  registerAccount.value = ''
  registerPassword.value = ''
  rregisterPassword.value = ''
  for (let i = 2; i < loginInputRef.value.length; i++) {
    loginInputRef.value[i].resetValidation()
  }
  register.value = false
}

// 注册账号校验规则
const accountCheck = [
  (val: string) => val.length > 0 || '账号不能为空',
  (val: string) => /^[\w_-]*$/.test(val) || '账号不能带特殊字符'
]

// 昵称校验规则
const nameCheck = [
  (val: string) => val.length > 0 || '昵称不能为空',
]

// 密码校验规则
const passwordCheck = [
  (val: string) => val.length > 0 || '密码不能为空',
  (val: string) => val.length > 8 || '密码长度为至少为8',
  (val: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/.test(val) || '必须包含大小写字母和数字或特殊字符的组合',
]

// 密码码确认校验规则
const rpasswordCheck = [
  (val: string) => val.length > 0 || '确认密码不能为空',
  (val: string) => rregisterPassword.value == val || '密码不一致'
]

function sendCode() {
  getPhoneCode(phone.value).then(res => {
    if (res.code == 200) {
      ElMessage({
        message: res.data,
        type: 'success'
      })
      flag.value = true
      count = setInterval(() => {
        if (value.value > 1) {
          value.value--
        } else {
          flag.value = false
          value.value = 30
          clearInterval(count)
        }
      }, 1000)
    } else {
      ElMessage.error('发送失败')
    }
  })
}

function getCode() {

}

// 执行登录
function login() {
  switch (tab.value) {
    case 'phone':
      phoneLoginAction()
      break
    case 'default':
      defaultLoginAction()
      break
  }
}


function phoneLoginAction() {
  if (phone.value.length == 0) {
    ElMessage({
      message: '请输入手机号码',
      type: 'warning',
      plain: true,
      grouping: true
    })
    return
  }
  if (code.value.length == 0) {
    ElMessage({
      message: '请输入验证码',
      type: 'warning',
      plain: true,
      grouping: true
    })
    return
  }
  if (!clause.value) {
    centerDialogVisible.value = true
    return;
  }
}

function defaultLoginAction() {
  if (account.value == '' || passwd.value == '') {
    ElMessage({
      message: '输入账号密码',
      type: 'warning',
      duration: 1000,
      plain: true,
      grouping: true,
    })
    return
  }
  if (!clause.value) {
    centerDialogVisible.value = true
    return;
  }
  loading.value = true
  defaultLogin(account.value, passwd.value).then(async (data) => {
    if (data.code == 200) {
      user.info.token = data.data.token
      await loadUserInfo()
      setTimeout(async () => {
        // 触发登录改变窗口大小
        desktop_login()
        await router.push(homePath)
        loading.value = false
      }, 1000)
      return
    }
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
}

async function doRegister() {
  let flag = false
  for (let i = 2; i < loginInputRef.value.length; i++) {
    flag = await loginInputRef.value[i].validate()
  }
  if (flag) {
    axiosForServer.post('/api/register', {
      account: registerAccount.value,
      name: registerName.value,
      password: registerPassword.value,
    }).then((res) => {
      let data: Result<any> = res.data
      if (data.code == 200) {
        $q.notify({
          message: '注册成功',
          color: 'positive',
          icon: 'check',
          position: 'top',
          timeout: 1000
        })
        setTimeout(() => {
          register.value = false
        }, 500)
      }
    })
  }
}


onMounted(() => {
  loginBox.value = document.getElementById('loginBox')
})

</script>


<style scoped>

#login-page {
  display: flex;
  flex-direction: column;
}

#login {

}


.login-box {
  width: 360px;
  height: 400px;
}

.login-box:hover {
  cursor: default;
}

.register-but {

}

.register-but:hover {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #6aa9f3;
  text-underline-offset: 4px;
}

.clause-opt:hover {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #6aa9f3;
  text-underline-offset: 4px;
}

</style>
<style>
#login-page .q-splitter__separator {
  background-color: transparent !important;
}

#loginBox > .el-overlay {
  position: absolute !important;
}

#loginBox > .el-overlay > .el-overlay-dialog {
  position: absolute !important;
}

#loginBox > .el-overlay > .el-overlay-dialog > .el-dialog {
  margin: 0;
  top: 20%;
  left: 22%;
}

#loginBox .q-tab-panels.q-panel-parent.shadow-2.rounded-borders {
  box-shadow: none !important;
}

#loginBox body.desktop .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

#loginBox #loginBox body.desktop .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

#loginBox .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper {
  background: none;
  opacity: 0;
}

#loginBox .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

</style>