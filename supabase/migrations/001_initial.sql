-- 001 was a UUID catalogue placeholder and was never applied to a hosted database.
-- Applying it before 002 would create the same table names with UUID keys, and
-- 002's CREATE TABLE IF NOT EXISTS would then skip the text-slug schema.
-- The original SQL is kept at supabase/archive/001_uuid_placeholder_not_applied.sql.
-- This migration intentionally creates no tables.

create extension if not exists pgcrypto;
