import http from '../utils/http';

// 查询分类列表
export const getCategories = (params = {}) => {
  return http.get('/categories', { params });
};

// 查询单个分类
export const getCategoryById = (id) => {
  return http.get(`/categories/${id}`);
};

// 查询分类下产品数量
export const getCategoryProductCount = (id) => {
  return http.get(`/categories/${id}/products`);
};

// 删除分类
export const deleteCategory = (id) => {
  return http.delete(`/categories/${id}`);
};

// 添加分类
export const addCategory = (categoryData) => {
  return http.post('/categories', categoryData);
};

// 更新分类
export const updateCategory = (id, categoryData) => {
  return http.put(`/categories/${id}`, categoryData);
};