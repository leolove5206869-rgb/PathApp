# PathApp - 一人公司兴趣商业化路径规划器
**产品代号**：PathApp（路径规划器）
**灵感来源**：X帖子 https://x.com/cellinlab/status/2026575801374711842 （关雅荻媒体从业时间线 + 漏斗 + 收入结构 + 产品矩阵截图）
**目标用户**：一人公司创业者、内容创作者、AI学习者、兴趣型创作者
**核心价值**：把碎片化的兴趣、经历、尝试 → AI 全自动生成「关雅荻式」可视化商业路径报告 → 模块化编辑 → 导出分享 → 真正把生活方式变成可持续生意。

## 1. 总体角色 & 产品定位（Notion-like）
- 风格：极简、模块化、可拖拽块、像 Notion 一样一切皆页面+数据库+块
- 核心闭环：输入一段自述 → AI 一键全自动生成完整报告 → 可视化编辑 → 导出 PDF/分享链接
- 内置模板：关雅荻 1998-2026 完整案例（作为学习参考）

## 2. 业务对象 & 数据结构（严格遵守）
**核心实体**（对应 Supabase 表）：
- users (UserProfile)
- reports (AnalysisReport 主表)
- timeline_stages
- funnel_layers
- revenue_nodes （自引用树）
- product_matrix_items

**完整 JSON Schema**（复制自步骤3）：
```json
// reports 表 components 字段存储以下结构
{
  "timeline": [TimelineStage[]],
  "funnel": [FunnelLayer[]],
  "revenueTree": [RevenueNode[]],
  "productMatrix": [ProductMatrixItem[]]
}
```
（具体字段请直接参考我们之前步骤3的完整 JSON 定义，这里不再重复粘贴以节省长度，但 Cursor/Claude 必须严格按步骤3执行）

## 3. 功能列表 & 用户路径（必须严格按此优先级）
**必须做的基础齿轮（MVP 2-4周核心闭环）**：
1. 登录（Supabase Auth）
2. Dashboard：报告列表 + 一键「输入自述 → AI 生成」
3. 报告编辑器：4大模块化块（Timeline / Funnel / RevenueTree / ProductMatrix）
4. Mermaid + React Flow 渲染
5. PDF 导出 + 公开分享链接

**增强齿轮（Week 3-4）**：
- AI 实时建议优化（侧边栏）
- 模板库（内置关雅荻 + 用户可复制）
- 版本历史

**炫技齿轮（验证后再做）**：
- 社区模板分享
- 多报告对比
- 移动端原生体验

**典型用户路径**（严格按步骤4实现）：
- 路径1：新手一键生成第一份报告（15-40分钟）
- 路径2：迭代优化现有报告
- 路径3：浏览关雅荻案例并复制

## 4. 技术栈（严格遵守，一人公司最优）
- 前端：Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- 部署：Vercel（必须）
- 数据库 & Auth：Supabase (PostgreSQL + Auth + Realtime + Storage)
- AI：OpenAI GPT-4o 或 Grok API（优先实现全自动化 /api/ai/generate-report）
- 图表：Mermaid.js（时间线、漏斗） + React Flow（收入树）
- 其他：Lucide icons、pdf-lib（导出）、React DnD（拖拽块）

## 5. 数据库表结构（直接复制到 Supabase SQL Editor 执行）
```sql
-- 请完整使用步骤7中提供的全部 SQL（包含 users, reports, timeline_stages 等6张表）
-- 必须加上：generated_by_ai BOOLEAN DEFAULT FALSE
-- reports.components 使用 JSONB 存储所有组件
```

## 6. 关键 API Routes（Next.js App Router /api 目录）
- POST /api/ai/generate-report （核心！用户输入自述 → AI 多步链生成完整报告）
- GET/POST /api/reports
- GET/PUT /api/reports/[id]
- GET /api/export/[id] （PDF）
- POST /api/ai/suggest （可选增强）

**AI Prompt 要求**（generate-report 必须使用多步链）：
1. 提取用户兴趣、经历、目标
2. 参考关雅荻最佳实践，生成个性化 Timeline
3. 推导 Funnel、Revenue Tree、Product Matrix
4. 输出严格符合 JSON Schema 的结构
5. 指令：严格基于用户输入，不要随意脑补，除非用户明确允许

## 7. 任务拆解 & 迭代（严格按步骤6执行）
- 迭代0：准备环境（Vercel + Supabase）
- 迭代1：Auth + Dashboard + 基础编辑器
- 迭代2：AI 全自动化生成报告（最重要！）
- 迭代3：可视化渲染 + 导出 + 优化

## 8. 约束（AI 必须永远遵守）
- 永远先读 @PROJECT_SPEC.md
- 不要添加 SPEC 之外的功能
- 代码必须干净、可扩展、模块化
- 优先核心闭环：登录 → AI 生成 → 编辑 → 导出
- 所有页面保持 Notion 简洁风格（白色/浅灰背景、大留白、卡片式）
- 遇到不确定处，先问我，不要自行决定
- 使用最新 Next.js 16 SSR + Supabase SSR Auth Helpers

**项目启动指令**：
每次在 Cursor/Claude 中输入：
“@PROJECT_SPEC.md @.cursorrules  
现在开始按 SPEC 实现第X迭代”

这就是完整版。
