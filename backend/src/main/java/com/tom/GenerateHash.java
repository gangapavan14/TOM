package com.tom;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * One-off utility to generate the Admin seed password hash.
 * Run: mvn exec:java -Dexec.mainClass=com.tom.GenerateHash
 */
public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        System.out.println(encoder.encode("Admin@123"));
    }
}
