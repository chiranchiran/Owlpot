package com.owlpot.controller.merchant;

import com.owlpot.dto.DishPageQueryDTO;
import com.owlpot.entity.Dishes;
import com.owlpot.result.PageResult;
import com.owlpot.result.Result;
import com.owlpot.service.DishesService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 菜品表 前端控制器
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@RestController
@RequestMapping("/api/dishes")
public class DishesController {
    @Autowired
    private DishesService dishesService;
    /**
     * 新增菜品
     * @return
     */
    @PostMapping
    public Result addDish(@RequestBody Dishes dish){
        log.info("新增菜品：{}",dish);
        dishesService.saveDish(dish);
        return Result.success();
    }

    /**
     * 菜品分页查询
     * @param
     * @return
     */
    @Operation(summary = "菜品分页查询")
    @GetMapping
    public Result<PageResult> getDishes(DishPageQueryDTO dishPageQueryDTO){
        log.info("菜品分页查询，参数为：{}", dishPageQueryDTO);
        PageResult pageResult = dishesService.pageQuery(dishPageQueryDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据id查询菜品信息
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Dishes> getDish(@PathVariable Long id){
        log.info("根据id查询菜品信息，id为：{}", id);
        Dishes dish = dishesService.getById(id);
        return Result.success(dish);
    }
    /**
     * 删除菜品
     * @param
     */

    @Operation(summary = "删除菜品")
    @DeleteMapping("/{id}")
    public Result deleteDish(@PathVariable Long id){
        log.info("删除菜品，id为：{}", id);
        dishesService.removeById(id);
        return Result.success();
    }
    /**
     * 批量删除菜品
     * @param
     */

    @Operation(summary = "删除菜品")
    @DeleteMapping
    public Result deleteDishes(@RequestParam List<Long> ids){
        log.info("删除菜品，id为：{}", ids);
        dishesService.removeByIds(ids);
        return Result.success();
    }
    /**
     * 编辑菜品信息
     * @return
     */
    @PutMapping("/{id}")
    public Result<Dishes> updateDish(@RequestBody Dishes dishgory){
        log.info("编辑菜品信息：{}", dishgory);
        if(dishgory.getName()==null){
            dishesService.updateById(dishgory);
            return Result.success();
        }
        dishesService.updateById(dishgory);
        return Result.success(dishesService.getById(dishgory.getId()));
    }
}
