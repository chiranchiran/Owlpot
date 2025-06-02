package com.owlpot.service.impl;

import com.owlpot.entity.Orders;
import com.owlpot.mapper.OrdersMapper;
import com.owlpot.service.OrdersService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 订单表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Service
public class OrdersServiceImpl extends ServiceImpl<OrdersMapper, Orders> implements OrdersService {

}
