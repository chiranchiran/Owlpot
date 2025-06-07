// src/hooks/useSetmeal.js
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getSetmealById,
  deleteSetmeal,
  addSetmeal,
  updateSetmeal
} from '../api/setmeal';
import { useNavigate } from 'react-router-dom';

export const useSetmeal = (id) => {
  return useQuery({
    queryKey: ['setmeal', id],
    queryFn: async () => {
      const res = await getSetmealById(id)
      if (res.code === 0) {
        throw new Error(res.msg || '获取套餐数据失败');
      }
      return res.data
    }
  });
};

export const useAddSetmeal = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation({
    mutationFn: addSetmeal,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '添加套餐失败');
      }
      queryClient.invalidateQueries({ queryKey: ['setmeals'] });
      showNotification('套餐添加成功', 'success');
    },
  });
};

export const useUpdateSetmeal = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const navigate = useNavigate()
  return useMutation({
    mutationFn: updateSetmeal,
    onSuccess: (data, variables) => {
      if (data.code === 0) {
        throw new Error(data.msg || '修改套餐信息失败');
      }
      queryClient.invalidateQueries({ queryKey: ['setmeals'] });
      queryClient.setQueryData(['setmeal', variables.id], data.data);
      if (data.data !== null) {
        showNotification('修改套餐信息成功', 'success');
        navigate('/setmeal')
      }
    }
  });
};

export const useDeleteSetmeal = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteSetmeal,
    onSuccess: (data, id) => {
      if (data.code === 0) {
        throw new Error(data.msg || '删除套餐失败');
      }
      queryClient.invalidateQueries({ queryKey: ['setmeals'] });
      showNotification('套餐删除成功', 'success');
    }
  });
};