import request from "@/utils/request";

export const getTalkListService = (id) => {
  return request.get(`/talk/list/${id}`);
};

export const sendQuestionService = (data) => {
  return request.post('/talk/send', data);
};

export const getAnswersService = (data) => {
  return request.post('/talk/answers', data);
};