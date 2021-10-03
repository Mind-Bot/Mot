import { App } from 'koishi-core';
import { Logger } from 'koishi-utils';
import 'koishi-adapter-onebot';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

require('dotenv').config('../.env');

const app = new App({
    port: parseInt(process.env.PORT!),
    bots: [
        {
            type: 'onebot:ws',
            server: 'ws://localhost:6700',
            selfId: process.env.ONEBOT_ACCOUNT,
            token: process.env.BOT_AUTH_TOKEN,
        },
    ],

    prefix: '%',
});

const pluginDir = 'plugins';
if (readdirSync(process.env.PWD!).includes(pluginDir)) {
    const pluginDirPath = join(process.env.PWD!, pluginDir);
    if (!statSync(pluginDirPath).isDirectory())
        throw new Error(`目录下的${pluginDir}应为文件夹 (${pluginDirPath})`);

    for (const plugin of readdirSync(pluginDirPath)) {
        const pluginPath = join(pluginDirPath, plugin);
        if (!statSync(pluginPath).isDirectory()) continue;
        app.plugin(require(join(pluginPath, 'dist')));
    }
}

Logger.showTime = 'MM/dd hh:mm';

app.start();
