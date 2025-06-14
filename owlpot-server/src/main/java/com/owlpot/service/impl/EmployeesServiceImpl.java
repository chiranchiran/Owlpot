package com.owlpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.owlpot.constant.MessageConstant;
import com.owlpot.constant.PasswordConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.EmployeeChangePwdDTO;
import com.owlpot.dto.EmployeeLoginDTO;
import com.owlpot.dto.EmployeePageQueryDTO;
import com.owlpot.entity.Employees;
import com.owlpot.exception.PasswordErrorException;
import com.owlpot.mapper.EmployeesMapper;
import com.owlpot.result.PageResult;
import com.owlpot.service.EmployeesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.owlpot.utils.PasswordUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountLockedException;
import javax.security.auth.login.AccountNotFoundException;
import java.util.List;

/**
 * <p>
 * 员工表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@Service
public class EmployeesServiceImpl extends ServiceImpl<EmployeesMapper, Employees> implements EmployeesService {
    @Autowired
    private EmployeesMapper employeesMapper;

    @Override
    public PageResult pageQuery(EmployeePageQueryDTO emp) {
        Page<Employees> page = new Page<>(emp.getCurrentPage(), emp.getPageSize());  // 第1页，每页10条
        QueryWrapper<Employees> wrapper = new QueryWrapper<>();
        wrapper.like(null != emp.getName(), "name", emp.getName());
        wrapper.orderByDesc("update_time");
        wrapper.select("id", "username","name", "phone","status","role", "update_time");
        Page<Employees> pages = employeesMapper.selectPage(page, wrapper);
        List<Employees> records = pages.getRecords();  // 当前页数据
        long total = pages.getTotal();
        log.info("查询成功：{}", total);
        return new PageResult(total, records);
    }

    @Override
    public Employees login(EmployeeLoginDTO employeeLoginDTO) throws AccountNotFoundException, AccountLockedException {
        String username = employeeLoginDTO.getUsername();
        String password = employeeLoginDTO.getPassword();
        //1、根据用户名查询数据库中的数据
        QueryWrapper<Employees> wrapper = new QueryWrapper<>();
        wrapper.select("id", "name", "role", "password", "status");
        wrapper.eq("username", username);
        Employees employee = employeesMapper.selectOne(wrapper);
        //2、处理各种异常情况（用户名不存在、密码不对、账号被锁定）
        if (employee == null) {
            //账号不存在
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        try {
            boolean flag = PasswordUtil.matches(password, employee.getPassword());
        } catch (Exception e) {
            log.info("密码比对失败");
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }
        if (employee.getStatus() == StatusConstant.DISABLE) {
            //账号被锁定
            throw new AccountLockedException(MessageConstant.ACCOUNT_LOCKED);
        }
        //3、返回实体对象
        return employee;
    }

    @Override
    public void updateEmpPassword(Long id, EmployeeChangePwdDTO employeeChangePwdDTO) throws AccountNotFoundException, AccountLockedException {
        QueryWrapper<Employees> wrapper = new QueryWrapper<>();
        wrapper.eq("id", id);
        Employees employee = employeesMapper.selectOne(wrapper);
        if (employee == null) {
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        if (employee.getStatus() == StatusConstant.DISABLE) {
            throw new AccountLockedException(MessageConstant.ACCOUNT_LOCKED);
        }
        boolean flag = PasswordUtil.matches(employeeChangePwdDTO.getOldPassword(), employee.getPassword());
        if (!flag) {
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }
        Employees employees = new Employees();
        employees.setId(id);
        String changePwd = PasswordUtil.encode(employeeChangePwdDTO.getNewPassword());
        employees.setPassword(changePwd);
        employeesMapper.updateById(employees);
        log.info("密码修改成功");
    }
    @Override
    public Employees getById(Long id) {
        Employees e = employeesMapper.selectById(id);
        e.setPassword(null);
        return e;
    }

    @Override
    public void saveEmp(Employees employee) {
        Employees emp = getByUsername(employee.getUsername());
        if (emp != null) {
            throw new RuntimeException(MessageConstant.ACCOUNT_EXIST);
        }
        //设置密码，默认密码123456
        employee.setPassword(PasswordUtil.encode(PasswordConstant.DEFAULT_PASSWORD));
        employeesMapper.insert(employee);
    }

    public Employees getByUsername(String username) {
        QueryWrapper<Employees> wrapper = new QueryWrapper<>();
        wrapper.eq("username", username);
        return employeesMapper.selectOne(wrapper);
    }
}
