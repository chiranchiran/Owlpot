package com.owlpot.controller.merchant;

import com.owlpot.entity.PayMethods;
import com.owlpot.result.Result;
import com.owlpot.service.PayMethodsService;
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
