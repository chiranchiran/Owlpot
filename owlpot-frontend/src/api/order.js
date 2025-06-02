import http from '../utils/http';

// 商家查询订单
export const getMerchantOrders = (params = {}) => {
  return http.get('/merchant/orders', { params });
};

// 用户查询订单
export const getUserOrders = (params = {}) => {
  return http.get('/users/orders', { params });
};

// 商家查询单个订单
export const getMerchantOrderById = (id) => {
  return http.get(`/merchant/orders/${id}`);
};

// 用户查询单个订单
export const getUserOrderById = (id) => {
  return http.get(`/orders/users/${id}`);
};

// 更新订单
export const updateOrder = (id, orderData) => {
  return http.put(`/orders/${id}`, orderData);
};

// 创建订单
export const createOrder = (orderData) => {
  return http.post('/orders', orderData);
};