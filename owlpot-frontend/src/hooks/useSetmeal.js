// src/hooks/useSetmeal.js
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getSetmeals,
  getSetmealById,
  deleteSetmeal,
  addSetmeal,
  updateSetmeal
} from '../api/setmeal';

export const useSetmeals = (params = {}) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['setmeals', params],
    queryFn: () => getSetmeals(params).then(res => res.data.data),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取套餐列表失败: ${error.message}`, 'error');
    }
  });
};

export const useSetmeal = (id) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['setmeal', id],
    queryFn: () => getSetmealById(id).then(res => res.data.data),
    enabled: !!id,
    onError: (error) => {
      showNotification(`获取套餐详情失败: ${error.message}`, 'error');
    }
  });
};

export const useAddSetmeal = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: addSetmeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setmeals'] });
      showNotification('套餐添加成功', 'success');
    },
    onError: (error) => {
      showNotification(`添加套餐失败: ${error.message}`, 'error');
    }
  });
};

export const useUpdateSetmeal = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, setmealData }) => updateSetmeal(id, setmealData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['setmeals'] });
      queryClient.setQueryData(['setmeal', variables.id], data.data);
      showNotification('套餐更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`更新套餐失败: ${error.message}`, 'error');
    }
  });
};

export const useDeleteSetmeal = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteSetmeal,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['setmeals'] });
      showNotification('套餐删除成功', 'success');
    },
    onError: (error) => {
      showNotification(`删除套餐失败: ${error.message}`, 'error');
    }
  });
};