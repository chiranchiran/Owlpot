import { useQueryClient, useMutation } from "@tanstack/react-query";
import { upImage } from "../api/dish";
export const useUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upImage,
    onSuccess: (data) => {
      if (data.code === 0) {
        // throw new Error(data.msg || '上传图片失败');
      }
      queryClient.invalidateQueries({ queryKey: ['image'] });
    }
  });
};