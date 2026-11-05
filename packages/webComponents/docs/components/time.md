# 时间选择与排班

<ClientOnly><TimeDemo /></ClientOnly>

## 时间协议（第 6 天冻结）

`su-time-picker` 与 `su-time-range` 使用本地墙上时间 `HH:mm`：00:00—23:59，必须两位小时/分钟。没有日期、秒、时区、UTC 转换或跨日支持。等长起止时间合法；23:00—01:00 不合法。格式错误保留原 property 并报告校验错误，不静默截断、纠正或调整业务值。

| 属性/property       | 默认              | 说明                                                                        |
| ------------------- | ----------------- | --------------------------------------------------------------------------- |
| value               | `''` / `['', '']` | 单选为字符串；范围为 `[string, string]`，仅 property，不能用 JSON attribute |
| name                | `''`              | 原生提交字段名；范围按 start/end 顺序重复提交两次，包括空字符串             |
| label               | 时间 / 时间范围   | 可见标签及可访问名称                                                        |
| min / max           | `''`              | 空表示无边界；否则严格 HH:mm，min > max 报配置错误，不解释为跨午夜          |
| step                | `60`              | 秒，必须为 60 的正整数倍；基准为 min 或 00:00，不以当前 value 为基准        |
| required            | `false`           | 单值必填；范围两端都必填。可选范围允许全空，但半空无效                      |
| disabled / readonly | `false`           | 禁用不提交；只读仍提交，原生 readonly 不参与约束校验                        |

用户提交输入更改派发冒泡、composed 的 `change.detail.value`（单值字符串/范围独立数组副本）；同值、程序赋值、reset、状态恢复不派发业务 change。范围不修改调用方数组。表单关联、fieldset 继承禁用、初始值 reset、状态恢复及 FormItem 错误关联复用共享控制器。改属性后等待 `updateComplete` 再读取 FormData/校验。

无效值仍可能存在于 `new FormData(form)` 中：FormData 本身不执行约束校验，提交前必须原生 checkValidity/reportValidity 或使用 su-form；后端也必须验证。原生 `input[type=time]` 面板、分段键盘与地区显示取决于浏览器，不保证一致的自定义弹层。浏览器未提供原生表单关联时，宿主自行收集 property。

## 按需接入

```ts
import 'silenceui/components/form/time-picker';
import 'silenceui/components/form/time-range';
import 'silenceui/style.css';
const range = document.querySelector('su-time-range');
if (range) range.value = ['09:00', '18:00'];
```

单值恢复接收字符串；范围恢复接收同名双值 FormData。初始值在首次渲染完成时记录，后续程序赋值不重写 reset 基线。没有远程请求、保存排班或时区换算职责。

## 日期时间范围与跨日排班

<ClientOnly>
  <su-date-time-range label="夜班" :value.prop="['2026-11-04T23:00', '2026-11-05T07:00']"></su-date-time-range>
</ClientOnly>

`su-date-time-range` 的 `value: DateTimeRangeValue` 是两个本地日期时间字符串组成的数组，格式为 `YYYY-MM-DDTHH:mm`。年份支持 0001—9999，分钟精度。起止日期可跨日、跨月和跨年，结束时间应大于或等于开始时间。此值表示业务所在地的日历时间，应用负责确定时区及夏令时歧义后再转换为服务端需要的值。

`min` 和 `max` 使用同一格式，均为包含边界。`required` 要求填写两端，可选范围允许两端都空，半空范围会报错。非法日期、格式、范围顺序或边界均会使表单无效，原始 property 保留供宿主纠正。

`label` 命名范围和起止输入框。设置 `name` 后，FormData 按开始、结束顺序提交两个同名字段。支持 `disabled`、原生 fieldset 继承禁用、`readonly`、表单 reset 和 FormData 状态恢复。用户修改派发 `change.detail.value` 的数组副本，程序化更新和 reset 静默执行。

按需入口为 `silenceui/components/form/date-time-range`，根入口也导出 `SuDateTimeRange` 和 `DateTimeRangeValue`。可通过 `start-control`、`end-control` Parts 定制原生输入框。面板外观与键盘分段方式由浏览器提供。
