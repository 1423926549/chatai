import request from "@/utils/request";

export const getChatsService = () => {
    return request.get("/chats/list")
}

export const createChatService = () => {
    return request.post("/chats/create")
}

export const editChatService = (data) => {
    console.log(data)
    return request.put("/chats/edit", data)
}

export const deleteChatService = (id) => {
    return request.delete(`/chats/delete/${id}`)
}
