#  ReadWrite --- Distributed Blogging Platform

## Overview

**ReadWrite** is a distributed, microservices-based blogging platform
designed to demonstrate real-world backend architecture concepts
including:

-   Service isolation
-   Polyglot persistence
-   Asynchronous communication
-   Cache-aside strategy
-   Event-driven cache invalidation
-   Stateless authentication
-   Containerized deployment

The system models distributed consistency challenges and scalable
backend design patterns.

------------------------------------------------------------------------

##  Architecture Overview
<img width="866" height="891" alt="image" src="https://github.com/user-attachments/assets/df50eb46-6423-4ee8-b987-05c564015044" />


The platform consists of **3 independently deployable microservices**:

| Service | Responsibility | Database |
|----------|---------------|-----------|
| **User Service** | Authentication & profile management | MongoDB |
| **Author Service** | Blog create / update / delete operations | PostgreSQL |
| **Blog Service** | Read-heavy endpoints, comments, saved blogs, caching | PostgreSQL + Redis |


### Supporting Infrastructure

-   **Redis** -- Caching layer (cache-aside pattern)
-   **RabbitMQ** -- Event-driven asynchronous communication
-   **Docker** -- Containerized service deployment

------------------------------------------------------------------------
##  Demo

https://drive.google.com/file/d/1Y5-3kEuhbP6BiMqtMtGrDpDQk4HkwEse/view?usp=sharing



------------------------------------------------------------------------

##  Core Architectural Concepts

### 1️ Polyglot Persistence

-   **PostgreSQL** → Relational blog data (blogs, comments, saved blogs)
-   **MongoDB** → Flexible user profiles & OAuth metadata
-   **Redis** → In-memory caching for read optimization

Each database is chosen based on data model requirements.

------------------------------------------------------------------------

### 2️⃣ Stateless Authentication

-   Google OAuth 2.0 for identity verification
-   JWT-based session management
-   Ownership-based authorization
-   Stateless token validation across services

------------------------------------------------------------------------

### 3️⃣ Redis Cache-Aside Strategy

Read-heavy endpoints (blog list & blog detail) use:

1.  Cache lookup first
2.  Fallback to PostgreSQL on miss
3.  TTL-based expiration
4.  Event-driven invalidation on updates

This reduces database load while maintaining eventual consistency.

------------------------------------------------------------------------

### 4️⃣ Asynchronous Cache Invalidation

When a blog is updated:

1.  Author Service updates PostgreSQL.
2.  Event is published to RabbitMQ.
3.  Blog Service consumes event.
4.  Redis cache is invalidated.
5.  Subsequent reads rebuild cache.

This decouples write operations from read optimization.

------------------------------------------------------------------------

### 5️⃣ Consistency Model

The system is **eventually consistent**.

-   No distributed transactions across databases.
-   Cache invalidation is asynchronous.
-   Short-lived staleness window is accepted for performance.
------------------------------------------------------------------------
### 6️⃣ AI-Powered Content Enhancement

The platform uses **Google Gemini API** to improve content quality without changing user intent.

- **AI Title Correction** → Fixes grammar of blog titles (returns only clean title)
- **AI Description Handling**
  - Generates short description (<30 words) if empty
  - Fixes grammar if provided
- **AI Blog HTML Correction**
  - Corrects grammar, spelling, punctuation
  - Preserves all HTML tags, styles, and formatting (no rewriting)

------------------------------------------------------------------------

## 🔄 System Flow

1.  User logs in via Google OAuth.
2.  User Service verifies token and issues JWT.
3.  Author creates/updates blog (PostgreSQL).
4.  Blog update emits RabbitMQ event.
5.  Blog Service invalidates Redis cache.
6.  Blog reads are served via cache-aside strategy.

------------------------------------------------------------------------

## ⚙️ Tech Stack

### Backend

-   Node.js
-   Express.js
-   REST APIs

### Frontend

-   Next.js

### Databases

-   PostgreSQL (Neon)
-   MongoDB
-   Redis

### Messaging

-   RabbitMQ (durable queues, manual acknowledgment)

### DevOps

-   Docker
-   Docker Compose

------------------------------------------------------------------------





##  What This Project Demonstrates

-   Distributed systems design
-   Event-driven architecture
-   Cache optimization strategies
-   Stateless authentication
-   Cross-database consistency handling
-   Containerized backend deployment
