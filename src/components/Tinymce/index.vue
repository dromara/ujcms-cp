<template>
  <div>
    <textarea :id="elementId" ref="element"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted, onBeforeUnmount, onActivated, onDeactivated, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAuthHeaders } from '@/utils/auth';
import { imageUploadUrl, queryGlobalSettings } from '@/api/config';

// 参考：https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/webpack/webpack_es6_npm/
// 参考：https://github.com/tinymce/tinymce-vue/blob/main/src/main/ts/components/Editor.ts
// Import TinyMCE
import tinymce from 'tinymce';
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default';
// A theme is also required
import 'tinymce/themes/silver';
// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist';
// import 'tinymce/plugins/anchor';
// import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
// import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
// import 'tinymce/plugins/nonbreaking';
// import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/paste';
// import 'tinymce/plugins/preview';
// import 'tinymce/plugins/print';
import 'tinymce/plugins/quickbars';
// import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
// import 'tinymce/plugins/spellchecker';
// import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
// import 'tinymce/plugins/template';
// import 'tinymce/plugins/textpattern';
// import 'tinymce/plugins/toc';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
// import 'tinymce/plugins/wordcount';

import { isTextarea, uuid, initEditor } from './utils';

export default defineComponent({
  name: 'Tinymce',
  props: {
    id: String,
    initialValue: String,
    modelValue: { type: String, default: '' },
    disabled: Boolean,
    inline: Boolean,
    init: Object,
    modelEvents: [String, Array],
    plugins: { type: [String, Array] as PropType<string | string[]> },
    toolbar: [String, Array],
    outputFormat: {
      type: String,
      validator: (prop: string) => prop === 'html' || prop === 'text',
    },
  },
  setup(props, ctx) {
    const { disabled, modelValue } = toRefs(props);
    const { t } = useI18n();
    const element = ref<any>();
    let vueEditor: any = null;
    const elementId: string = props.id || uuid('tiny-vue');
    const inlineEditor: boolean = (props.init && props.init.inline) || props.inline;
    const modelBind = !!ctx.attrs['onUpdate:modelValue'];
    let mounting = true;
    const initialValue: string = props.initialValue ? props.initialValue : '';
    let cache = '';
    const getContent = (isMounting: boolean): (() => string) => (modelBind ? () => (modelValue?.value ? modelValue.value : '') : () => (isMounting ? initialValue : cache));

    const global = ref<any>();

    const initWrapper = (): void => {
      const content = getContent(mounting);
      const publicPath = import.meta.env.VITE_PUBLIC_PATH;
      const finalInit = {
        language_url: `${publicPath}/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin: 'oxide',
        skin_url: `${publicPath}/tinymce/skins/ui/oxide`,
        // 必须添加 '/tinymce/skins/content/default/content.min.css'。否则 fontselect 默认不显示“系统字体”。
        content_css: [`${publicPath}/tinymce/skins/ui/oxide/content.min.css`, `${publicPath}/tinymce/skins/content/default/content.min.css`],
        menubar: false,
        plugins:
          'advlist autoresize autosave charmap code codesample directionality fullscreen hr image imagetools lists link media pagebreak paste quickbars ' +
          'searchreplace table visualblocks visualchars',
        toolbar:
          'fullscreen code | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | selectall removeformat pastetext | ' +
          'quickimage media link | blockquote codesample table | bullist numlist | outdent indent lineheight | forecolor backcolor | fontselect fontsizeselect formatselect | ' +
          'superscript subscript charmap | hr | ltr rtl | visualblocks visualchars | restoredraft undo redo | searchreplace',
        font_formats:
          '宋体=SimSun; 微软雅黑=Microsoft YaHei; 楷体=SimKai,KaiTi; 黑体=SimHei; 隶书=SimLi,LiSu; Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;' +
          'Arial Black=arial black,avant garde;Comic Sans MS=comic sans ms,sans-serif;Helvetica=helvetica;Impact=impact,chicago;Times New Roman=times new roman,times',
        quickbars_selection_toolbar: 'bold italic | h2 h3 blockquote',
        quickbars_insert_toolbar: false,
        paste_data_images: true,
        image_uploadtab: false,
        image_advtab: true,
        image_caption: true,
        images_file_types: global.value.upload.imageTypes,
        min_height: 300,
        max_height: 500,
        convert_urls: false,
        autosave_ask_before_unload: false,
        ...props.init,
        images_upload_handler(blobInfo: any, success: any, failure: any, progress: any) {
          const fileSizeLimitByte = global.value.upload.imageLimitByte;
          if (fileSizeLimitByte > 0 && blobInfo.blob().size > fileSizeLimitByte) {
            failure(t('error.fileMaxSize', { size: `${fileSizeLimitByte / 1024 / 1024}MB` }), { remove: true });
            return;
          }
          const xhr = new XMLHttpRequest();
          xhr.open('POST', imageUploadUrl);

          xhr.upload.onprogress = (e) => {
            progress((e.loaded / e.total) * 100);
          };

          xhr.onload = () => {
            if (xhr.status === 403) {
              failure(`HTTP Error: ${xhr.status}`, { remove: true });
              return;
            }

            if (xhr.status < 200 || xhr.status >= 300) {
              failure(`HTTP Error: ${xhr.status}`, { remove: true });
              return;
            }

            const json = JSON.parse(xhr.responseText);

            if (!json || typeof json.url !== 'string') {
              failure(`Invalid JSON: ${xhr.responseText}`, { remove: true });
              return;
            }
            success(json.url);
          };

          xhr.onerror = () => {
            failure(`Image upload failed due to a XHR Transport error. Code: ${xhr.status}`, { remove: true });
          };

          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          Object.entries(getAuthHeaders()).forEach(([key, value]: any) => xhr.setRequestHeader(key, value));
          xhr.send(formData);
        },

        file_picker_callback(callback: any, val: any, meta: any) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');

          let fileSizeLimtByte = 0;
          if (meta.filetype === 'image') {
            fileSizeLimtByte = global.value.upload.imageLimitByte;
            input.setAttribute('accept', global.value.upload.imageInputAccept);
            // input.setAttribute('accept', 'image/*');
          } else if (meta.filetype === 'media') {
            fileSizeLimtByte = global.value.upload.videoLimitByte;
            input.setAttribute('accept', global.value.upload.videoInputAccept);
            // input.setAttribute('accept', 'video/*');
          } else {
            fileSizeLimtByte = global.value.upload.fileLimitByte;
            input.setAttribute('accept', global.value.upload.fileInputAccept);
          }

          /*
            Note: In modern browsers input[type="file"] is functional without
            even adding it to the DOM, but that might not be the case in some older
            or quirky browsers like IE, so you might want to add it to the DOM
            just in case, and visually hide it. And do not forget do remove it
            once you do not need it anymore.
          */

          input.onchange = (event: Event) => {
            const { files } = event.target as HTMLInputElement;
            const file = files?.item(0);
            if (!file) return;
            if (fileSizeLimtByte > 0 && file.size > fileSizeLimtByte) {
              tinymce.activeEditor.windowManager.alert(t('error.fileMaxSize', { size: `${fileSizeLimtByte / 1024 / 1024}MB` }));
              return;
            }
            const xhr = new XMLHttpRequest();
            xhr.open('POST', imageUploadUrl);

            // xhr.upload.onprogress = (e) => {
            //   progress((e.loaded / e.total) * 100);
            // };

            xhr.onload = () => {
              if (xhr.status === 403) {
                tinymce.activeEditor.windowManager.alert(`HTTP Error: ${xhr.status}`);
                return;
              }

              if (xhr.status < 200 || xhr.status >= 300) {
                tinymce.activeEditor.windowManager.alert(`HTTP Error: ${xhr.status}`);
                return;
              }

              const json = JSON.parse(xhr.responseText);

              if (!json || typeof json.url !== 'string') {
                tinymce.activeEditor.windowManager.alert(`Invalid JSON: ${xhr.responseText}`);
                return;
              }

              if (meta.filetype === 'image') {
                callback(json.url, { alt: '' });
              } else if (meta.filetype === 'media') {
                callback(json.url);
                // callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
              } else {
                callback(json.url, { text: json.name });
              }
            };

            xhr.onerror = () => {
              tinymce.activeEditor.windowManager.alert(`Image upload failed due to a XHR Transport error. Code: ${xhr.status}`);
            };

            const formData = new FormData();
            formData.append('file', file, file.name);

            Object.entries(getAuthHeaders()).forEach(([key, value]: any) => xhr.setRequestHeader(key, value));
            xhr.send(formData);
          };

          input.click();
        },

        readonly: props.disabled,
        selector: `#${elementId}`,
        // plugins: mergePlugins(props.init && props.init.plugins, props.plugins),
        // toolbar: props.toolbar || (props.init && props.init.toolbar),
        inline: inlineEditor,
        setup: (editor: any) => {
          vueEditor = editor;
          editor.on('init', (e: Event) => initEditor(e, props, ctx, editor, modelValue, content));
          if (props.init && typeof props.init.setup === 'function') {
            props.init.setup(editor);
          }
        },
        branding: false,
      };
      if (isTextarea(element.value)) {
        element.value.style.visibility = '';
      }
      tinymce.init({ toolbar_mode: 'sliding', ...finalInit });
      mounting = false;
    };
    watch(disabled, (disable) => {
      if (vueEditor != null) {
        vueEditor.setMode(disable ? 'readonly' : 'design');
      }
    });
    onMounted(async () => {
      global.value = await queryGlobalSettings();
      initWrapper();
    });
    onBeforeUnmount(() => {
      tinymce.remove(vueEditor);
    });
    if (!inlineEditor) {
      onActivated(() => {
        if (!mounting) {
          initWrapper();
        }
      });
      onDeactivated(() => {
        if (!modelBind) {
          cache = vueEditor.getContent();
        }
        tinymce.remove(vueEditor);
      });
    }
    return { element, elementId };
  },
});
</script>
