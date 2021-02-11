import { AxiosInstance } from 'axios';
import VueEndpoints from '.';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $apiEndpoints: VueEndpoints;
        $baseApi: AxiosInstance;
    }
}
