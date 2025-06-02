import http from '../utils/http';

// 获取营业状态
export const getShopStatus = () => {
  return http.get('/shop/status');
};

// 修改营业状态
export const updateShopStatus = (status) => {
  return http.put('/shop/status', { status });
};

// 获取消息数量
export const getMessageCount = () => {
  return http.get('/shop/messageCount');
};

// 获取商家信息
export const getShopInfo = () => {
  return http.get('/shop');
};