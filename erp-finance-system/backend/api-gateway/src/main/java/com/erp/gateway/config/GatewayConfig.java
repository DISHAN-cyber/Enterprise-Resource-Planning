package com.erp.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String authorization = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authorization != null && authorization.startsWith("Bearer ")) {
                return Mono.just(authorization.substring(7));
            }

            var remoteAddress = exchange.getRequest().getRemoteAddress();
            var key = remoteAddress != null ? remoteAddress.getAddress().getHostAddress() : "anonymous";
            return Mono.just(key);
        };
    }
}
