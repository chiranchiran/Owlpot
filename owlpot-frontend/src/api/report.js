import http from '../utils/http';

// 获取今日数据
export const getTodayData = () => {
  return http.get('/report/todayData');
};

// 获取各类订单数量
export const getOrdersCount = () => {
  return http.get('/report/ordersCount');
};

// 获取菜品套餐数量
export const getDishSetmealCount = () => {
  return http.get('/report/dishCount');
};

// 获取订单统计
export const getOrderStatistics = (timePeriod) => {
  return http.get('/report/totalOrders', { params: { time: timePeriod } });
};

// 获取营业额统计
export const getTurnoverStatistics = (timePeriod) => {
  return http.get('/report/totalTurnover', { params: { time: timePeriod } });
};

// 获取用户统计
export const getUserStatistics = (timePeriod) => {
  return http.get('/report/totalUsers', { params: { time: timePeriod } });
};

// 获取销量统计
export const getSalesStatistics = (timePeriod) => {
  return http.get('/report/totalSales', { params: { time: timePeriod } });
};