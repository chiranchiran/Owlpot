package com.owlpot.controller.nofity;

import com.owlpot.result.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class common {
    /**
     * 退出登录
     *
     * @return
     */
    @PostMapping("/api/logout")
    public Result logout() {
        return Result.success();
    }
}
