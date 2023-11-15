<script setup>
import {ref, watch} from "vue";
import {ChatDotSquare, CloseBold, Delete, Document, Edit} from "@element-plus/icons-vue";

let data = ref([
  {id: 1, name: "chat1"},
  {id: 2, name: "chat2"},
  {id: 3, name: "chat3chat3chat3chat3chat3chat3chat3chat3"},
  {id: 4, name: "chat4"},
  {id: 5, name: "chat5"},
  {id: 6, name: "chat6"},
  {id: 7, name: "chat7"},
  {id: 8, name: "chat8"},
  {id: 9, name: "chat9"},
  {id: 10, name: "chat10"},
  {id: 11, name: "chat11"},
  {id: 12, name: "chat12"},
  {id: 13, name: "chat13"},
  {id: 14, name: "chat14"},
  {id: 15, name: "chat15"}
])

const problem = ref('')
let loading = ref(false)
let activeId = ref(1)
let editChatId = ref(0)
let editChatName = ref('')

const changeActive = (id) => {
  activeId.value = id
}

const editChat = (item) => {
  editChatName.value = item.name
  editChatId.value = item.id
}

const saveChatName = (item) => {
  item.name = editChatName.value
  editChatId.value = 0
}

watch((activeId), () => {
  editChatId.value = 0
})

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="left">
        <div class="new-chat-div">
          <button ref="newChat" class="new-chat">New chat</button>
        </div>
        <el-scrollbar class="chat-div">
          <div class="chat-list" v-for="item in data">
            <div :class="{ activeChat : item.id === activeId} " class="chat-list-div" @click="changeActive(item.id)">
              <el-icon class="chat-icon"><ChatDotSquare /></el-icon>

              <span v-show="item.id !== editChatId" class="chat-name">{{ item.name }}</span>
              <el-input
                  v-model="editChatName"
                  class="w-50 m-2 chat-name-input"
                  v-show="item.id === activeId && item.id === editChatId"
              />
              <div class="chat-operation" v-show="item.id === activeId && item.id !== editChatId">
                <el-icon class="chat-operation-icon" @click="editChat(item)"><Edit /></el-icon>
                <el-icon class="chat-operation-icon"><Delete /></el-icon>
              </div>
              <div class="chat-operation"  v-show="item.id === activeId && item.id === editChatId">
                <el-icon class="chat-operation-icon" @click="saveChatName(item)"><Select /></el-icon>
                <el-icon class="chat-operation-icon"><CloseBold /></el-icon>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="user">
          <div>登录用户</div>
        </div>
      </el-aside>
      <el-main class="main">
        <div class="content"></div>
        <div class="quest">
          <el-input class="quest-input" v-model="problem" placeholder="请输入" />
          <el-button id="submit" type="primary" :loading="loading" icon="Position"></el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

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
  width: 97%;
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
  //overflow-y: auto;
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
  width: 95%;
  height: 90%;
  border: 1px solid #ccc;
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