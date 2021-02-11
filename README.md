# vue-endpoints

vue-endpoints is a small wrapper for projects which require multiple API endpoints.

It uses [axios](https://github.com/axios/axios#axios) and is inspired by [vue-axios](https://github.com/imcvampire/vue-axios#vue-axios). Please go check them both out.

## Installing

Using npm:

```bash
$ npm install vue-endpoints
```

Using yarn:

```bash
$ yarn add vue-endpoints
```

## Usage in Vue 3

With typescript:

```ts
import { createApp } from "vue";
import { AxiosRequestConfig } from "axios";
import VueEndpoints, { createVueEndpoints } from "vue-endpoints";

const configurationsFirstInstance: AxiosRequestConfig = {
  baseURL: "/firstEndpoint",
};
const configurationsSecondInstance: AxiosRequestConfig = { baseURL: "/secondEndpoint" };

const apiInstances = [
  { name: "firstInstance", configs: configurationsSecondInstance },
  { name: "secondInstance", configs: configurationsFirstInstance },
];
const vueEndpoints: VueEndpoints = createVueEndpoints({
  baseApi: "firstInstance",
  apiInstances,
});

createApp(App)
  .use(vueEndpoints)
  .mount("#app");
```

Without typescript:

```js
import { createApp } from "vue";
import { AxiosRequestConfig } from "axios";
import VueEndpoints from "vue-endpoints";

const configurationsFirstInstance = {
  baseURL: "/firstEndpoint",
};
const configurationsSecondInstance = { baseURL: "/secondEndpoint" };

const apiInstances = [
  { name: "firstInstance", configs: configurationsSecondInstance },
  { name: "secondInstance", configs: configurationsFirstInstance },
];

// alternative assignment
const vueEndpoints = new VueEndpoints({ apiInstances });

createApp(App)
  .use(vueEndpoints)
  .mount("#app");
```

In Vue component: 

```js
export default  {
  computed: {
    option1(){
        return this.$baseApi.get('/url/to/api');
    },
    //or
    option2(){
        return this.$apiEndpoints.getApi('nameOfApi').get('/url/to/api');
    },
  },
}
```

## API

##### createVueEndpoints(params?: PluginOptions): VueEndpoints


```js
const vueEndpoints = createVueEndpoints({
    /* Default base API will be the first API instance of Array */
    baseApi: "optional", 
  [{name:"someName", configs:{...axiosConfigurations}}],
});
```

##### setBaseApi(name: string): void

```js
const vueEndpoints = createVueEndpoints({
  [{name:"someName", configs:{...axiosConfigurations}}],
});
vueEndpoints.setBaseApi('myBaseApi')
```

#### getApi(name: string): AxiosInstance | undefined;

```js
const vueEndpoints = createVueEndpoints({
  [{name:"someName", configs:{...axiosConfigurations}}],
});

const someNameApi = vueEndpoints.getApi('someName');

```

#### apiInstances: ApiInstances[]
```html
<template>
  <div class="about">
    <h1>{{ myInstances[0].name }}</h1>
  </div>
</template>
```
```js
<script>
export default {
  computed: {
    myInstances() {
      return this.$apiEndpoints.apiInstances;
    },
  },
};
</script>
```
## vue-2 compatibility

For now this tool is only compatible in [vue-3](https://v3.vuejs.org/).


## License

[MIT](/LICENSE)