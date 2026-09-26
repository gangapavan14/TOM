package com.tom.common.exception;

/**
 * Business domain exception for TOM.
 * Throw this when a business rule is violated.
 * It will be caught by the global exception handler and returned as a 400 Bad Request.
 */
public class TomException extends RuntimeException {
    public TomException(String message) {
        super(message);
    }

    public TomException(String message, Throwable cause) {
        super(message, cause);
    }
}
