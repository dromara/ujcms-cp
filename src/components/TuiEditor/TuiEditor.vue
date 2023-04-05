<script lang="ts">
const editorEvents = ['load', 'change', 'caretChange', 'focus', 'blur', 'keydown', 'keyup', 'beforePreviewRender', 'beforeConvertWysiwygToMarkdown'];
export default { name: 'TuiEditor' };
</script>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch, PropType, onUnmounted, nextTick } from 'vue';
import { useFormItem } from 'element-plus';
import { vOnClickOutside } from '@vueuse/components';
import { decodeHTML } from 'entities';
import Editor, { EditorType, PreviewStyle, EditorOptions } from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';
import Prism from 'prismjs';
import { addImageBlobHook, toggleFullScreen, clickOutside } from './utils';
import '@toast-ui/editor/dist/i18n/zh-cn';
import '@toast-ui/editor/dist/i18n/zh-tw';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/chart/dist/toastui-chart.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-clojure.js';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';

const props = defineProps({
  modelValue: { type: String, default: '' },
  html: { type: String, default: '' },
  initialEditType: { type: String as PropType<EditorType>, default: 'markdown' },
  height: { type: String, default: '300px' },
  previewStyle: { type: String as PropType<PreviewStyle>, default: 'tab' },
  language: { type: String, default: 'en' },
  options: { type: Object, default: null },
});
const emit = defineEmits([...editorEvents, 'update:modelValue', 'update:html', 'different']);

const { modelValue, html, initialEditType, height, previewStyle, language, options } = toRefs(props);
const toastuiEditor = ref<any>();
let editor: Editor;
const { formItem } = useFormItem();

watch(previewStyle, () => {
  editor.changePreviewStyle(previewStyle.value);
});
watch(height, () => {
  editor.setHeight(height.value);
});

const eventOptions: any = {};

// 内容为空时，默认生成以下HTML，应作为空串处理
const emptyHtml = '<p><br class="ProseMirror-trailingBreak"></p>';

editorEvents.forEach((event) => {
  eventOptions[event] = (...args: any[]) => {
    if (event === 'change') {
      const newHtml = editor.getHTML();
      if (newHtml !== html.value) {
        emit('update:html', newHtml !== emptyHtml ? newHtml : '');
      }
      const newMarkdown = editor.getMarkdown();
      if (newMarkdown !== modelValue.value) {
        emit('update:modelValue', newMarkdown);
      }
      formItem?.validate?.('change').catch((err: any) => {
        if (import.meta.env.MODE !== 'production') {
          console.warn(err);
        }
      });
    }
    emit(event, ...args);
  };
});

const createFullscreenButton = () => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toastui-editor-toolbar-icons text-xl';
  button.style.backgroundImage = 'none';
  button.style.margin = '0';
  button.innerHTML = 'F';
  button.addEventListener('click', () => {
    toggleFullScreen(editor, toastuiEditor.value, height.value);
  });
  return button;
};

onMounted(() => {
  const chartOptions = {
    maxWidth: 800,
    maxHeight: 400,
  };
  const computedOptions: EditorOptions = {
    ...options?.value,

    initialValue: modelValue.value ?? '',
    initialEditType: initialEditType.value,
    height: height.value,
    previewStyle: previewStyle.value,
    language: language.value,
    autofocus: false,
    usageStatistics: false,
    el: toastuiEditor.value,
    events: eventOptions,
    hooks: { addImageBlobHook },
    plugins: [[chart, chartOptions], [codeSyntaxHighlight, { highlighter: Prism }], tableMergedCell, uml],
    toolbarItems: [
      [
        {
          name: 'fullscreen',
          el: createFullscreenButton(),
          tooltip: 'Fullscreen',
        },
      ],
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
      ['scrollSync'],
    ],
  };
  editor = new Editor(computedOptions);
  // markdown无值，html有值，则用设置html
  if (!modelValue.value && html.value) {
    editor.setHTML(html.value);
    // 防止在切换编辑器时，因清空markdown值导致事件无效
    nextTick().then(() => {
      emit('update:modelValue', editor.getMarkdown());
    });
    return;
  }
  // 检查markdown生成的HTML和原HTML是否匹配
  const currHtml = editor.getHTML();
  if (modelValue.value && decodeHTML(html.value) !== currHtml) {
    // 触发不匹配事件
    emit('different', html.value, currHtml);
    emit('update:html', currHtml);
  }
});
onUnmounted(() => {
  editorEvents.forEach((event) => {
    editor.off(event);
  });
  editor.destroy();
});
const getHTML = () => editor.getHTML();
const setHTML = (html: string): void => editor.setHTML(html);
const getMarkdown = () => editor.getMarkdown();
const setMarkdown = (markdown: string): void => editor.setMarkdown(markdown);
const getRootElement = () => toastuiEditor.value;
defineExpose({ getRootElement, getHTML, getMarkdown, setHTML, setMarkdown });
</script>

<template>
  <!-- 在ElementPlus的对话框中，“更多”工具条按钮点击后，点击其它地方不会关闭工具条 -->
  <div ref="toastuiEditor" v-on-click-outside="clickOutside"></div>
</template>

<style lang="scss" scoped>
:deep(.ProseMirror),
:deep(.toastui-editor-contents) {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
</style>
