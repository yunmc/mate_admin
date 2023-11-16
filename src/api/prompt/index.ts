import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

export interface variableType {
  variable_name: string;
  variable_cname: string;
  remark: string;
  variable_type: string;
}
export interface listType {
  page?: number;
  pageSize?: number;
}

export interface templateType {
  id: string; //编辑的时候上传
  name: string;
  content: string;
  vars: string;
  remark: string;
}

export interface promptType {
  prompt_template: string;
  prompt_vars: object;
  ai_uid: string;
}
export const addVariable = (params: variableType) => {
  return http.post(`/admin/prompt/add_variable`, params);
};

export const delVariable = (id: string) => {
  return http.post(`/admin/prompt/del_variable`, { id: id });
};

export const getVariableList = (params: listType) => {
  console.log("params", params);
  return http.post(`/admin/prompt/get_variable_list`, params);
};

export const getTemplateList = (params: listType) => {
  return http.post(`/admin/prompt/get_template_list`, params);
};

export const saveTemplate = (params: templateType) => {
  return http.post(`/admin/prompt/save_template`, params);
};

export const delTemplate = (id: string) => {
  return http.post(`/admin/prompt/del_template`, { id: id });
};

export const getRelationship = () => {
  return http.post(`/admin/ai_user/get_relationship`);
};

export const saveAiUserPrompt = (params: promptType) => {
  return http.post(`/admin/ai_user/save_ai_user_prompt`, params);
};

export const getLoraList = (params: listType) => {
  return http.post(`/admin/prompt/get_lora_list`, params);
};

export const delLora = (params: any) => {
  return http.post(`/admin/prompt/del_lora`, params);
};

export const addLora = (params: any) => {
  return http.post(`/admin/prompt/add_lora`, params);
};
