package com.owlpot.controller.merchant;

import com.owlpot.constant.PasswordConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.EmployeeChangePwdDTO;
import com.owlpot.dto.EmployeeLoginDTO;
import com.owlpot.dto.EmployeePageQueryDTO;
import com.owlpot.entity.Employees;
import com.owlpot.result.PageResult;
import com.owlpot.result.Result;
import com.owlpot.service.EmployeesService;
import com.owlpot.utils.JwtUtil;
import com.owlpot.utils.PasswordUtil;
import com.owlpot.vo.EmployeeLoginVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "员工相关", description = "员工")
@Slf4j
@RestController
@RequestMapping("/api/employees")
public class EmployeesController {
    @Autowired
    private EmployeesService employeesService;
    @Autowired
    private JwtUtil jwtUtil;
    /**
     * 登录
     *
     * @param employeeLoginDTO
     * @return
     */
    @Operation(summary = "员工登录")
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
    @Operation(summary = "新增员工")
    @PostMapping
    public Result addEmp(@RequestBody Employees employee){
        log.info("新增员工：{}",employee);
        employeesService.saveEmp(employee);
        return Result.success();
    }

    /**
     * 员工分页查询
     * @param employeePageQueryDTO
     * @return
     */
    @Operation(summary = "员工分页查询")
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
    @Operation(summary = "根据id查询员工信息")
    @GetMapping("/{id}")
    public Result<Employees> getEmp(@PathVariable Long id){
        log.info("根据id查询员工信息，id为：{}", id);
        Employees employee = employeesService.getById(id);
        return Result.success(employee);
    }
    /**
     * 删除员工
     * @param
     */

    @Operation(summary = "删除员工")
    @DeleteMapping("/{id}")
    public Result deleteEmp(@PathVariable Long id){
        log.info("删除员工，id为：{}", id);
        employeesService.removeById(id);
        return Result.success();
    }
    /**
     * 编辑员工信息
     * @return
     */
    @Operation(summary = "编辑员工信息")
    @PutMapping("/{id}")
    public Result<Employees> updateEmp(@RequestBody Employees employee){
        log.info("编辑员工信息：{}", employee);
        if(employee.getName()==null){
            return Result.success();
        }
        employeesService.updateById(employee);
        return Result.success(employeesService.getById(employee.getId()));
    }
    /**
     * 修改员工密码
     */
    @Operation(summary = "修改员工密码")
    @PutMapping("/{id}/password")
    public Result updateEmpPassword(@PathVariable Long id, @RequestBody EmployeeChangePwdDTO employeeChangePwdDTO) throws AccountLockedException, AccountNotFoundException {
        log.info("修改员工密码：{}", employeeChangePwdDTO);
        employeesService.updateEmpPassword(id, employeeChangePwdDTO);
        return Result.success();
    }
}
