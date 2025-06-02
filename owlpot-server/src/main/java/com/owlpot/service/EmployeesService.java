package com.owlpot.service;

import com.owlpot.dto.EmployeeLoginDTO;
import com.owlpot.dto.EmployeePageQueryDTO;
import com.owlpot.entity.Employees;
import com.baomidou.mybatisplus.extension.service.IService;
import com.owlpot.result.PageResult;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountLockedException;
import javax.security.auth.login.AccountNotFoundException;

/**
 * <p>
 * 员工表 服务类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Service
public interface EmployeesService extends IService<Employees> {

    PageResult pageQuery(EmployeePageQueryDTO employeePageQueryDTO);

    Employees login(EmployeeLoginDTO employeeLoginDTO) throws AccountNotFoundException, AccountLockedException;
}
