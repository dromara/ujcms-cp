import { Editor } from 'tinymce';

interface TypesettingOptions {
  /**
   * 字体
   */
  fontFamily?: string;
  /**
   * 字号
   */
  fontSize?: string;
  /**
   * 行高
   */
  lineHeight?: string;
  /**
   * 首行缩进
   */
  textIndent?: string;
  /**
   * 图片居中
   */
  imageCenterAlign: boolean;
  /**
   * 表格百分百宽度
   */
  tableFullWidth: boolean;
  /**
   * 空行。remain: 保留空行, one: 合并为一行, remove: 删除空行
   */
  emptyLine: 'remain' | 'one' | 'remove';
  /**
   * 全角转半角。全角字母、数字、百分号、空格转换为半角
   */
  halfWidthCharConversion: boolean;
}

const getOptions = (editor: Editor): TypesettingOptions =>
  editor.getParam('typesetting_options', {
    // fontFamily: 'SimSun',
    // fontSize: '12pt',
    // lineHeight: '1.5',
    // textIndent: '2em',
    imageCenterAlign: true,
    tableFullWidth: true,
    emptyLine: 'one',
    halfWidthCharConversion: true,
  });

export { getOptions };
