import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface Apis {
    name: string;
    instance: AxiosInstance;
    interceptorIds?: InterceptorIds;
}
interface ApiInstances {
    name: string;
    configs: AxiosRequestConfig;
    interceptors?: ApiInterceptors;
}
interface ApiInterceptors {
    request?: {
        onSuccess?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
        onError?: (error: any) => any;
    };
    response?: {
        onResponse?: (response: AxiosResponse) => AxiosResponse<any> | Promise<AxiosResponse<any>>;
        onError?: (error: any) => any;
    };
}
interface InterceptorIds {
    request?: number;
    response?: number;
}
interface PluginOptions {
    baseApi?: string;
    apiInstances: ApiInstances[];
}

export { Apis, ApiInstances, ApiInterceptors, InterceptorIds, PluginOptions };
