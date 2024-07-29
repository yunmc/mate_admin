import http from "@/api";

export const getBannerList = () => {
  return http.post(`/admin/distribution_channel/get_banner_url`);
};

interface IUpdateChannelParams {
  id: number;
  channel_name: string;
  ai_uid?: string;
  channel_url?: string;
  online_status: number;
}
export const updateChannel = (params: IUpdateChannelParams) => {
  return http.post(`/admin/distribution_channel/update`, params);
};

interface ISaveChannelParams {
  channel_name: string;
  ai_uid?: string;
  channel_url?: string;
  online_status: number;
}
export const saveChannel = (params: ISaveChannelParams) => {
  return http.post(`/admin/distribution_channel/save`, params);
};

interface IDeleteChannelParams {
  id: number;
}
export const deleteChannel = (params: IDeleteChannelParams) => {
  return http.post(`/admin/distribution_channel/delete`, params);
};

export const getAllChannelList = (params: any) => {
  return http.post(`/admin/distribution_channel/list_all`, params);
};
