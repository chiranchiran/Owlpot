package com.owlpot.controller.merchant;

import com.owlpot.entity.Regions;
import com.owlpot.result.Result;
import com.owlpot.service.RegionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 地区表 前端控制器
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@RestController
@RequestMapping("/api/regions")
public class RegionsController {
    @Autowired
    private RegionsService regionsService;


    @GetMapping("/provinces")
    public Result<List<Regions>> getProvinces() {
        log.info("获取省");
        List<Regions> l = regionsService.getProvinces();
        return Result.success(l);
    }
    @GetMapping("/cities")
    public Result<List<Regions>> getCities(String code) {
        log.info("获取市");
        List<Regions> l = regionsService.getCities(code);
        return Result.success(l);

    }
    @GetMapping("/districts")
    public Result<List<Regions>> getDistricts(String code) {
        log.info("获取区");
        List<Regions> l = regionsService.getDistricts(code);
        return Result.success(l);
    }
}
