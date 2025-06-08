package com.owlpot.controller.merchant;

import com.owlpot.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 分类表 前端控制器
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @GetMapping("/status")
    public Result getStatus() {
        log.info("获取店铺状态");
        return Result.success(1);
    }
    @PutMapping("/status")
    public Result updateStatus(Integer status) {
        log.info("更新店铺状态：{}", status);
        return Result.success();
    }
}