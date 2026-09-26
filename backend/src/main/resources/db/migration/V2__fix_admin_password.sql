-- V2: Fix Admin user password hash
-- BCrypt hash of "Admin@123" (generated with strength 12)
UPDATE users
SET password_hash = '$2a$12$NM6TXhxweFi9Y7NxiBpuVOIovSkF8faylv1iFKZESUhnRyc8FIyCO'
WHERE username = 'admin';
