package com.owlpot.controller.merchant;

import com.owlpot.dto.DishAddDTO;
import com.owlpot.dto.DishPageQueryDTO;
import com.owlpot.entity.Dishes;
import com.owlpot.result.PageResult;
import com.owlpot.result.Result;
import com.owlpot.service.DishesService;
import com.owlpot.vo.DishAddVO;
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
    @Operation(summary = "新增菜品")
    @PostMapping
    public Result addDish(@RequestBody DishAddDTO dish){
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
    @Operation(summary = "根据id查询菜品信息")
    @GetMapping("/{id}")
    public Result<DishAddVO> getDish(@PathVariable Long id){
        log.info("根据id查询菜品信息，id为：{}", id);
        DishAddVO dish = dishesService.getById(id);
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

    @Operation(summary = "批量删除菜品")
    @DeleteMapping("/batch")
    public Result deleteDishes(@RequestParam("ids") List<Long> ids){
        log.info("删除菜品，id为：{}", ids);
        dishesService.removeByIds(ids);
        return Result.success();
    }
    /**
     * 编辑菜品信息
     * @return
     */
    @PutMapping("/{id}")
    public Result<DishAddVO> updateDish(@RequestBody DishAddDTO dish){
        log.info("编辑菜品信息：{}", dish);
        if(dish.getName()==null){
            Dishes dishes = new Dishes();
            dishes.setId(dish.getId());
            dishes.setStatus(dish.getStatus());
            dishesService.updateById(dishes);
            return Result.success();
        }
        dishesService.updateDishById(dish);
        return Result.success(dishesService.getById(dish.getId()));
    }
}
