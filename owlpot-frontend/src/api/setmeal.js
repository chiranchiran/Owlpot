import http from '../utils/http';

// 查询套餐列表
export const getSetmeals = (params) => {
  return http.get('/setmeals', params);
};

// 查询单个套餐
export const getSetmealById = (id) => {
  return http.get(`/setmeals/${id}`);
};

// 删除套餐
export const deleteSetmeal = (id) => {
  return http.delete(`/setmeals/${id}`);
};

// 添加套餐
export const addSetmeal = (setmealData) => {
  return http.post('/setmeals', setmealData);
};

// 更新套餐
export const updateSetmeal = (setmealData) => {
  return http.put(`/setmeals/${setmealData.id}`, setmealData);
};