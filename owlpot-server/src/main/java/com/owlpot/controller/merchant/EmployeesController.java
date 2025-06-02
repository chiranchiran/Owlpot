package com.owlpot.controller.merchant;

import com.owlpot.constant.PasswordConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.EmployeeLoginDTO;
import com.owlpot.dto.EmployeePageQueryDTO;
import com.owlpot.entity.Employees;
import com.owlpot.result.PageResult;
import com.owlpot.result.Result;
import com.owlpot.service.EmployeesService;
import com.owlpot.utils.JwtUtils;
import com.owlpot.vo.EmployeeLoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountLockedException;
import javax.security.auth.login.AccountNotFoundException;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 员工表 前端控制器
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@RestController
@RequestMapping("/employees")
public class EmployeesController {
    @Autowired
    private EmployeesService employeesService;
    @Autowired
    private JwtUtils jwtUtils;
    /**
     * 登录
     *
     * @param employeeLoginDTO
     * @return
     */
    @PostMapping("/login")
    public Result<EmployeeLoginVO> login(@RequestBody EmployeeLoginDTO employeeLoginDTO) throws AccountLockedException, AccountNotFoundException {
        log.info("员工登录：{}", employeeLoginDTO);
        Employees employee = employeesService.login(employeeLoginDTO);
        //登录成功后，生成jwt令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtUtils.EMP_USERNAME, employee.getUsername() );
        String token = jwtUtils.generateToken(employee.getId().toString(),claims);
        EmployeeLoginVO employeeLoginVO = EmployeeLoginVO.builder()
                .id(employee.getId())
                .name(employee.getName())
                .token(token)
                .build();
        return Result.success(employeeLoginVO);
    }

    /**
     * 新增员工
     * @return
     */
    @PostMapping
    public Result save(@RequestBody Employees employee){
        log.info("新增员工：{}",employee);
        //设置账号的状态，默认正常状态 1表示正常 0表示锁定
        employee.setStatus(StatusConstant.ENABLE);
        //设置密码，默认密码123456
        employee.setPassword(DigestUtils.md5DigestAsHex(PasswordConstant.DEFAULT_PASSWORD.getBytes()));
        employeesService.save(employee);
        return Result.success();
    }

    /**
     * 员工分页查询
     * @param employeePageQueryDTO
     * @return
     */
    @GetMapping
    public Result<PageResult> page(EmployeePageQueryDTO employeePageQueryDTO){
        log.info("员工分页查询，参数为：{}", employeePageQueryDTO);
        PageResult pageResult = employeesService.pageQuery(employeePageQueryDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据id查询员工信息
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Employees> getById(@PathVariable Long id){
        Employees employee = employeesService.getById(id);
        return Result.success(employee);
    }

    /**
     * 编辑员工信息
     * @return
     */
    @PutMapping("/{id}")
    public Result update(@RequestBody Employees employee){
        log.info("编辑员工信息：{}", employee);
        employeesService.updateById(employee);
        return Result.success();
    }
}
