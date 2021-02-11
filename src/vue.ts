import { AxiosInstance } from 'axios';
import VueApis from '.';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $apis: VueApis;
        $baseApi: AxiosInstance;
    }
}
