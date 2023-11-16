<script setup>

import {ref} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
  user: Object
})

const emit = defineEmits(['changeLoginStatus'])

const userForm = ref(null)
const formLabelWidth = ref(80)
let loginDialogFormVisible = ref(false)
let loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'}
  ]
}

const closeDialog = () => {
  for (let key in loginForm.value) {
    loginForm.value[key] = ''
  }
}

const handleShow = () => {
  loginDialogFormVisible.value = true
}

const login = () => {
  userForm.value.validate((valid) => {
    if (valid) {
      props.user.username = loginForm.value.username
      props.user.password = loginForm.value.password
      emit('changeLoginStatus', true)
      loginDialogFormVisible.value = false
    } else {
      ElMessage.error('请正确填写')
      return false;
    }
  })
}

defineExpose({
  handleShow
})


</script>

<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="closeDialog"
      class="login-dialog"
      width="30%"
      v-model="loginDialogFormVisible"
      title="登录">
    <el-form :model="loginForm" :rules="rules" ref="userForm">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input class="login-input" v-model="loginForm.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
        <el-input class="login-input" v-model="loginForm.password" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="login">
          登录
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

.login-input {
  width: 300px;
}

</style>