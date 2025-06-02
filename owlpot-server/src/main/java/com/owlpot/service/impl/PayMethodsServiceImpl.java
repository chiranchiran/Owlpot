package com.owlpot.service.impl;

import com.owlpot.entity.PayMethods;
import com.owlpot.mapper.PayMethodsMapper;
import com.owlpot.service.PayMethodsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 支付方式表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Service
public class PayMethodsServiceImpl extends ServiceImpl<PayMethodsMapper, PayMethods> implements PayMethodsService {

}
