<script setup>
import {ref, watch} from "vue";
import {ChatDotSquare, CloseBold, Delete, Document, Edit, Headset} from "@element-plus/icons-vue";

let chats = ref([
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

let dialogue = ref([
  {
    id: 1,
    type: 1,
    time: "2021-01-01 12:00:00",
    content: "chat1 content"
  },
  {
    id: 2,
    type: 2,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 3,
    type: 1,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 4,
    type: 2,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 5,
    type: 1,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 6,
    type: 2,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 7,
    type: 1,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 8,
    type: 2,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 9,
    type: 1,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
  {
    id: 10,
    type: 2,
    time: "2021-01-01 12:00:00",
    content: "chat2 content"
  },
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

const deleteChat = (item) => {
  chats.value = chats.value.filter(chat => chat.id !== item.id)
  activeId.value = chats.value[0].id
}

const createChat = () => {
  // 向data开头添加元素
  chats.value.unshift({id: chats.value.length + 1, name: 'newChat'})
  problem.value = ''
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
          <button @click="createChat" ref="newChat" class="new-chat">New chat</button>
        </div>
        <el-scrollbar class="chat-div">
          <div class="chat-list" v-for="item in chats">
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
          <div>登录用户</div>
        </div>
      </el-aside>
      <el-main class="main">
        <div class="content">
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
          <el-input class="quest-input" v-model="problem" placeholder="请输入" />
          <el-button id="submit" type="primary" :loading="loading" icon="Position"></el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

.arco-icon {
  font-size: 50px;
}

.my-speak {
  display: flex;
  margin: 10px 0 20px 0;
}

.chat-speak {
  display: flex;
  margin: 10px 0 20px 50px;
}

.my-content {
  margin-left: 30px;
  width: calc(100% - 100px);
}

.chat-content {
  margin-left: 30px;
  width: calc(100% - 100px);
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
  overflow-y: scroll;
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