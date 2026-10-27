# 参与 SilenceUI

感谢关注 SilenceUI。核心组件和文档位于 `packages/webComponents`，环境使用 Node.js `22.17.1` 与 pnpm `8.15.9`。

## 问题反馈

通过 [Issues](https://github.com/Birdyqaq/silenceUI/issues) 提供组件名称、浏览器/框架版本、最小复现、预期行为和实际结果。请勿提交真实用户数据、令牌或敏感业务信息。

涉及不宜公开的安全问题，请先发邮件至 [wuzheng011@gmail.com](mailto:wuzheng011@gmail.com)，不要在公开 Issue 中附上可利用细节。这里不承诺固定响应时限。

## 本地开发

```bash
nvm use
corepack enable
cd packages/webComponents
pnpm install --frozen-lockfile
pnpm docs:dev
```

## 提交要求

1. 新增组件使用 `su-` 前缀，尽量保持已有 API 风格；兼容旧组件，不直接删除历史标签。
2. 复杂数据使用 property，事件明确 detail 结构；用户操作与程序赋值应有清晰区别。
3. 样式使用主题变量，覆盖明暗模式、自定义色、禁用与键盘焦点；不要引入全量图标包或不必要的大型运行时依赖。
4. 为正常交互、非法输入、动态更新和键盘行为编写回归测试；涉及异步操作时检查过期状态和卸载清理。
5. 同步根入口、按需入口、公开类型、包类型测试、README、活例和 CHANGELOG，明确尚未支持的能力。
6. 运行 `pnpm docs:inventory` 更新自动生成清单，再运行 `pnpm check` 完整验收；不要手改生成清单。

不要提交 `node_modules`、构建输出、文档缓存或临时配置文件。不要把 npm 发布、权限规则或应用路由当作组件库自动提供的业务能力。

## Pull Request

请说明变更目的、兼容性影响、验证命令与结果；视觉变化可附明暗主题截图。保持改动聚焦，不混入无关重构。尚未完成的能力请在说明中注明。

维护者：[Birdyqaq](https://github.com/Birdyqaq) · 邮箱：[wuzheng011@gmail.com](mailto:wuzheng011@gmail.com)
