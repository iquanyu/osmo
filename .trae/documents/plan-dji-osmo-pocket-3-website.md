# DJI Osmo Pocket 3 视频拍摄大师实操网 - 开发计划

## 一、项目概述

将模板项目 `/Users/cola/Downloads/dji-osmo-pocket-3-视频拍摄大师实操网`（React 19 + Vite + Express + 内存存储）迁移到目标项目 `/Users/cola/Herd/osmo`（Laravel 13 + Inertia.js 3 + React 19 + Tailwind CSS v4 + MySQL），实现完整的网站开发。

### 核心技术栈对照

| 维度 | 模板项目 | 目标项目 |
|------|----------|----------|
| 后端框架 | Express 4 (单文件 server.ts) | Laravel 13.7 |
| 前端框架 | React 19 + Vite 6 (SPA) | React 19 + Inertia.js 3 (SSR) |
| 数据存储 | 纯内存（重启即失） | MySQL (持久化) |
| 认证 | 前端硬编码密码 dji2026 | Laravel Fortify + is_admin 角色 |
| AI 助手 | Gemini API + 本地预设 | 仅本地启发式预设 |
| UI 库 | shadcn/ui (base-nova) | shadcn/ui (new-york) |
| 样式 | Tailwind CSS v4 | Tailwind CSS v4 |
| 图表 | recharts | recharts ^3.8.1 |
| 路由 | Tab state 切换 | Inertia 路由导航 |

## 二、现状分析（已完成的工作）

经过对 `/Users/cola/Herd/osmo` 的探索，**以下模块已实现**：

### 2.1 数据库层（已完成）
- 迁移文件 `database/migrations/`：
  - `2026_06_22_000001_add_is_admin_to_users_table.php` — 用户表新增 is_admin
  - `2026_06_22_000002_create_tutorials_table.php` — 教程表（含 json 字段 steps/tips/settings）
  - `2026_06_22_000003_create_community_posts_table.php` — 社区帖子表
  - `2026_06_22_000004_create_answers_table.php` — 回答表（外键 community_post_id）
- 模型 `app/Models/`：User（含 isAdmin()）、Tutorial、CommunityPost（hasMany Answer）、Answer（belongsTo CommunityPost）
- Seeders：TutorialSeeder（5 篇教程）、CommunityPostSeeder（3 篇帖子）、DatabaseSeeder（创建 admin 用户）

### 2.2 后端层（已完成）
- 中间件：`IsAdmin.php`（检查 auth()->user()?->isAdmin()），已在 `bootstrap/app.php` 注册别名 `is_admin`
- 服务：`AssistantService.php`（5 个本地预设场景）、`SpecsService.php`（4 个创作者预设 + 5 项硬件规格）
- 控制器：HomeController、TutorialController、SimulatorController、AssistantController、CommunityController、Admin/AdminController
- 路由 `routes/web.php`：公开路由 + 管理员路由（middleware: auth, is_admin）+ 认证路由
- Inertia 共享 props：`auth.user`、`auth.isAdmin`、`name`、`sidebarOpen`

### 2.3 前端层（已完成）
- 类型定义 `resources/js/types/`：tutorial.ts、community.ts、assistant.ts、index.ts
- 布局 `resources/js/layouts/main-layout.tsx`：DJI 红色品牌条 + 顶部导航 + 主题切换 + 管理员入口 + 用户菜单 + 页脚
- 页面 `resources/js/pages/`：
  - `tutorials/index.tsx` — 教程库（Hero、分类筛选、教程网格、详情 Modal、硬件规格、平台预设）
  - `simulator/index.tsx` — 参数模拟器（ISO 噪点、动态模糊、ND 镜、云台控制、HUD 叠加）
  - `assistant/index.tsx` — AI 助手（场景输入、预设按钮、fetch POST /assistant/suggest）
  - `community/index.tsx` — 玩家社区（帖子列表、置顶排序、点赞、回复、发帖表单）
  - `admin/index.tsx` — 管理后台（4 个工作区：概览/审核/分析/配置，recharts 图表，CRUD）
- app.tsx 布局映射：tutorials/simulator/assistant/community/admin → MainLayout

### 2.4 样式层（已完成）
- `resources/css/app.css`：Tailwind v4 + shadcn 主题变量 + 自定义动画（noise、fadeIn、slideUp）

### 2.5 认证系统（已完成）
- Laravel Fortify 完整配置：注册、登录、密码重置、邮箱验证、2FA、Passkey
- FortifyServiceProvider 注册所有 Inertia 视图
- auth/* 页面齐全（login、register、forgot-password、reset-password、verify-email、two-factor-challenge、confirm-password）

## 三、剩余工作与改进点

基于探索发现的差距，以下是待完成的工作：

### 3.1 CSRF Token 修复（高优先级）

**问题**：`resources/views/app.blade.php` 缺少 CSRF token meta 标签，导致 `resources/js/pages/assistant/index.tsx` 中的 fetch POST 请求 `/assistant/suggest` 会因 419 CSRF 验证失败。

**文件**：`/Users/cola/Herd/osmo/resources/views/app.blade.php`

**改动**：在 `<head>` 中 `@viteReactRefresh` 之前添加：
```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

**原因**：assistant 页面使用原生 fetch（非 Inertia router）调用 POST 端点，需要手动从 meta 标签读取 token 并附加到 `X-CSRF-TOKEN` 请求头。

### 3.2 功能验证（高优先级）

对已实现的 5 个核心模块进行端到端验证：

1. **教程库** (`/tutorials`)
   - 验证：页面渲染、分类筛选、教程详情 Modal 展开、数据来自 MySQL
   - 命令：`php artisan route:list --name=tutorials`

2. **参数模拟器** (`/simulator`)
   - 验证：参数调节、屏幕可视化、专家审核提示、创作者预设导入

3. **AI 助手** (`/assistant`)
   - 验证：场景输入、预设按钮、POST /assistant/suggest 返回 JSON、5 个本地预设场景
   - 依赖：3.1 的 CSRF 修复

4. **玩家社区** (`/community`)
   - 验证：帖子列表、发帖、点赞、回复、置顶排序
   - 注意：CommunityController 的 store/like/answer 使用 Inertia router，CSRF 由 Inertia 自动处理

5. **管理后台** (`/admin`)
   - 验证：未登录重定向到 /login、admin 用户可访问、4 个工作区、CRUD 操作、官方回复、一键重置

### 3.3 数据库与种子验证（中优先级）

1. 确认 MySQL `osmo` 数据库已创建
2. 执行迁移：`php artisan migrate`
3. 执行种子：`php artisan db:seed`
4. 验证 admin 用户：`admin@osmo.local` / `dji2026`
5. 验证数据：5 篇教程、3 篇社区帖子

### 3.4 构建与运行验证（中优先级）

1. 安装依赖：`composer install`、`npm install`
2. 构建：`npm run build`
3. 启动：`php artisan serve` 或通过 Herd 访问
4. 访问各页面确认无 500 错误

### 3.5 可选增强（低优先级，本次不做）

以下为未来可考虑的增强项，**本次开发计划不包含**：
- API 路由开发（routes/api.php）供未来 App 使用
- Gemini API 集成（当前仅本地预设）
- 教程图片上传功能
- 社区帖子分页
- 管理后台导出报表
- 邮件通知（新回复通知）

## 四、实施步骤

### 步骤 1：修复 CSRF Token
- 文件：`/Users/cola/Herd/osmo/resources/views/app.blade.php`
- 操作：在 `<head>` 中添加 `<meta name="csrf-token" content="{{ csrf_token() }}">`
- 位置：`<meta name="viewport">` 之后、`@fonts` 之前

### 步骤 2：数据库初始化
- 命令：`php artisan migrate:fresh --seed`
- 验证：检查 tutorials（5 条）、community_posts（3 条）、users（admin + 普通）

### 步骤 3：构建前端
- 命令：`npm run build`
- 验证：构建成功无错误

### 步骤 4：功能验证
- 启动服务：`php artisan serve`
- 访问以下页面并验证：
  - `http://localhost:8000/` → 重定向到 /tutorials
  - `http://localhost:8000/tutorials` → 教程列表
  - `http://localhost:8000/simulator` → 模拟器
  - `http://localhost:8000/assistant` → AI 助手（测试 POST 请求）
  - `http://localhost:8000/community` → 社区
  - `http://localhost:8000/admin` → 未登录重定向到 /login
  - 登录 admin@osmo.local / dji2026 后访问 /admin

### 步骤 5：最终检查
- 检查 `php artisan route:list` 所有路由正确注册
- 检查暗黑/浅色主题切换
- 检查移动端响应式布局

## 五、假设与决策

1. **数据库**：使用 MySQL（已在 .env 配置 DB_DATABASE=osmo）
2. **AI 助手**：仅本地启发式预设（5 个场景：海边、落日、夜景、室内、默认），不集成 Gemini API
3. **认证**：使用 Laravel Fortify + is_admin 字段 + IsAdmin 中间件，管理员账号 admin@osmo.local / dji2026
4. **前端集成**：使用 Inertia.js（SSR），不开发独立 API；未来如需 App 端可新增 routes/api.php
5. **UI 风格**：保留模板的 DJI 红色品牌色（red-600）+ zinc 暗色系，使用 shadcn/ui new-york 风格
6. **数据迁移**：教程和社区种子数据从模板的 TypeScript 文件迁移到 Laravel Seeders
7. **本次范围**：仅修复 CSRF + 验证现有实现，不新增功能

## 六、验证清单

- [ ] app.blade.php 包含 csrf-token meta 标签
- [ ] `php artisan migrate:fresh --seed` 成功执行
- [ ] `npm run build` 成功构建
- [ ] /tutorials 页面渲染 5 篇教程
- [ ] /simulator 页面参数调节正常
- [ ] /assistant 页面 POST /assistant/suggest 返回 JSON（无 419 错误）
- [ ] /community 页面发帖、点赞、回复功能正常
- [ ] /admin 未登录时重定向到 /login
- [ ] admin@osmo.local 登录后可访问 /admin
- [ ] 管理后台 CRUD、官方回复、一键重置功能正常
- [ ] 主题切换（亮/暗）正常
- [ ] `php artisan route:list` 显示所有路由
