package com.owlpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.owlpot.constant.MessageConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.EmployeeLoginDTO;
import com.owlpot.dto.EmployeePageQueryDTO;
import com.owlpot.entity.Employees;
import com.owlpot.exception.PasswordErrorException;
import com.owlpot.mapper.EmployeesMapper;
import com.owlpot.result.PageResult;
import com.owlpot.service.EmployeesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

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
@Service
public class EmployeesServiceImpl extends ServiceImpl<EmployeesMapper, Employees> implements EmployeesService {
    @Autowired
    private EmployeesMapper employeesMapper;

    @Override
    public PageResult pageQuery(EmployeePageQueryDTO emp) {
        Page<Employees> page = new Page<>(emp.getCurrentPage(), emp.getPageSize());  // 第1页，每页10条
        QueryWrapper<Employees> wrapper = new QueryWrapper<>();
        wrapper.like("name", emp.getName());

        Page<Employees> pages = employeesMapper.selectPage(page, wrapper);
        List<Employees> records = pages.getRecords();  // 当前页数据
        long total = pages.getTotal();           // 总记录数
        return new PageResult(total, records);
    }

    @Override
    public Employees login(EmployeeLoginDTO employeeLoginDTO) throws AccountNotFoundException, AccountLockedException {
        String username = employeeLoginDTO.getUsername();
        String password = employeeLoginDTO.getPassword();
        //1、根据用户名查询数据库中的数据
        QueryWrapper<Employees> wrapper = new QueryWrapper<>();
        wrapper.select("id","name","role","password","status");
        wrapper.eq("username", employeeLoginDTO.getUsername());
        Employees employee = employeesMapper.selectOne(wrapper);
        //2、处理各种异常情况（用户名不存在、密码不对、账号被锁定）
        if (employee == null) {
            //账号不存在
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        //密码比对
        //对前端传过来的明文密码进行md5加密处理
        password = DigestUtils.md5DigestAsHex(password.getBytes());
        if (!password.equals(employee.getPassword())) {
            //密码错误
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }
        if (employee.getStatus() == StatusConstant.DISABLE) {
            //账号被锁定
            throw new AccountLockedException(MessageConstant.ACCOUNT_LOCKED);
        }
        //3、返回实体对象
        return employee;
    }
}
