-- ==========================================================
-- Tanamanku — Seed Akun Demo (Admin, Seller, Customer)
-- Import via hPanel → Databases → phpMyAdmin → tab Import
-- Database: u519141514_tanamanku1
-- Password semua akun: password
-- ==========================================================
-- Aman di-import berulang (ON DUPLICATE KEY UPDATE by email)

INSERT INTO users (name, email, phone, password, role, avatar, is_active, email_verified_at, remember_token, created_at, updated_at) VALUES
('Demo Admin',            'admin@tanamanku.id',     '08964672906', '$2y$12$zEKXKA6lC8Xa7cTjZOuLneOe5momhMGD/zB2fNrgSHEpjia5kLgca', 'admin',    NULL, 1, NOW(), NULL, NOW(), NOW()),
('Admin 2 Tanamanku',     'admin2@tanamanku.id',    '08964672907', '$2y$12$zEKXKA6lC8Xa7cTjZOuLneOe5momhMGD/zB2fNrgSHEpjia5kLgca', 'admin',    NULL, 1, NOW(), NULL, NOW(), NOW()),
('Demo Seller',           'seller@tanamanku.id',    '08964672904', '$2y$12$zEKXKA6lC8Xa7cTjZOuLneOe5momhMGD/zB2fNrgSHEpjia5kLgca', 'seller',   NULL, 1, NOW(), NULL, NOW(), NOW()),
('Demo Customer',         'customer@tanamanku.id',  '08964672905', '$2y$12$zEKXKA6lC8Xa7cTjZOuLneOe5momhMGD/zB2fNrgSHEpjia5kLgca', 'customer', NULL, 1, NOW(), NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name  = VALUES(name),
    phone = VALUES(phone),
    password = VALUES(password),
    role  = VALUES(role),
    is_active = VALUES(is_active),
    email_verified_at = NOW(),
    updated_at = NOW();