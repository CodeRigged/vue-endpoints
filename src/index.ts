import { App } from 'vue';
import './vue';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Apis, ApiInstances, PluginOptions } from './interfaces';

export default class VueApis {
    constructor(hosts?: PluginOptions) {
        if (typeof (hosts as PluginOptions) === 'object') {
            const { baseApi, apiInstances } = hosts as PluginOptions;
            if (baseApi === undefined) {
                this.createBaseApi(apiInstances[0].configs);
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
        app.config.globalProperties.$apis = this;
        app.config.globalProperties.$baseApi = this.baseApi;
    }

    private createBaseApi(configs?: AxiosRequestConfig): void {
        if (typeof this.baseApi === 'undefined') {
            const baseApi = axios.create(configs);
            this.baseApi = baseApi;
            this.apis.push({ name: 'baseApi', instance: baseApi });
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
            const { name, configs } = apiInstance;
            const instance = axios.create(configs);
            this.apis.push({ name, instance });
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
}

export function createVueApis(params?: PluginOptions): VueApis {
    return new VueApis(params);
}
