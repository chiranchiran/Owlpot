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

export const useCategories = (params = {}) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params).then(res => res.data.data),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取分类失败: ${error.message}`, 'error');
    }
  });
};

export const useCategory = (id) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id).then(res => res.data.data),
    enabled: !!id,
    onError: (error) => {
      showNotification(`获取分类详情失败: ${error.message}`, 'error');
    }
  });
};

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

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('分类添加成功', 'success');
    },
    onError: (error) => {
      showNotification(`添加分类失败: ${error.message}`, 'error');
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, categoryData }) => updateCategory(id, categoryData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.setQueryData(['category', variables.id], data.data);
      showNotification('分类更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`更新分类失败: ${error.message}`, 'error');
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('分类删除成功', 'success');
    },
    onError: (error) => {
      showNotification(`删除分类失败: ${error.message}`, 'error');
    }
  });
};