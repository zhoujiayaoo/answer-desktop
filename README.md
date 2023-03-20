# 环境配置

1、设置 electron 源

```bash
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

# 开发流程

1、启动前端服务

```bash
npm run dev
```

2、启动 electron

```bash
npm run start
```

# 打包命令

```bash
npm run electron:build
```

# 注意事项

1、package.json 文件中，`chcp 65001 && `表示设置控制台打印字符集为 utf8（如果不设置，控制台打印会中文乱码），如果还是中文乱码，需要在控制台手动输入`chcp 65001`即可解决
