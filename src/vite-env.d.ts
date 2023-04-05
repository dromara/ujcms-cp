/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'bpmn-js/lib/Modeler';
declare module 'bpmn-js/lib/Viewer';
declare module 'bpmn-js-properties-panel';
declare module 'bpmn-js/lib/util/ModelUtil';
declare module '@/components/bpmnjs/provider/bpmn';
declare module '@/components/bpmnjs/provider/flowable';
declare module '@/components/bpmnjs/descriptors/flowable';
declare module '@/components/bpmnjs/palette';
declare module '@/components/bpmnjs/context-pad';

interface ImportMetaEnv {
  readonly VITE_BASE_API: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_I18N_LOCALE: string;
  readonly VITE_I18N_FALLBACK_LOCALE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
