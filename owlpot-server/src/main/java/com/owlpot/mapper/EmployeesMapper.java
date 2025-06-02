package com.owlpot.mapper;

import com.owlpot.entity.Employees;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * 员工表 Mapper 接口
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Mapper
public interface EmployeesMapper extends BaseMapper<Employees> {

}
