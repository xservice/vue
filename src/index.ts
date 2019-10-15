import Vue, { VNode } from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';
import { FrameworkerRenderer, MethodMetadata, TargetMetadata } from '@xservice/core';

type VueFrameworkerRendererObserveType = {
  active: string | null,
  includes: string[],
  excludes: string[],
  max: number,
  component: VNode[],
}

export * from './decorate';
export default class VueFrameworkerRenderer implements FrameworkerRenderer {
  private readonly element: HTMLElement;
  private readonly keepAliveContainerComponentName = 'VueKeepAliveContainerComponentWith';
  private readonly observe = Vue.observable<VueFrameworkerRendererObserveType>({
    active: null,
    includes: [],
    excludes: [],
    max: Infinity,
    component: [],
  });
  private readonly vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>>;
  constructor(ele: HTMLElement | string, max: number = Infinity) {
    const that = this;
    this.observe.max = max;
    this.element = typeof ele === 'string' 
      ? window.document.querySelector(ele) as  HTMLElement 
      : ele;
    this.vue = new Vue({
      render(h) {
        const component = that.observe.active || that.keepAliveContainerComponentName + 'Default';
        if (component === that.keepAliveContainerComponentName + 'Default') {}
        const childrens = component === that.keepAliveContainerComponentName + 'Default' 
          ? that.observe.component
          : [h(component, {}, that.observe.component)];
        return h('keep-alive', {
          props: {
            include: that.observe.includes,
            exclude: that.observe.excludes,
            max: that.observe.max,
          }
        }, childrens);
      }
    });

    Vue.config.errorHandler = function (err, vm, info) {
      console.warn(err, vm, info)
    }
  }
  

  serviceMethodBinding(meta: MethodMetadata) {
    
  }

  serviceTargetBinding(meta: TargetMetadata) {
    const keepAlive = !!(meta ? meta.get('vue.webview.keepalive') : false);
    const webview = meta ? meta.get('vue.webview') : null;
    if (webview) {
      if (webview.options.name === 'Default') throw new Error('you cannot define `Default` as a component name.');
      meta.set('target.use.name', this.keepAliveContainerComponentName + webview.options.name);
      Vue.component(this.keepAliveContainerComponentName + webview.options.name, webview);
      if (keepAlive) {
        this.observe.includes.push(this.keepAliveContainerComponentName + webview.options.name);
      } else {
        this.observe.excludes.push(this.keepAliveContainerComponentName + webview.options.name);
      }
    }
  }

  serviceMount() {
    this.vue.$mount(this.element);
  }

  serviceInvoke(target: any) {
    if (!target.$createElement) {
      Object.defineProperty(target, '$createElement', {
        value: this.vue.$createElement.bind(this.vue),
      })
    }
    return target;
  }

  serviceRender(target: TargetMetadata, method: MethodMetadata, component: VNode | VNode[]) {
    this.observe.active = target ? target.get<string>('target.use.name') || null : null;
    this.observe.component = Array.isArray(component) ? component : [component];
  }
}