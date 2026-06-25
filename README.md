# Osmo 创作平台

一个基于 Laravel 13 + Inertia.js v3 + React 19 的 Pocket 3 创作内容平台，包含：

- 前台教程浏览
- 社区互动
- 工具箱与查阅工具
- AI 助手建议页
- 玩家投稿后台
- 运营管理后台

项目当前重点已经从“静态演示”进入“可持续迭代的后台化业务应用”阶段。

## 快速入口

- 文档导航：[docs/文档导航.md](docs/文档导航.md)
- 开发规范：[docs/项目规范与复用指南.md](docs/项目规范与复用指南.md)
- 主执行清单：[docs/后台前台执行计划.md](docs/后台前台执行计划.md)
- 优化任务地图：[docs/项目优化总览.md](docs/项目优化总览.md)

## 1. 项目目标

这个项目围绕 Pocket 3 创作者场景，提供一条完整内容链路：

1. 前台展示教程与社区内容
2. 玩家登录后进入投稿后台，创建草稿并提交审核
3. 运营在后台审核投稿、管理教程与社区
4. 通过审核的投稿进入正式教程库

## 2. 技术栈

### 后端

- PHP 8.4（项目约束）
- Laravel 13
- Laravel Fortify
- Laravel Wayfinder
- PHPUnit 12
- Larastan
- Laravel Pint

### 前端

- Inertia.js v3
- React 19
- TypeScript
- Tailwind CSS v4
- Vite
- Sonner
- Lucide React

## 3. 当前核心能力

### 前台

- 教程浏览与详情
- 社区浏览与详情
- 工具箱、ND 计算器、规格页、配件页
- AI 助手页、模拟器页

### 玩家后台

- 投稿工作台 `/contribute`
- 草稿创建、编辑、删除
- 提交审核与驳回后重投
- 查看审核状态与结果

### 管理后台

- 总览、教程管理、社区管理、投稿审核

## 4. 快速启动

### 基础要求

- PHP 8.4+
- Composer
- Node.js 20+
- npm
- SQLite（默认）或你自己的 MySQL/PostgreSQL 配置

### 一步初始化

```bash
composer setup
```

### 手动初始化

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
npm install
```

### 启动开发环境

```bash
composer run dev
```

如果前端改动没有生效，通常需要运行：

- `npm run dev`
- `npm run build`

## 5. 默认环境

`.env.example` 默认使用：

- `DB_CONNECTION=sqlite`
- `SESSION_DRIVER=database`
- `QUEUE_CONNECTION=database`
- `CACHE_STORE=database`

因此第一次运行时要先完成迁移。

## 6. 常用命令

### 后端

```bash
php artisan migrate
php artisan db:seed
php artisan route:list
php artisan test
```

### 前端

```bash
npm run dev
npm run build
npm run lint
npm run lint:check
npm run format
npm run format:check
npm run types:check
```

### 质量检查

```bash
vendor/bin/pint --dirty --format agent
php artisan test
phpstan analyse
```

## 7. Seed 与演示数据

项目带有一套演示数据逻辑，便于本地体验后台功能。

相关 Seeder 位于：

- `database/seeders/TutorialSeeder.php`
- `database/seeders/CommunityPostSeeder.php`
- `database/seeders/SubmissionSeeder.php`
- `database/seeders/DatabaseSeeder.php`

本地环境下管理后台支持演示数据重置能力。

## 8. 开发约定

### 后端

- 优先使用 Form Request 做校验
- 权限优先落到 Policy / Middleware
- 业务流转优先放在 Service
- 状态型字段优先使用 enum / 统一映射

### 前端

- 保持 dashboard 侧边栏风格一致
- 复用组件优先于复制页面逻辑
- 后台请求优先走统一 action hook
- 避免页面内散落硬编码状态映射
- 详细页面层级与按钮层级以 `docs/页面级UI规范.md` 为准
- 详细后台动作口径以 `docs/后台动作与审计规范.md` 为准

### 代码质量

- 改动 PHP 后先跑 Pint
- 至少运行与你修改相关的最小测试集
- TypeScript 改动后跑类型检查

## 9. 文档导航

如果你是第一次进入这个仓库，建议按这个顺序阅读：

1. `README.md`
2. [docs/文档导航.md](docs/文档导航.md)
3. [docs/使用说明.md](docs/使用说明.md)
4. [docs/项目规范与复用指南.md](docs/项目规范与复用指南.md)
5. [docs/页面级UI规范.md](docs/页面级UI规范.md)
6. [docs/文档分工表.md](docs/文档分工表.md)

当前各文档职责如下：

| 文档 | 作用 |
|---|---|
| `README.md` | 仓库总入口 |
| `docs/文档导航.md` | 文档索引 |
| `docs/使用说明.md` | 完整使用说明 |
| `docs/文档分工表.md` | 文档职责边界 |
| `docs/项目规范与复用指南.md` | 开发规范 |
| `docs/页面级UI规范.md` | 页面级 UI 规范 |
| `docs/后台动作与审计规范.md` | 后台动作规范 |
| `docs/后台前台执行计划.md` | 主执行清单 |
| `docs/最终上线验收清单.md` | 上线验收 |
| `docs/环境变量说明.md` | 环境变量说明 |
| `docs/部署说明.md` | 部署与上线说明 |

如果你是新接手的同学，建议再按下面顺序进入代码：

1. `routes/web.php`
2. `app/Models/User.php`
3. `app/Enums/SubmissionStatus.php`
4. `app/Services/SubmissionService.php`
5. `resources/js/pages/contribute/index.tsx`
6. `resources/js/pages/admin/submissions.tsx`
7. `tests/Feature/*Submission*`

## 14. License

项目当前继承 Laravel Starter Kit 结构，仓库内未单独声明业务 License 时，请按团队内部使用规范处理。
