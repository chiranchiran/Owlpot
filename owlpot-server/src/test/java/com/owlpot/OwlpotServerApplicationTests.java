package com.owlpot;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.VelocityTemplateEngine;
import com.owlpot.utils.PasswordUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;

//@SpringBootTest
class OwlpotServerApplicationTests {

    @Test
    void getPassword() {
        PasswordUtil passwordUtil = new PasswordUtil();
        String password = passwordUtil.encode("123456");
        System.out.println("加密后的密码为：" + password);
    }
    @Test
    public  void getCode() {
        // 使用 FastAutoGenerator 替代旧版 AutoGenerator
        FastAutoGenerator.create(
                        "jdbc:mysql://localhost:3306/owlpot",
                        "root",
                        "622103"
                )
                // 全局配置
                .globalConfig(builder -> {
                    builder.author("池苒") // 作者
                            .outputDir(System.getProperty("user.dir") + "/src/main/java") // 输出目录
                            .disableOpenDir() // 生成后不打开目录
                            .dateType(DateType.ONLY_DATE) // 日期类型
                            .commentDate("yyyy-MM-dd"); // 注释日期格式
                })
                // 包配置
                .packageConfig(builder -> {
                    builder.parent("com.owlpot") // 父包名
                            .moduleName("") // 模块名（可为空）
                            .entity("entity") // 实体类包名
                            .mapper("mapper") // Mapper 接口包名
                            .service("service") // Service 接口包名
                            .serviceImpl("service.impl") // Service 实现类包名
                            .controller("controller") // Controller 包名
                            .pathInfo(Collections.singletonMap(OutputFile.xml,
                                    System.getProperty("user.dir") + "/src/main/resources/mapper")); // XML 文件位置
                })
                // 策略配置
                .strategyConfig(builder -> {
                    builder.addInclude("regions", "address_book", "orders","address_book","categories","dish_flavors","dishes","employees","orders_food","pay_methods","setmeals","setmeal_dish","shopping_cart") // 包含的表
                            .entityBuilder() // 实体策略
                            .enableLombok() // 启用 Lombok
                            .naming(NamingStrategy.underline_to_camel) // 表名转驼峰
                            .columnNaming(NamingStrategy.underline_to_camel) // 列名转驼峰
                            .idType(IdType.AUTO) // ID 生成策略
                            .enableTableFieldAnnotation() // 字段注解
                            .logicDeleteColumnName("deleted") // 逻辑删除字段
                            .mapperBuilder() // Mapper 策略
                            .formatMapperFileName("%sMapper") // Mapper 接口命名格式
                            .controllerBuilder() // Controller 策略
                            .enableRestStyle() // RESTful 风格
                            .serviceBuilder() // Service 策略
                            .formatServiceFileName("%sService") // Service 接口命名
                            .formatServiceImplFileName("%sServiceImpl"); // Service 实现类命名
                })
                // 使用 Velocity 模板引擎
                .templateEngine(new VelocityTemplateEngine())
                // 执行生成
                .execute();
    }
    @Test
    void contextLoads() {
    }

}
