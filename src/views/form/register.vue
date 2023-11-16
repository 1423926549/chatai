<script setup>

import {ref} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
  user: Object
})

const regDialogFormVisible = ref(false)
const userForm = ref(null)
let regFrom = ref({
  name: '',
  username: '',
  password: ''
})

const rules = {
  name: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
  ],
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {pattern: /^[a-zA-Z0-9]{8,16}$/, message: '用户名由 8-16 个字符组成，可包含字母、数字', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'}
  ]
}

const closeDialog = () => {
  for (let key in regFrom.value) {
    regFrom.value[key] = ''
  }
}

const save = () => {
  userForm.value.validate((valid) => {
    if (valid) {
      regDialogFormVisible.value = false
      return true
    } else {
      ElMessage.error('校验失败')
      return false;
    }
  })
}

const handleShow = () => {
  regDialogFormVisible.value = true
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
      v-model="regDialogFormVisible"
      title="注册">
    <el-form :model="regFrom" :rules="rules" ref="userForm">
      <el-form-item label="昵称" label-width="80" prop="name">
        <el-input class="login-input" v-model="regFrom.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名" label-width="80" prop="username">
        <el-input class="login-input" v-model="regFrom.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" label-width="80" prop="password">
        <el-input class="login-input" v-model="regFrom.password" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="regDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          保存
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