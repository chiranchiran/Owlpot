package com.owlpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.owlpot.entity.PayMethods;
import com.owlpot.mapper.PayMethodsMapper;
import com.owlpot.service.PayMethodsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    @Autowired
    private PayMethodsMapper payMethodsMapper;

    @Override
    public List<PayMethods> getPayMethods() {
        QueryWrapper<PayMethods> queryWrapper = new QueryWrapper<PayMethods>()
                .select("id", "name", "icon_url")
                .eq("is_active", 1)
                .orderByAsc("id");
        List<PayMethods> payMethods = payMethodsMapper.selectList(queryWrapper);
        return payMethods;
    }
}
