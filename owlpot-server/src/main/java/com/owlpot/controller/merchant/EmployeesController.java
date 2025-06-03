package com.owlpot.controller.merchant;

import com.owlpot.constant.PasswordConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.EmployeeLoginDTO;
import com.owlpot.dto.EmployeePageQueryDTO;
import com.owlpot.entity.Employees;
import com.owlpot.result.PageResult;
import com.owlpot.result.Result;
import com.owlpot.service.EmployeesService;
import com.owlpot.utils.JwtUtil;
import com.owlpot.utils.PasswordUtil;
import com.owlpot.vo.EmployeeLoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
@RequestMapping("/api/employees")
public class EmployeesController {
    @Autowired
    private EmployeesService employeesService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordUtil passwordUtil;
    /**
     * 登录
     *
     * @param employeeLoginDTO
     * @return
     */
    @PostMapping("/login")
    public Result<EmployeeLoginVO> EmpLogin(@RequestBody EmployeeLoginDTO employeeLoginDTO) throws AccountLockedException, AccountNotFoundException {
        log.info("员工登录：{}", employeeLoginDTO);
        Employees employee = employeesService.login(employeeLoginDTO);
        //登录成功后，生成jwt令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtUtil.EMP_USERNAME, employee.getUsername() );
        String token = jwtUtil.generateToken(employee.getId().toString(),claims);
        EmployeeLoginVO employeeLoginVO = EmployeeLoginVO.builder()
                .id(employee.getId())
                .name(employee.getName())
                .token(token)
                .role(employee.getRole())
                .build();
        log.info("员工登录成功");
        return Result.success(employeeLoginVO);
    }

    /**
     * 新增员工
     * @return
     */
    @PostMapping
    public Result addEmp(@RequestBody Employees employee){
        log.info("新增员工：{}",employee);
        //设置账号的状态，默认正常状态 1表示正常 0表示锁定
        employee.setStatus(StatusConstant.ENABLE);
        //设置密码，默认密码123456
        employee.setPassword(passwordUtil.encode(PasswordConstant.DEFAULT_PASSWORD));
        employeesService.save(employee);
        return Result.success();
    }

    /**
     * 员工分页查询
     * @param employeePageQueryDTO
     * @return
     */
    @GetMapping
    public Result<PageResult> getEmps(EmployeePageQueryDTO employeePageQueryDTO){
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
    public Result<Employees> getEmp(@PathVariable Long id){
        Employees employee = employeesService.getById(id);
        return Result.success(employee);
    }

    /**
     * 编辑员工信息
     * @return
     */
    @PutMapping("/{id}")
    public Result updateEmp(@RequestBody Employees employee){
        log.info("编辑员工信息：{}", employee);
        employeesService.updateById(employee);
        return Result.success();
    }
}
