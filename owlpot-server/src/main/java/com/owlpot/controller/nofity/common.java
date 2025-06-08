package com.owlpot.controller.nofity;

import com.owlpot.constant.MessageConstant;
import com.owlpot.result.Result;
import com.owlpot.utils.AliOssUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Slf4j
public class common {
    @Autowired
    private AliOssUtil aliOssUtil;
    /**
     * 退出登录
     *
     * @return
     */
    @PostMapping("/logout")
    public Result logout() {
        return Result.success();
    }
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile image){
        log.info("文件上传：{}",image);

        try {
            //原始文件名
            String originalFilename = image.getOriginalFilename();
            //截取原始文件名的后缀   dfdfdf.png
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            //构造新文件名称
            String objectName = UUID.randomUUID().toString() + extension;

            //文件的请求路径
            String imagePath = aliOssUtil.upload(image.getBytes(), objectName);
            return Result.success(imagePath);
        } catch (IOException e) {
            log.error("文件上传失败：{}", e);
        }

        return Result.error(MessageConstant.UPLOAD_FAILED);
    }
}
