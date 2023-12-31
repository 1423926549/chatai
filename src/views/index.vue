<script setup>
import {onMounted, ref, watch} from "vue";
import {ChatDotSquare, CloseBold, Delete, Edit} from "@element-plus/icons-vue";
import loginFrom from '@/views/form/login.vue'
import editFrom from '@/views/form/edit.vue'
import regFrom from '@/views/form/register.vue'
import {createChatService, deleteChatService, editChatService, getChatsService} from "@/api/chats";
import {ElMessage} from "element-plus";
import {logoutService, userCheckLoginService} from "@/api/user";
import {getAnswersService, getTalkListService, sendQuestionService} from "@/api/talk";
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores";

let chats = ref()
let dialogue = ref()
const problem = ref('')

const loginDialog = ref(null)
const editDialog = ref(null)
const regDialog = ref(null)

const userStore = useUserStore()

let loading = ref(false)
let activeId = ref(0)
let editChatId = ref(0)
let editChatName = ref('')
let isSend = ref(false)

const { user, isLogin } = storeToRefs(userStore)

const showLoginFrom = () => {
  loginDialog.value.handleShow()
}

const showEditFrom = () => {
  editDialog.value.handleShow()
}

const showRegFrom = () => {
  regDialog.value.handleShow()
}

const changeActive = (id) => {
  activeId.value = id
}

const getIsLogin = async () => {
  const res = await userCheckLoginService()
  if (res != null) {
    userStore.setLogin()
    userStore.setUser(res)
  } else {
    ElMessage.error('请先登录')
    showLoginFrom()
    return Promise.reject("未登录")
  }
}

const logout = async () => {
  await logoutService()
  userStore.clear()
  chats.value = []
  dialogue.value = []
  userStore.setNoLogin()
}

const getChats = async () => {
  if (!isLogin.value) {
    ElMessage.error('请先登录')
    return
  }
  chats.value = await getChatsService()
  // 判断是否有chat，没有则添加一个
  if (chats.value.length === 0) {
    await createChat()
  }
  activeId.value = chats.value[0].id
}

const editChat = (item) => {
  editChatName.value = item.chatName
  editChatId.value = item.id
}

const saveChatName = (item) => {
  item.chatName = editChatName.value
  editChatService(item)
  editChatId.value = 0
}

const deleteChat = async (item) => {
  await deleteChatService(item.id)
  await getChats()
}

const createChat = async () => {
  await createChatService()
  await getChats()
  problem.value = ''
}

const getTalkList = async () => {
  dialogue.value = await getTalkListService(activeId.value)
  setTimeout(() => {
    let div = document.getElementById("content")
    div.scrollTop = div.scrollHeight
  }, 20)
}

const send = async () => {
  if (!isLogin.value) {
    ElMessage.error('请先登录')
    return
  }

  if (problem.value.trim() === '' || isSend.value || !chats.value) {
    return
  }

  loading.value = true
  isSend.value = true
  try {
    const chatSession = chats.value.find(item => item.id === activeId.value).chatSession
    const questionFrom = {
      chatId: activeId.value,
      content: problem.value,
      chatSession: chatSession
    }
    await sendQuestionService(questionFrom)
    await getTalkList()
    setTimeout(() => {
      let div = document.getElementById("content")
      div.scrollTop = div.scrollHeight
    }, 20)
    problem.value = ''
    await getAnswersService(questionFrom)
    await getTalkList()
    setTimeout(() => {
      let div = document.getElementById("content")
      div.scrollTop = div.scrollHeight
    }, 20)
  } finally {
    loading.value = false
    isSend.value = false
  }
}

onMounted(async () => {
  setTimeout(() => {
    let div = document.getElementById("content")
    div.scrollTop = div.scrollHeight
  }, 20)
  try {
    await getIsLogin()
    await getChats()
    await getTalkList()
  } catch (e) {
    showLoginFrom()
  }
})

watch((activeId), () => {
    editChatId.value = 0
    getTalkList()
  }
)

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left">
        <div class="new-chat-div">
          <button @click="createChat" ref="newChat" class="new-chat">New chat</button>
        </div>
        <el-scrollbar class="chat-div">
          <div class="chat-list" v-for="item in chats">
            <div :class="{ activeChat : item.id === activeId} " class="chat-list-div" @click="changeActive(item.id)">
              <el-icon class="chat-icon"><ChatDotSquare /></el-icon>

              <span v-show="item.id !== editChatId" class="chat-name">{{ item.chatName }}</span>
              <el-input
                  v-model="editChatName"
                  class="w-50 m-2 chat-name-input"
                  v-show="item.id === activeId && item.id === editChatId"
              />
              <div class="chat-operation" v-show="item.id === activeId && item.id !== editChatId">
                <el-icon class="chat-operation-icon" @click="editChat(item)"><Edit /></el-icon>
                <a-popconfirm
                    content="是否删除?"
                    okText="删除"
                    cancelText="取消"
                    position="bl"
                    type="error"
                    @ok="deleteChat(item)"
                >
                  <el-icon class="chat-operation-icon"><Delete /></el-icon>
                </a-popconfirm>
              </div>
              <div class="chat-operation"  v-show="item.id === activeId && item.id === editChatId">
                <el-icon class="chat-operation-icon" @click="saveChatName(item)"><Select /></el-icon>
                  <el-icon class="chat-operation-icon" @click="editChatId = 0"><CloseBold /></el-icon>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="user">
          <div v-if="isLogin" class="login-div">
            <img @click="showEditFrom"
                 class="user-header"
                 :src="user.header"
                 alt="加载失败"
            />
            <div @click="showEditFrom" class="username">{{user.nickname}}</div>
            <div class="logout" @click="logout">退出</div>
          </div>
          <div v-else class="no-login-div">
            <div class="login" @click="showLoginFrom">登录</div>
            <div class="register" @click="showRegFrom">注册</div>
          </div>
        </div>
      </el-aside>
      <el-main class="main">
        <div id="content" class="content">
          <div class="speak-div" v-for="item in dialogue">
            <div v-show="item.type === 1" class="my-speak">
              <div class="my-header header">
                <icon-lark-color class="my-header-icon" />
              </div>
              <div class="my-content">
                <p class="my-time">{{item.time}}</p>
                <div class="my-text">{{item.content}}</div>
              </div>
            </div>
            <div v-show="item.type === 2" class="chat-speak">
              <div class="chat-header header">
                <icon-tiktok-color class="chat-header-icon" />
              </div>
              <div class="chat-content">
                <p class="chat-time">{{item.time}}</p>
                <div class="chat-text">{{item.content}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="quest">
          <el-input @keyup.enter="send" class="quest-input" v-model="problem" placeholder="请输入" />
          <el-button @click="send" id="submit" type="primary" :loading="loading" icon="Position"></el-button>
        </div>
      </el-main>
    </el-container>
    <loginFrom ref="loginDialog" :getChats="getChats"></loginFrom>
    <editFrom ref="editDialog" :user="user"></editFrom>
    <regFrom ref="regDialog" :user="user"></regFrom>
  </div>
</template>

<style scoped>

.no-login-div {
  display: flex;
}

.register {
  font-size: 18px;
  cursor: pointer;
  color: #3395fa;
  margin-left: 20px;
}

.login {
  font-size: 18px;
  cursor: pointer;
  color: #3395fa;
  margin-right: 20px;
}

.login-div {
  width: 100%;
  display: flex;
  align-items: center;
}

.user-header {
  height: 50px;
  width: 50px;
  position: relative;
  left: 20px;
  cursor: pointer;
}

.username {
  position: relative;
  left: 50px;
  cursor: pointer;
}

.logout {
  position: absolute;
  right: 10px;
  font-size: 15px;
  cursor: pointer;
  color: #b04a4a;
}

.arco-icon {
  font-size: 50px;
}

.my-speak {
  display: flex;
  flex-direction: row-reverse;
  margin: 10px 0 20px 0;
}

.chat-speak {
  display: flex;
  margin: 10px 0 20px 50px;
}

.my-content {
  margin-left: 30px;
  margin-right: 80px;
  //width: calc(100% - 100px);
}

.chat-content {
  margin-left: 30px;
  margin-right: 80px;
  //width: calc(100% - 100px);
}


.my-time {
  text-align: right;
  color: #888888;
}

.chat-time {
  text-align: left;
  color: #888888;
}

.my-text {
  font-size: 15px;
  background-color: rgba(98, 231, 98, 0.48);
  padding: 10px;
  border-radius: 5px;
}

.chat-text {
  font-size: 15px;
  background-color: rgba(198, 203, 199, 0.48);
  padding: 10px;
  border-radius: 5px;
}

.header {
  height: 50px;
  width: 50px;
  position: absolute;
  text-align: center;
  margin-top: 20px;
}

.my-header {
  right: 10px;
}

.chat-header {
  left: 10px;
}


.my-header-icon {
  position: absolute;
  right: 0;
}

.chat-header-icon {
  position: absolute;
  left: 0;
}

.chat-operation {
  position: relative;
  color: green;
  top: 2px;
}

.chat-name {
  width: 120px;
  margin-left: 15px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}

.chat-name-input {
  width: 120px;
  margin-left: 15px;
}

.chat-operation-icon {
  padding-left: 10px;
}

.new-chat-div {
  width: 100%;
  height: 60px;
  text-align: center;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.new-chat {
  border: 1px dashed #888888;
  width: 80%;
  height: 80%;
  font-size: 18px;
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
}

.new-chat:hover {
  border: 1px dashed green;
  color: green;
}

.common-layout {
  border: 1px solid #ccc;
  margin: 10px;
  width: 98%;
  height: 95%;
  position: fixed;
  border-radius: 5px;
  box-shadow: -5px 0 5px #ccc,
              0 0 0 #ccc,
              0 0 0 #ccc,
              0 5px 5px #ccc;
}

.left {
  width: 300px;
  border-right: 1px solid #ccc;
  position: absolute;
  top: 0;
  bottom: 0;
}

.chat-div {
  height: 80%;
}

.chat-list {
  width: 100%;
  height: 60px;
}

.chat-list-div {
  border: 1px solid #d3d3d3;
  margin: auto;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
}


.activeChat {
  color: green;
  background-color: #f0f0f0;
  border-color: green;
}

.chat-list-div:hover {
  background-color: #f0f0f0;
}

.chat-icon {
  margin-left: 10px;
}


.user {
  background-color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ccc;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: calc(100% - 300px);)
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  position: absolute;
  top: 5px;
  width: 100%;
  height: 90%;
  overflow-y: auto;
}

.content::-webkit-scrollbar {
  width: 5px;
}

.content::-webkit-scrollbar-thumb{
  border-radius: 5px;
  background-color: rgba(144, 147, 153, 0.53);
}

.quest {
  position: absolute;
  bottom: 3px;
  width: 80%;
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quest-input {
  width: 90%;
  height: 42px;
}

#submit {
  width: 8%;
  height: 42px;
  margin-left: 10px;
  font-size: 25px;
}

</style>