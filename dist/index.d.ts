import { VNode } from 'vue';
import { FrameworkerRenderer, MethodMetadata, TargetMetadata } from '@xservice/core';
import { Context } from '@xservice/server';
export * from './decorate';
export default class VueFrameworkerRenderer<T = {}> implements FrameworkerRenderer {
    private readonly element;
    private readonly keepAliveContainerComponentName;
    private readonly observe;
    private readonly vue;
    constructor(ele: HTMLElement | string, max?: number);
    serviceMethodBinding(meta: MethodMetadata): void;
    serviceTargetBinding(meta: TargetMetadata): void;
    serviceMount(): void;
    serviceInvoke(target: any): any;
    serviceRender(target: TargetMetadata, method: MethodMetadata, component: VNode | VNode[]): void;
    serviceContext(ctx: Context & T): void;
}
