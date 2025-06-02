package com.owlpot.mapper;

import com.owlpot.entity.Orders;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * 订单表 Mapper 接口
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Mapper
public interface OrdersMapper extends BaseMapper<Orders> {

}
