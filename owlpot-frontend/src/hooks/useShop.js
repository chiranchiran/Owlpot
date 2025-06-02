// src/hooks/useShop.js
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getShopStatus,
  updateShopStatus,
  getMessageCount,
  getShopInfo
} from '../api/shop';

export const useShopStatus = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['shopStatus'],
    queryFn: () => getShopStatus().then(res => res.data.data),
    staleTime: 0,
    refetchInterval: 30 * 1000,
    onError: (error) => {
      showNotification(`获取营业状态失败: ${error.message}`, 'error');
    }
  });
};

export const useUpdateShopStatus = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updateShopStatus,
    onSuccess: (_, status) => {
      queryClient.setQueryData(['shopStatus'], () => ({ status }));
      showNotification(`营业状态已更新`, 'success');
    },
    onError: (error) => {
      showNotification(`更新营业状态失败: ${error.message}`, 'error');
    }
  });
};

export const useMessageCount = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['messageCount'],
    queryFn: () => getMessageCount().then(res => res.data.data),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取消息数量失败: ${error.message}`, 'error');
    }
  });
};

export const useShopInfo = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['shopInfo'],
    queryFn: () => getShopInfo().then(res => res.data.data),
    staleTime: 24 * 60 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取商家信息失败: ${error.message}`, 'error');
    }
  });
};