// src/hooks/useShop.js
import { useDispatch } from 'react-redux';
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
import { setStatus } from '../redux/slices/appSlice';

export const useShopStatus = () => {
  const dishpatch = useDispatch();
  return useQuery({
    queryKey: ['shopStatus'],
    queryFn: async () => {
      const res = await getShopStatus()
      if (res.code === 0) {
        throw new Error(res.msg || '获取营业状态失败');
      }
      dishpatch(setStatus(res.data));
      return res.data
    }
  });
};

export const useUpdateShopStatus = () => {
  const { showNotification } = useNotification();
  const dishpatch = useDispatch();
  return useMutation({
    mutationFn: updateShopStatus,
    onSuccess: (res, status) => {
      if (res.code === 0) {
        throw new Error(res.msg || '更新营业状态失败');
      }
      dishpatch(setStatus(status));
      showNotification(`营业状态已更新`, 'success');
    },
  });
};

export const useMessageCount = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['messageCount'],
    queryFn: () => getMessageCount().then(res => res.data.data),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

export const useShopInfo = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['shopInfo'],
    queryFn: () => getShopInfo().then(res => res.data.data),
    staleTime: 24 * 60 * 60 * 1000,
  });
};