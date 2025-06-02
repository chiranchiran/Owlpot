import http from '../utils/http';

// 查询菜品列表
export const getDishes = (params = {}) => {
  return http.get('/dishes', { params });
};

// 查询单个菜品
export const getDishById = (id) => {
  return http.get(`/dishes/${id}`);
};

// 检查菜品是否关联套餐
export const checkDishSetmealRelation = (id) => {
  return http.get(`/dishes/${id}/relation`);
};

// 删除菜品
export const deleteDish = (id, status) => {
  return http.delete(`/dishes/${id}`, { data: { status } });
};

// 添加菜品
export const addDish = (dishData) => {
  return http.post('/dishes', dishData);
};

// 更新菜品
export const updateDish = (id, dishData) => {
  return http.put(`/dishes/${id}`, dishData);
};