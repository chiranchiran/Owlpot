package com.owlpot.service.impl;

import com.owlpot.entity.OrdersFood;
import com.owlpot.mapper.OrdersFoodMapper;
import com.owlpot.service.OrdersFoodService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 订单菜品关联表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Service
public class OrdersFoodServiceImpl extends ServiceImpl<OrdersFoodMapper, OrdersFood> implements OrdersFoodService {

}
