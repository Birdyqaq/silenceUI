# 从本地发布包接入

在 Web Components 包目录使用 Node 22.17.1 和 pnpm 8.15.9。验证脚本调用 `pnpm pack`，将同一 tarball 分别复制进两个临时项目，各自安装依赖并构建。传入 `--browser` 可用 Chromium 操作两个消费者。React 在开发服务器中运行，以覆盖 StrictMode 的 effect 清理与再次挂载。

```sh
bash scripts/verify-consumers.sh
bash scripts/verify-consumers.sh --browser
```

要单独启动某个项目，将 `examples/vue` 或 `examples/react` 复制到工作区外的独立目录，再把 `pnpm pack` 生成的归档放进去并命名为 `silenceui.tgz`。在该目录执行 `npm install`、`npm run dev`。使用 `npm run build` 构建生产产物，React 同时检查已安装包的公开声明。

- Vue 示例以 property 传数组和布尔值，处理 `change` 自定义事件、原生 FormData 提交和主题切换。
- React 示例以 ref 等待异步注册，设置 property，用 AbortController 解绑事件，并可手动卸载及重挂载控件。
