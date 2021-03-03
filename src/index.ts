import { App } from 'vue';
import './vue';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Apis, ApiInstances, ApiInterceptors, PluginOptions, InterceptorIds } from './interfaces';

export default class VueEndpoints {
    constructor(hosts?: PluginOptions) {
        if (typeof (hosts as PluginOptions) === 'object') {
            const { baseApi, apiInstances } = hosts as PluginOptions;
            if (baseApi === undefined) {
                this.createBaseApi(apiInstances[0].configs, apiInstances[0].interceptors);
            }
            this.apiInstances = this.removeInstancesWithDuplicateName(apiInstances);
            this.initializeApis(baseApi);
        } else if (hosts === undefined) {
            this.createBaseApi();
        }
    }

    readonly apiInstances: ApiInstances[] = [];
    readonly apis: Apis[] = [];

    private baseApi: AxiosInstance | undefined;

    public setBaseApi(name: string): void {
        this.baseApi = this.getApi(name);
    }

    install(app: App): void {
        app.config.globalProperties.$apiEndpoints = this;
        app.config.globalProperties.$baseApi = this.baseApi;
    }

    private createBaseApi(configs?: AxiosRequestConfig, interceptors?: ApiInterceptors): void {
        if (typeof this.baseApi === 'undefined') {
            let baseApi = axios.create(configs);
            if (interceptors) {
                const val = this.setInterceptors(baseApi, interceptors);
                baseApi = val.instance;
                this.apis.push({ name: 'baseApi', instance: baseApi, interceptorIds: val.interceptorsIds });
            } else {
                this.apis.push({ name: 'baseApi', instance: baseApi });
            }
            this.baseApi = baseApi;
        } else {
            throw Error('An API instance has already been created!');
        }
    }

    public getApi(name: string): AxiosInstance | undefined {
        const apiInstance = this.apis.find((api) => api.name === name);
        if (apiInstance) {
            return apiInstance.instance;
        } else {
            throw Error(`Couldn't find axios instance with name "${name}"`);
        }
    }

    private initializeApis(baseApi?: string): void {
        this.apiInstances.forEach((apiInstance) => {
            const { name, configs, interceptors } = apiInstance;

            let instance = axios.create(configs);
            if (interceptors) {
                const val = this.setInterceptors(instance, interceptors);
                instance = val.instance;
                this.apis.push({ name, instance, interceptorIds: val.interceptorsIds });
            } else {
                this.apis.push({ name, instance });
            }
            if (name === baseApi) {
                this.baseApi = instance;
            }
        });
    }
    private removeInstancesWithDuplicateName(apiInstances: ApiInstances[]): ApiInstances[] {
        return apiInstances.filter(({ name }, index, arr) => {
            for (let i = index + 1; i < arr.length; i++) {
                if (name === arr[i].name) {
                    throw Error(
                        `Duplicate instance with name '${name}' whilst initalizing APIs. Check indexes ${index} and ${i} of your object.`,
                    );
                    // return false;
                }
            }
            return true;
        });
    }
    private setInterceptors(
        instance: AxiosInstance,
        interceptors: ApiInterceptors,
    ): { instance: AxiosInstance; interceptorsIds: InterceptorIds } {
        const { request, response } = interceptors;
        const interceptorsIds: InterceptorIds = {};
        if (request) {
            const { onSuccess, onError } = request;
            interceptorsIds.request = instance.interceptors.request.use(onSuccess, onError);
        }
        if (response) {
            const { onResponse, onError } = response;
            interceptorsIds.response = instance.interceptors.response.use(onResponse, onError);
        }
        return { instance, interceptorsIds };
    }
}

export function createVueEndpoints(params?: PluginOptions): VueEndpoints {
    return new VueEndpoints(params);
}
