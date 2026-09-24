CREATE DATABASE visvasahome_auth;
CREATE DATABASE visvasahome_user;
CREATE DATABASE visvasahome_provider;
CREATE DATABASE visvasahome_catalog;
CREATE DATABASE visvasahome_booking;
CREATE DATABASE visvasahome_payment;
CREATE DATABASE visvasahome_rating;
CREATE DATABASE visvasahome_outbox;
CREATE DATABASE visvasahome_chat;

\c visvasahome_user
CREATE EXTENSION IF NOT EXISTS postgis;

\c visvasahome_provider
CREATE EXTENSION IF NOT EXISTS postgis;

