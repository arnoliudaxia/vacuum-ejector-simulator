# 真空发生器原理实验室（Vacuum Ejector Simulator）

一个展示**真空发生器（真空引射器）工作原理**的交互式网页动画。

在线演示：https://arnoliudaxia.github.io/vacuum-ejector-simulator/

## 功能亮点

- 🎬 **交互式剖面动画**：Canvas 实时渲染压缩空气射流（红色粒子）与卷吸气流（蓝色粒子）
- 🔍 **四个观察区域**：喷嘴加速 → 射流卷吸 → 混合排出 → 真空吸持
- 🎛️ **可调节供气压力**（0.20–0.70 MPa），真空表与粒子速度实时响应
- ⏯️ **暂停 / 重置控制**，附带真空口压力表与图例
- 📐 **原理讲解**：结构解析与伯努利方程说明

## 技术栈

- React 19 + TypeScript + Vite 7
- Tailwind CSS + shadcn/ui 组件
- 动画基于原生 Canvas（requestAnimationFrame）

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器（默认 http://localhost:3000）
npm run build:pages  # 构建纯静态站点，输出到 dist/public
```

## 部署

仓库配置了 GitHub Actions 工作流（`.github/workflows/deploy-pages.yml`），推送到 `main` 分支后自动构建并部署到 GitHub Pages。

> 注：原项目还包含一套 Hono + tRPC + MySQL 后端（`api/`、`db/` 目录），
> GitHub Pages 仅托管静态内容，因此线上演示使用内置的演示数据（`src/pages/Home.tsx` 中的 `fallbackFocuses`）。
