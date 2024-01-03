import tinymce, { Editor } from 'tinymce';
import { getOptions } from '../api/settings';

/**
 * 合并空行
 *
 * @param editor 编辑对象
 */
const mergeEmptyLines = (editor: Editor, removeAll: boolean) => {
  const blocks = editor.getBody().querySelectorAll('h1,h2,h3,h4,h5,h6,p,blockquote');
  let isEmpty = removeAll;
  tinymce.each(blocks, (block) => {
    if (editor.dom.isEmpty(block)) {
      if (isEmpty) {
        editor.dom.remove(block);
      }
      isEmpty = true;
    } else {
      isEmpty = false;
    }
  });
};
const DBC = '　％０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'.split('');
const SBC = ' %0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
function toSdb(text: string): string {
  let temp = '';
  for (let i = 0, len = text.length; i < len; i++) {
    const index = DBC.indexOf(text.charAt(i));
    if (index >= 0) {
      temp += SBC[index];
    } else {
      temp += text.charAt(i);
    }
  }
  return temp;
}

const dbcToSbc = (editor: Editor) => {
  const body = editor.getBody();
  const walker = new tinymce.dom.TreeWalker(body, body);
  do {
    const node = walker.current();
    if (node.nodeType === 3) {
      const text = node as Text;
      text.data = toSdb(text.data);
    }
  } while (walker.next());
};

const doAction = function (editor: Editor) {
  const { dom, selection } = editor;
  const options = getOptions(editor);

  if (options.emptyLine !== 'remain') {
    mergeEmptyLines(editor, options.emptyLine === 'remove');
  }
  if (options.halfWidthCharConversion) {
    dbcToSbc(editor);
  }
  editor.formatter.remove('typesettingremove', {}, editor.getBody());

  // 如果选中的元素是不可编辑的，会出现只格式化选中的内容，不会格式化全部文档
  if (dom.getContentEditable(selection.getNode()) === 'false') {
    editor.execCommand('selectAll');
  }
  tinymce.each(editor.getBody().querySelectorAll('figure.image'), (block: Element) => {
    editor.formatter.apply('typesettingcenter', {}, block);
  });
  tinymce.each(editor.getBody().querySelectorAll('img,audio,video'), (block: Element) => {
    // figure.image 下的图片由 figure.image 规则格式化，不直接格式化img
    if (dom.getParent(block, 'figure.image') === null) {
      editor.formatter.apply('typesettingcenter', {}, block);
    }
  });

  tinymce.each(editor.getBody().childNodes, (block: ChildNode) => {
    // 避免将只包含图片的p段落进行缩进处理
    const nodeName = block.nodeName.toLowerCase();
    if (nodeName !== 'p' || block.textContent !== '') {
      editor.formatter.apply(
        'typesettingformat',
        { textIndent: options.textIndent ? '2em' : '', fontFamily: options.fontFamily ?? '', fontSize: options.fontSize ?? '', lineHeight: options.lineHeight ?? '' },
        block,
      );
    }
    if (nodeName === 'table' && options.tableFullWidth) {
      editor.formatter.apply('tablefullwidth', {}, block);
    }
  });
  editor.nodeChanged();
};
const create = (editor: Editor) => {
  editor.undoManager.transact(function () {
    editor.focus();
    // doAct(editor);
    doAction(editor);
  });
};
export { create };
