import { setDynamicTargetMetaData, setStaticTargetMetaData, setDynamicMethodMetaData } from '@xservice/core';
import Vue, { VueConstructor } from 'vue';
export const webview = setDynamicTargetMetaData('vue.webview', (value, webview: VueConstructor<Vue>) => webview);
export const keepAlive = setStaticTargetMetaData('vue.webview.keepalive', true);