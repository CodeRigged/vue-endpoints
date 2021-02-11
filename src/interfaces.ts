import { AxiosInstance, AxiosRequestConfig } from 'axios';

interface Apis {
    name: string;
    instance: AxiosInstance;
}

interface ApiInstances {
    name: string;
    configs: AxiosRequestConfig;
}

interface PluginOptions {
    baseApi?: string;
    apiInstances: ApiInstances[];
}

export { Apis, ApiInstances, PluginOptions };
