// src/hooks/useDishes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDishById,
  addDish,
  updateDish,
  deleteDish,
  deleteDishes,
  getFlavors
} from '../api/dish';
import { useNotification } from '../components/common/NotificationContext';
import { useNavigate } from 'react-router-dom';
// 获取菜品列表

export const useDish = (id) => {
  return useQuery({
    queryKey: ['dish', id],
    queryFn: async () => {
      const res = await getDishById(id)
      if (res.code === 0) {
        throw new Error(res.msg || '获取菜品数据失败');
      }
      return res.data
    },
    enabled: !!id,
  });
};

export const useAddDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation({
    mutationFn: addDish,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '添加菜品失败');
      }
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      showNotification('菜品添加成功', 'success');
    },
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const navigate = useNavigate()
  return useMutation({
    mutationFn: updateDish,
    onSuccess: (data, variables) => {
      if (data.code === 0) {
        throw new Error(data.msg || '修改菜品信息失败');
      }
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      queryClient.setQueryData(['dish', variables.id], data.data);
      if (data.data !== null) {
        showNotification('修改菜品信息成功', 'success');
        navigate('/dish')
      }
    }
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteDish,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '删除菜品失败');
      }
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      showNotification('菜品删除成功', 'success');
    }
  });
};
export const useDeleteDishes = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteDishes,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '批量删除菜品失败');
      }
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      showNotification('批量菜品删除成功', 'success');
    }
  });
};