# Smart Farm AI Screen Web

面向“智能农业屏幕端”的前端项目，基于 Vite + React + TypeScript，使用 Ant Design 与 Ant Design X 构建交互式页面，包含 AI 识别、AI 助手、联动应用等功能页面。

## 目录结构与文件说明

```
.
├─ public/
│  ├─ assets/
│  │  ├─ fonts/                       # 字体资源
│  │  │  └─ Alimama_ShuHeiTi_Bold.ttf  # 标题字体
│  │  └─ imgs/                        # 图片与图标资源
│  │     ├─ bg.png                    # 背景
│  │     ├─ cardbg.png                # 卡片背景
│  │     ├─ foundation.svg            # 装饰图标
│  │     ├─ header.png                # 头部装饰
│  │     ├─ logo.png                  # Logo
│  │     ├─ navi_*.png                # 首页导航图
│  │     ├─ prefix.svg                # 文本前缀图标
│  │     ├─ title.svg                 # 标题图标
│  │     └─ icons/                    # 传感器/AI 图标
│  ├─ favicon.ico                     # 站点图标
│  └─ vite.svg                        # Vite 默认图标
├─ src/
│  ├─ api/
│  │  ├─ analysis.api.ts              # AI 识别相关接口
│  │  ├─ assistant.api.ts             # AI 助手/传感器/报告/语音接口
│  │  └─ linked-app.ts                # 联动应用接口
│  ├─ app/
│  │  ├─ index.tsx                    # App 外壳（主题/布局/路由容器）
│  │  └─ style.module.css             # App 外壳样式
│  ├─ components/
│  │  ├─ BackBtn/                     # 返回按钮
│  │  ├─ CurrTime/                    # 顶部当前时间
│  │  ├─ Loader/                      # 统一加载组件
│  │  └─ TransparentCard/             # 半透明卡片封装
│  ├─ constant/
│  │  ├─ host.ts                      # 接口 Host 与路径常量
│  │  ├─ mutations.ts                 # React Query mutation keys
│  │  └─ queries.ts                   # React Query query keys
│  ├─ pages/
│  │  ├─ Analysis/                    # AI 识别页
│  │  ├─ Assistant/                   # AI 助手页（聊天/报告/传感器）
│  │  │  ├─ components/
│  │  │  │  ├─ Chat/                  # 聊天与语音交互
│  │  │  │  ├─ Report/                # 报告历史与详情
│  │  │  │  └─ Sensors/               # 传感器数据卡片
│  │  │  └─ genItem.tsx               # 生成聊天气泡数据
│  │  ├─ Home/                        # 首页导航
│  │  ├─ LinkedApp/                   # 联动应用列表与表单
│  │  │  └─ components/LinkedAppForm/ # 联动应用配置表单
│  │  └─ NotFound/                    # 404 页面
│  ├─ router/
│  │  └─ index.tsx                    # 路由定义
│  ├─ types/
│  │  ├─ analysis.type.ts             # AI 识别数据类型
│  │  ├─ assistant.type.ts            # 助手/传感器/报告类型
│  │  ├─ linked-app.type.ts           # 联动应用类型
│  │  └─ setting.type.ts              # 设备与系统设置类型
│  ├─ utils/
│  │  └─ fetchData.ts                 # 统一请求封装
│  ├─ index.css                       # 全局样式与字体
│  └─ index.tsx                       # React 入口
├─ index.html                          # Vite 入口 HTML
├─ package.json                        # 依赖与脚本
├─ package-lock.json                   # 依赖锁定
├─ tsconfig.json                       # TS 基础配置
├─ tsconfig.app.json                   # 应用端 TS 配置
├─ tsconfig.node.json                  # Node 端 TS 配置
├─ vite.config.ts                      # Vite 配置与路径别名
├─ eslint.config.js                    # ESLint 配置
├─ .prettierrc                         # Prettier 配置
└─ .gitignore                          # Git 忽略
```

## 核心功能概览

- **首页导航**：进入 AI 识别、AI 助手、联动应用
- **AI 识别**：显示算法信息、识别图片、结果分布与历史记录
- **AI 助手**：聊天对话、TTS 播放、语音识别、提示词、报告生成
- **联动应用**：场景联动配置（触发条件 + 执行动作）与管理

## 安装与启动

环境要求：Node.js 18+（建议）  

1. 安装依赖

```bash
npm install
```

2. 启动开发服务

```bash
npm run dev
```

3. 构建生产包

```bash
npm run build
```

4. 本地预览

```bash
npm run preview
```

## 路由说明

- `/` 首页
- `/analysis` AI 识别
- `/assistant` AI 助手
- `/assistant/report` 报告页面
- `/linkedApp` 联动应用
- `*` 404

## 备注

- 接口地址与路径在 `src/constant/host.ts` 配置，不同环境下对应不同 Host 与前缀。
- 项目使用 React Query 管理接口数据缓存与请求状态。
