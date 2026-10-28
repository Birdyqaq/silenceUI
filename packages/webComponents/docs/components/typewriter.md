# Typewriter 打字机

`su-typewriter` 用于首页标题、引导文案和多条标语轮播，支持中文、组合字符和 emoji。提供经典逐字、淡入、上滑、模糊显现、主题彩色五种效果，以及竖线、方块、下划线、隐藏四种光标。

## 在线体验

<ClientOnly><TypewriterDemo /></ClientOnly>

## 按需引入

```ts
import 'silenceui/style.css';
import 'silenceui/components/data/typewriter';
```

全量 `import 'silenceui'` 已包含注册。仅使用按需入口且需要恢复持久化主题时，请调用 `silenceui/theme` 的 `initTheme()`。

## 单条文本和效果

```html
<su-typewriter text="你好，世界 👋" effect="fade" speed="100"></su-typewriter>
<su-typewriter text="从模糊到清晰" effect="blur" cursor="block"></su-typewriter>
<su-typewriter text="文字向上浮现" effect="slide" cursor="underscore"></su-typewriter>
<su-typewriter text="跟随品牌色变化" effect="rainbow" cursor="none"></su-typewriter>
```

所有效果均按字符输入。`fade`、`slide`、`blur` 对新字符添加入场动画；`rainbow` 交替使用主题的主色、成功色、警告色。默认只播放一次，并保留最终文字。

## 多条轮播与控制

```html
<su-typewriter id="headline" loop hold-delay="1800" delete-speed="35"></su-typewriter>
<button id="pause" type="button">暂停</button>
<button id="resume" type="button">继续</button>
<button id="restart" type="button">重播</button>

<script type="module">
  import 'silenceui/style.css';
  import 'silenceui/components/data/typewriter';

  const writer = document.querySelector('#headline');
  writer.texts = ['一次编写', '跨框架使用', '支持主题切换 ✨'];
  document.querySelector('#pause').onclick = () => writer.pause();
  document.querySelector('#resume').onclick = () => writer.resume();
  document.querySelector('#restart').onclick = () => writer.restart();
  writer.addEventListener('text-complete', (event) => {
    console.log('本条输入完成', event.detail.text, event.detail.index);
  });
</script>
```

示例中的包名 import 需要 Vite 等打包工具处理。`texts` 通过 JS property 传递，不要写成 HTML 字符串属性。有效的非空 `texts` 优先于 `text`；空条目会被忽略。未设置 `loop` 时依次播放所有条目，在最后一条停止；设置后持续输入、停留、删除、轮播。

## Vue 接入

在 Vite 的 Vue 编译配置中将 `su-` 前缀标记为自定义元素，详见[快速开始](/guide/getting-started)。组件注册必须先于 Vue 挂载：

```vue
<script setup>
import { ref } from 'vue';
import 'silenceui/style.css';
import 'silenceui/components/data/typewriter';

const phrases = ref(['欢迎回来', '今天也有新的进展']);
const paused = ref(false);
</script>

<template>
  <su-typewriter :texts.prop="phrases" :paused.prop="paused" effect="slide" loop />
  <button @click="paused = !paused">{{ paused ? '继续' : '暂停' }}</button>
</template>
```

更新数组时赋予新数组，例如 `phrases.value = ['新的内容']`，不要仅原地修改。SSR 项目在客户端注册组件，避免在服务器执行浏览器 API。

## API

| Property      | HTML attribute | 说明                                   | 默认值  |
| ------------- | -------------- | -------------------------------------- | ------- |
| `text`        | `text`         | 单条纯文本                             | `''`    |
| `texts`       | 不支持         | `string[]`，多条文本，优先于 text      | `[]`    |
| `effect`      | `effect`       | `type / fade / slide / blur / rainbow` | `type`  |
| `cursor`      | `cursor`       | `line / block / underscore / none`     | `line`  |
| `speed`       | `speed`        | 每字符输入间隔，毫秒                   | `80`    |
| `deleteSpeed` | `delete-speed` | 每字符删除间隔，毫秒                   | `40`    |
| `holdDelay`   | `hold-delay`   | 完整显示后的停留时间，毫秒             | `1500`  |
| `startDelay`  | `start-delay`  | 开始/重播前额外等待时间，毫秒          | `0`     |
| `loop`        | `loop`         | 是否循环播放                           | `false` |
| `paused`      | `paused`       | 是否暂停，保留当前字符位置             | `false` |

时间参数为非负有限数字，非法值回退默认值；零间隔以最小 1 ms 调度。第一字符在 `startDelay + speed` 后出现。文本变化或 `restart()` 从第一条重播；调整速度保留当前位置。`startDelay` 的运行中修改在下次重播生效。已完成后开启 `loop` 需要调用 `restart()`。

| 方法        | 说明                               |
| ----------- | ---------------------------------- |
| `pause()`   | 立即暂停并清理下一步计时器         |
| `resume()`  | 从当前进度继续，下一步使用完整间隔 |
| `restart()` | 从第一条重新开始，保留 paused 状态 |

| 事件            | detail                            | 时机                                 |
| --------------- | --------------------------------- | ------------------------------------ |
| `text-complete` | `{ text: string, index: number }` | 每条文本输入完毕，index 从 0 开始    |
| `complete`      | `{ text: string, index: number }` | 非循环播放的最后一条输入完毕，仅一次 |

事件均冒泡且穿透 Shadow DOM。`text-complete` 先于 `complete`。空内容和减少动态效果的静态展示不触发播放事件。

## 主题与样式

继承外部字体、字号和行高，默认颜色来自主题；使用 CSS 变量或 Parts 自定义：

```css
su-typewriter {
  font-size: 28px;
  --su-typewriter-color: var(--su-text-1);
  --su-typewriter-cursor-color: var(--su-color-primary);
}
su-typewriter::part(text) {
  font-weight: 600;
}
su-typewriter::part(cursor) {
  margin-inline-start: 2px;
}
```

## 可访问性与生命周期

- 屏幕阅读器读取完整文本；视觉动画不逐字播报，不会持续打断用户。
- 系统设置 `prefers-reduced-motion: reduce` 时直接展示所有条目、隐藏光标并停止计时器；设置变化实时生效。
- 卸载时清理计时器和监听，重新插入后从第一条开始。
- 通过 `Intl.Segmenter` 按字素输入，避免拆开家庭 emoji、组合音标；缺少该 API 的旧浏览器退回 Unicode 码点，此时复杂组合字符可能分步出现。
- 文本按普通字符串渲染，不解析 HTML；长期循环建议同时提供暂停按钮。
