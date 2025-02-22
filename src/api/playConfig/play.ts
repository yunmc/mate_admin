import http from "@/api";
// import { ReqPage } from "@/api/interface/index";

interface getUserListType {
  page: number;
  pageSize: number;
  name?: string;
  state?: string | number;
}
// 获取虚拟人列表
export const getEpisodeList = (params: getUserListType) => {
  return http.post(`/admin/drama/episode_list`, params);
};

//保存剧情集
export const saveEpisode = (params: any) => {
  return http.post(`/admin/drama/save_episode`, params);
};

// 保存剧情季
export const saveSeason = (params: any) => {
  return http.post(`/admin/drama/save_season`, params);
};

// 剧情季列表
export const seasonList = (params: any) => {
  return http.post(`/admin/drama/season_list`, params);
};

// 剧情季列表
export const delSeason = (id: any) => {
  return http.post(`/admin/drama/del_season`, { id: id });
};

// 剧情季列表
export const episodePrompt = (params: any) => {
  return http.post(`/admin/drama/save_episode_prompt`, params);
};

/**
 * 保存 moment（普通模式）的 prompt_list
 * @param params
 * @returns
 */
export const saveEpisodePromptList = (params: any) => {
  return http.post(`/admin/drama/save_episode_prompt_list`, params);
};
