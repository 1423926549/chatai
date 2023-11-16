<script setup>

import {ref} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
  user: Object
})

let editFrom = ref({
  name: props.user.name,
  username: props.user.username,
  oldPassword: '',
  newPassword: ''
})

const editDialogFormVisible = ref(false)
const userForm = ref(null)

const closeDialog = () => {
  for (let key in editFrom.value) {
    editFrom.value[key] = ''
  }
}

const checkPassword = () => {
  if (props.user.password !== editFrom.value.oldPassword) {
    return Promise.reject("原密码错误")
  }
  return Promise.resolve()
}

const rules = {
  oldPassword: [{validator: checkPassword, trigger: 'blur'}],
  newPassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'}
  ]
}

const handleShow = () => {
  editDialogFormVisible.value = true
  editFrom.value.name = props.user.name
  editFrom.value.username = props.user.username
}

const save = () => {
  userForm.value.validate((valid) => {
    if (valid) {
      props.user.value.name = editFrom.value.name
      props.user.value.username = editFrom.value.username
      props.user.value.password = editFrom.value.newPassword
      editDialogFormVisible.value = false
      return true
    } else {
      ElMessage.error('校验失败')
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
      v-model="editDialogFormVisible"
      title="编辑">
    <el-form :model="editFrom" :rules="rules" ref="userForm">
      <el-form-item label="昵称" label-width="80" prop="name">
        <el-input class="login-input" v-model="editFrom.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名" label-width="80" prop="username">
        <el-input disabled class="login-input" v-model="editFrom.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="原密码" label-width="80" prop="oldPassword">
        <el-input class="login-input" v-model="editFrom.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" label-width="80" prop="newPassword">
        <el-input class="login-input" v-model="editFrom.newPassword" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
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