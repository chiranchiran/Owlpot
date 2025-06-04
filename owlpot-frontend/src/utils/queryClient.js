// QueryClientProvider.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import { handleApiError } from './errorhandler';

export const QueryClientProviderWrapper = ({ children }) => {
  const { showNotification } = useNotification(); // 

  // 创建 QueryClient 实例
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchInterval: 300 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        onError: (error) => {
          const message = handleApiError(error);
          showNotification(message, 'error');
        }
      },
      mutations: {
        onError: (error) => {
          const message = handleApiError(error);
          showNotification(message, 'error');
        }
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};