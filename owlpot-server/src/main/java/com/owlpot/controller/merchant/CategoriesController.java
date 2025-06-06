package com.owlpot.controller.merchant;

import com.owlpot.dto.CategoryPageQueryDTO;
import com.owlpot.entity.Categories;
import com.owlpot.result.PageResult;
import com.owlpot.result.Result;
import com.owlpot.service.CategoriesService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountLockedException;
import javax.security.auth.login.AccountNotFoundException;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 分类表 前端控制器
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@RestController
@RequestMapping("/api/categories")
public class CategoriesController {
    @Autowired
    private CategoriesService CategoriesService;
    /**
     * 新增分类
     * @return
     */
    @PostMapping
    public Result addCate(@RequestBody Categories Category){
        log.info("新增分类：{}",Category);
        CategoriesService.saveCate(Category);
        return Result.success();
    }

    /**
     * 分类分页查询
     * @param CategoryPageQueryDTO
     * @return
     */
    @Operation(summary = "分类分页查询")
    @GetMapping
    public Result<PageResult> getCates(CategoryPageQueryDTO CategoryPageQueryDTO){
        log.info("分类分页查询，参数为：{}", CategoryPageQueryDTO);
        PageResult pageResult = CategoriesService.pageQuery(CategoryPageQueryDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据id查询分类信息
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Categories> getCate(@PathVariable Long id){
        log.info("根据id查询分类信息，id为：{}", id);
        Categories Category = CategoriesService.getById(id);
        return Result.success(Category);
    }
    /**
     * 删除分类
     * @param
     */

    @Operation(summary = "删除分类")
    @DeleteMapping("/{id}")
    public Result deleteCate(@PathVariable Long id){
        log.info("删除分类，id为：{}", id);
        CategoriesService.removeById(id);
        return Result.success();
    }
    /**
     * 编辑分类信息
     * @return
     */
    @PutMapping("/{id}")
    public Result<Categories> updateCate(@RequestBody Categories Category){
        log.info("编辑分类信息：{}", Category);
        if(Category.getName()==null){
            return Result.success();
        }
        CategoriesService.updateById(Category);
        return Result.success(CategoriesService.getById(Category.getId()));
    }
}
