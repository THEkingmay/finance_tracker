-- 🔹 ลบตารางและ type เดิมก่อน
drop table if exists transaction cascade;
drop table if exists users cascade;
drop type if exists transaction_type;

-- 🔹 เปิด extension สำหรับ gen_random_uuid
create extension if not exists "pgcrypto";

-- 🔹 สร้างตาราง users
create table users (
    uid uuid primary key default gen_random_uuid(),
    email varchar(255) not null unique,
    hashpassword text not null,
    created_at timestamp with time zone default now()
    -- updated_at timestamp with time zone default now()
);

-- 🔹 สร้าง enum สำหรับ transaction type
create type transaction_type as enum ('income', 'expense');

-- 🔹 สร้างตาราง transaction
create table transaction (
    id uuid primary key default gen_random_uuid(),
    uid uuid references users(uid) on delete cascade,
    amount numeric(12,2) not null,
    type transaction_type not null,
    category varchar(100),
    description text,
    created_at timestamp with time zone default now()
    -- updated_at timestamp with time zone default now()
);
