// src/hooks/useCategory.js
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getCategories,
  getCategoryById,
  getCategoryProductCount,
  deleteCategory,
  addCategory,
  updateCategory
} from '../api/category';
import { useNavigate } from 'react-router-dom';
// export const useCategories = (params = {}) => {
//   const { showNotification } = useNotification();

//   return useQuery({
//     queryKey: ['categories', params],
//     queryFn: () => getCategories(params).then(res => res.data.data),
//     staleTime: 5 * 60 * 1000,
//     onError: (error) => {
//       showNotification(`获取分类失败: ${error.message}`, 'error');
//     }
//   });
// };
export const useCategoryProductCount = (id) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['categoryProductCount', id],
    queryFn: () => getCategoryProductCount(id).then(res => res.data.data),
    enabled: !!id,
    onError: (error) => {
      showNotification(`获取分类产品数量失败: ${error.message}`, 'error');
    }
  });
};
export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const res = await getCategoryById(id)
      if (res.code === 0) {
        throw new Error(res.msg || '获取分类详情失败');
      }
      return res.data
    }
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation({
    mutationFn: addCategory,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '分类添加成功');
      }
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('分类添加成功', 'success');
    },
  });
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const navigate = useNavigate()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, variables) => {
      if (data.code === 0) {
        throw new Error(data.msg || '修改分类信息失败');
      }
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.setQueryData(['employee', variables.id], data.data);
      if (data.data !== null) {
        showNotification('修改分类信息成功', 'success');
        navigate('/category')
      }
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data, id) => {
      if (data.code === 0) {
        throw new Error(data.msg || '删除分类失败');
      }
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('分类删除成功', 'success');
    }
  });
};