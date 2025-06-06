package com.owlpot.service;

import com.owlpot.entity.PayMethods;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 支付方式表 服务类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
public interface PayMethodsService extends IService<PayMethods> {

    List<PayMethods> getPayMethods();
}
