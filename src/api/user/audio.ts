import http from "@/api";
export interface ReqPage {
  pageNum?: number;
  pageSize?: number;
}
export namespace App {
  export interface ResConfig extends ReqPage {
    voice_id: string; // 音频id
    source_url: string; // 音频url
    weight: string; // 最新版本
    is_vip: string; // 更新类型
    id?: number;
    voice_title?: string;
  }
}

// 删除
export const setVoiceDel = (params: string | object | undefined) => {
  return http.post(`/admin/ai_user_custom_voice/del`, params);
};

// 保持编辑
export const setVoiceSave = (params: App.ResConfig) => {
  return http.post(`/admin/ai_user_custom_voice/save`, params);
};

// 语音列表
export const getVoiceList = () => {
  return http.get(`/admin/ai_user_custom_voice/list`);
};
