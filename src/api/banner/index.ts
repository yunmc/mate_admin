import http from "@/api";

export const getBannerList = () => {
  return http.post(`/admin/distribution_channel/get_banner_url`);
};

interface IUpdateBannerParams {
  channel_url?: string;
}
export const updateBanner = (params: IUpdateBannerParams) => {
  return http.post(`/admin/distribution_channel/banner_url`, params);
};
