import { readdirSync, statSync } from 'fs';
import { join } from 'path';

require('dotenv').config('../.env');

// 配置项文档：https://koishi.js.org/api/app.html
const config = {
    port: process.env.PORT,

    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: process.env.ONEBOT_ACCOUNT,
            token: process.env.BOT_AUTH_TOKEN,
        },
    ],

    prefix: '%',

    plugins: {},

    logTime: 'MM/dd hh:mm',

    watch: {
        root: './**/*.js',
        ignore: ['node_modules'],
    },
};

const pluginDir = 'plugins';
if (readdirSync(process.env.PWD!).includes(pluginDir)) {
    const pluginDirPath = join(process.env.PWD!, pluginDir);
    if (!statSync(pluginDirPath).isDirectory())
        throw new Error(`目录下的${pluginDir}应为文件夹 (${pluginDirPath})`);

    for (const plugin of readdirSync(pluginDirPath)) {
        const pluginPath = join(pluginDirPath, plugin);
        if (!statSync(pluginPath).isDirectory()) continue;
        Object.assign(config.plugins, { [join(pluginPath, 'dist')]: {} });
    }
}

module.exports = config;
