'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));
var core = require('@xservice/core');

const webview = core.setDynamicTargetMetaData('vue.webview', (value, webview) => webview);
const keepAlive = core.setStaticTargetMetaData('vue.webview.keepalive', true);

class VueFrameworkerRenderer {
    constructor(ele, max = Infinity) {
        this.keepAliveContainerComponentName = 'VueKeepAliveContainerComponentWith';
        this.observe = Vue.observable({
            active: null,
            includes: [],
            excludes: [],
            max: Infinity,
            component: [],
        });
        const that = this;
        this.observe.max = max;
        this.element = typeof ele === 'string'
            ? window.document.querySelector(ele)
            : ele;
        this.vue = new Vue({
            render(h) {
                const component = that.observe.active || that.keepAliveContainerComponentName + 'Default';
                if (component === that.keepAliveContainerComponentName + 'Default') ;
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
            console.warn(err, vm, info);
        };
    }
    serviceMethodBinding(meta) {
    }
    serviceTargetBinding(meta) {
        const keepAlive = !!(meta ? meta.get('vue.webview.keepalive') : false);
        const webview = meta ? meta.get('vue.webview') : null;
        if (webview) {
            if (webview.options.name === 'Default')
                throw new Error('you cannot define `Default` as a component name.');
            meta.set('target.use.name', this.keepAliveContainerComponentName + webview.options.name);
            Vue.component(this.keepAliveContainerComponentName + webview.options.name, webview);
            if (keepAlive) {
                this.observe.includes.push(this.keepAliveContainerComponentName + webview.options.name);
            }
            else {
                this.observe.excludes.push(this.keepAliveContainerComponentName + webview.options.name);
            }
        }
    }
    serviceMount() {
        this.vue.$mount(this.element);
    }
    serviceInvoke(target) {
        if (!target.$createElement) {
            Object.defineProperty(target, '$createElement', {
                value: this.vue.$createElement.bind(this.vue),
            });
        }
        return target;
    }
    serviceRender(target, method, component) {
        this.observe.active = target ? target.get('target.use.name') || null : null;
        this.observe.component = Array.isArray(component) ? component : [component];
    }
}

exports.default = VueFrameworkerRenderer;
exports.keepAlive = keepAlive;
exports.webview = webview;
