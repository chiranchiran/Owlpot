package com.owlpot.interceptor;

import com.owlpot.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import static com.owlpot.constant.JwtConstant.JWT_KEY;

/**
 * jwt令牌校验的拦截器
 */
@Component
@Slf4j
public class CheckJwtInterceptor implements HandlerInterceptor {
    /**
     * 校验jwt
     */
    @Autowired
    private JwtUtil jwtUtil;
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            //当前拦截到的不是动态方法，直接放行
            log.info("当前拦截到的不是动态方法，直接放行");
            return true;
        }
        //1、从请求头中获取令牌
        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith(JWT_KEY+" ")) {
            // 提取 Bearer 后面的 token 值
            token = authHeader.substring(JWT_KEY.length()+1); // 7 是 "Bearer ".length()
        }
        log.info("令牌为：{}", token);
        //2、校验令牌
        boolean flag = jwtUtil.checkToken(token);
        if (flag) {
            log.info("jwt校验通过");
            return true;
        }else{
            log.info("jwt校验失败");
            response.setStatus(401);
            return false;
        }
    }
}
