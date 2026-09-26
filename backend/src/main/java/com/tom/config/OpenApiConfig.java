package com.tom.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3.0 / Swagger UI Configuration for Tirumala Oil Mill ERP.
 * Configures JWT Bearer token authentication in Swagger UI so developers
 * can test all secure endpoints interactively.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI tomOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Tirumala Oil Mill (TOM) ERP API")
                        .description("REST API documentation for Tirumala Oil Mill enterprise resource planning system covering Procurement, Inventory, Processing, Sales, Logistics, Finance, and Workforce modules.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("TOM Engineering Team")
                                .email("dev@tirumalaoilmill.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://tirumalaoilmill.com")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter your JWT token obtained from POST /api/auth/login")));
    }
}
