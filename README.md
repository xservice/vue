# @xservice/vue

文档暂无

## Usage

```ts
import { injectable } from 'inversify';
import { vpc } from '@xservice/core';
import App from '../App.vue';
import { webview, keepAlive } from '../vue';
import TestComponent from '../components/Test.vue';

@injectable()
@webview(TestComponent)
@keepAlive
export default class IndexService {
  @vpc.router('/')
  async HOME(
    @vpc.href href: string, 
    @vpc.redirect redirect: Function,
    @vpc.method method: string,
    @vpc.vget get: Function
  ) {
    const data = await get('/abc');
    return [
      <div on-click={() => redirect('/test')}>
        {href} - {method}<p>1111</p> {data.a} 
        <p>{JSON.stringify(data)}</p>
      </div>,
      <div slot="test">test slot</div>,
      <div slot="abc">44444</div>
    ];
  }

  @vpc.router('/test')
  test() {
    return <App />
  }

  @vpc.get('/abc')
  test2() {
    return {
      a:999
    }
  }
}
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, yunjie (Evio) shen
