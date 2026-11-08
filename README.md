# 小米闹钟 · ESP32-C3 在线烧录

自制 ESP32-C3 小米闹钟复刻版的发布页：浏览固件功能，插上 USB，用浏览器直接烧录固件，无需安装 esptool。

- 在线页面：https://yuhua2025.github.io/MI-ALARM-ESP32C3/ （需启用 GitHub Pages）
- 当前固件版本：**v3.15**

## 功能

- TM1652 四位七段显示，7 级亮度，夜间自动调暗
- DS1302 独立走时，掉电不丢时间
- 5 组独立闹钟，4 种可选铃声，整点报时
- 首次开机开启 `XiaoMiClock` 热点，手机连上后访问 192.168.4.1 完成配网
- 配网后可在网页里设置亮度、夜间模式、闹钟、铃声与校时

## 在线烧录

1. 用 USB-C 数据线连接电脑与闹钟
2. 选择固件类型：
   - **完整固件**：4 MB，写入偏移 `0x0`，含 bootloader、分区表与应用；适用于新板、换板或恢复出厂，会清空 WiFi 与设置
   - **应用固件**：约 1.03 MB，写入偏移 `0x10000`，要求设备已烧过本固件，升级后保留全部设置
3. 点击「连接设备并烧录」，在弹窗中选择串口并等待写入完成

浏览器要求：电脑版 Chrome、Edge 或 Opera（需要 Web Serial 支持），并通过 HTTPS 或 localhost 访问。Safari 与手机浏览器无法烧录。

## 固件文件与校验

| 固件 | 文件 | 大小 | 烧录偏移 | SHA-256 |
| --- | --- | --- | --- | --- |
| 完整固件 | `firmware/XiaoMiClock_v3.15_merged.bin` | 4,194,304 | `0x0` | `a605cce8f94997f26b42567856617b5c48a5467286aee87083e1136c7b34a71b` |
| 应用固件 | `firmware/XiaoMiClock_v3.15_app.bin` | 1,083,920 | `0x10000` | `4a7124d925ce88eba91167f27d7a9d3285b565a6c5a2ca7427cdf7c1724123f5` |

## 目录结构

```
index.html                 页面结构
css/style.css              样式与响应式布局
js/app.js                  固件切换、SHA 复制、图集灯箱、滚动动画
js/esp-web-tools/          esp-web-tools 10.4.0（本地打包，已中文化）
manifests/full.json        完整固件清单
manifests/app.json         应用固件清单
firmware/                  v3.15 固件 bin
assets/img/                页面用图
img/                       原始素材
```

## 本地预览

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080 。`localhost` 属于安全上下文，可直接测试烧录。

## 发布新固件

1. 将新的 `XiaoMiClock_vX.XX_app.bin` 与 `XiaoMiClock_vX.XX_merged.bin` 放入 `firmware/`，删除旧版本 bin
2. 更新 `manifests/full.json` 与 `manifests/app.json` 中的 `version` 和 `path`
3. 更新 `index.html` 中的版本号与两个固件卡的 SHA-256（短串、`title`、`data-copy` 三处保持一致）
4. 若应用固件大小变化，同步 `index.html` 固件卡与 `js/app.js` 中的提示文案
5. 本地验证页面与固件可正常访问后提交

## 技术说明

- 烧录能力来自 [esp-web-tools](https://github.com/esphome/esp-web-tools)（Apache-2.0），已本地化打包，不依赖 CDN
- 完整固件的 NVS 区域（`0x9000`–`0xE000`）为空白，不含 WiFi 等隐私数据
