package com.owlpot.controller.merchant;

import com.owlpot.entity.PayMethods;
import com.owlpot.result.Result;
import com.owlpot.service.PayMethodsService;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 支付方式表 前端控制器
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@RestController
@Slf4j
@Schema(name = "支付方式相关", description = "支付方式")
@RequestMapping("/payMethods")
public class PayMethodsController {
@Autowired
private PayMethodsService payMethodsService;

    @GetMapping
    public Result<List<PayMethods>> getPayMethods() {
        List<PayMethods> l = payMethodsService.getPayMethods();
        return Result.success(l);
    }
}
