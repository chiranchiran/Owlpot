import http from '../utils/http';

// 查询菜品列表
export const getDishes = (params) => {
  return http.get('/dishes', params);
};

// 查询单个菜品
export const getDishById = (id) => {
  return http.get(`/dishes/${id}`);
};

// // 检查菜品是否关联套餐
// export const checkDishSetmealRelation = (id) => {
//   return http.get(`/dishes/${id}/relation`);
// };

// 删除菜品
export const deleteDish = (id) => {
  return http.delete(`/dishes/${id}`,);
};
export const deleteDishes = (ids) => {
  return http.delete(`/dishes/batch?ids=${ids.join(',')}`);
};

// 添加菜品
export const addDish = (dishData) => {
  return http.post('/dishes', dishData);
};

// 更新菜品
export const updateDish = (dishData) => {
  return http.put(`/dishes/${dishData.id}`, dishData);
};
//上传图片
export const upImage = (file) => {
  return http.post('/upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}