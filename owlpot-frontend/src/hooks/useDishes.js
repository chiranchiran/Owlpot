// src/hooks/useDishes.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getDishes,
  getDishById,
  addDish,
  updateDish,
  deleteDish,
  checkDishSetmealRelation
} from '../api/dish';
import { useNotification } from './useNotification';

// 获取菜品列表
export const useDishes = (params = {}) => {
  const { showNotification } = useNotification();

  return useQuery(
    ['dishes', params], // 查询键，包含参数
    () => getDishes(params).then(res => res.data.data.records),
    {
      staleTime: 5 * 60 * 1000, // 5分钟内不会重新请求
      keepPreviousData: true, // 在获取新数据时保留旧数据
      onError: (error) => {
        showNotification(`获取菜品失败: ${error.message}`, 'error');
      }
    }
  );
};

// 获取单个菜品
export const useDish = (id) => {
  const { showNotification } = useNotification();

  return useQuery(
    ['dish', id],
    () => getDishById(id).then(res => res.data.data),
    {
      enabled: !!id, // 只有id存在时才启用查询
      onError: (error) => {
        showNotification(`获取菜品详情失败: ${error.message}`, 'error');
      }
    }
  );
};

// 添加菜品
export const useAddDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (dishData) => addDish(dishData),
    onSuccess: (data) => {
      // 更新缓存
      queryClient.invalidateQueries('dishes');
      showNotification('菜品添加成功', 'success');
      return data;
    },
    onError: (error) => {
      showNotification(`添加菜品失败: ${error.message}`, 'error');
    }
  });
};

// 更新菜品
export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, ...data }) => updateDish(id, data),
    onSuccess: (data, variables) => {
      // 1. 使整个列表失效
      queryClient.invalidateQueries('dishes');

      // 2. 直接更新缓存中的单个菜品（可选，更高效）
      queryClient.setQueryData(['dish', variables.id], data.data);

      showNotification('菜品更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`更新菜品失败: ${error.message}`, 'error');
    }
  });
};

// 删除菜品
export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (id) => deleteDish(id),
    onSuccess: (_, id) => {
      // 更新缓存
      queryClient.invalidateQueries('dishes');
      showNotification('菜品删除成功', 'success');
    },
    onError: (error) => {
      showNotification(`删除菜品失败: ${error.message}`, 'error');
    }
  });
};

// 删除菜品前检查关联
export const useCheckDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (id) => checkDishSetmealRelation(id),
    onSuccess: (data, id) => {
      // 根据后端返回的数据判断菜品是否关联套餐
      if (data.data) {
        showNotification('菜品与套餐存在关联，无法删除！', 'error');
      }
    },
    onError: (error) => {
      showNotification(`检查菜品关联套餐失败: ${error.message}`, 'error');
    }
  });
};