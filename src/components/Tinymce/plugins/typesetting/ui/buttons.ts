import { Editor, Formats } from 'tinymce';

const register = (editor: Editor, defaultOptions: any): void => {
  const onAction = () => editor.execCommand(defaultOptions.id);
  const onSetup = () => {
    const attributes = ['class', 'lang', 'align'];
    const styles = [
      'font-family',
      'font-size',
      'line-height',
      'text-indent',
      'text-align',
      'display',
      'margin-left',
      'margin-right',
      'margin-bottom',
      'margin-top',
      'orphans',
      'widows',
    ];
    const typesettingremove: Formats.RemoveFormat[] = [
      {
        selector: 'b,strong,em,i,font,u,strike,s,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins,small',
        attributes,
        styles,
        remove: 'none',
        split: true,
        expand: false,
        block_expand: true,
        deep: true,
      },
      {
        selector: 'span',
        attributes,
        styles,
        remove: 'empty',
        split: true,
        expand: false,
        deep: true,
      },
      { selector: 'p', attributes, styles, split: false, expand: false, deep: true },
      { selector: 'figure', attributes, styles, split: false, expand: false, deep: true, ceFalseOverride: true },
      { selector: '*', attributes, styles, split: false, expand: false, deep: true },
    ];
    editor.formatter.register('typesettingremove', typesettingremove);
    const typesettingformat: Formats.SelectorFormat[] = [
      {
        selector: 'p,div',
        styles: {
          textIndent: '%textIndent',
          fontFamily: '%fontFamily',
          fontSize: '%fontSize',
          lineHeight: '%lineHeight',
        },
        inherit: false,
      },
      {
        selector: 'ul,ol,table,figure',
        styles: {
          fontFamily: '%fontFamily',
          fontSize: '%fontSize',
          lineHeight: '%lineHeight',
        },
        inherit: false,
      },
      {
        selector: 'h1,h2,h3,h4,h5,h6',
        styles: {
          fontFamily: '%fontFamily',
        },
        inherit: false,
      },
    ];
    editor.formatter.register('typesettingformat', typesettingformat);
    const typesettingcenter = [
      {
        selector: 'figure.image',
        collapsed: false,
        classes: 'align-center',
        ceFalseOverride: true,
        preview: 'font-family font-size',
      },
      {
        selector: 'img,audio,video',
        collapsed: false,
        styles: {
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
        preview: false,
      },
    ];
    editor.formatter.register('typesettingcenter', typesettingcenter);
    const tablefullwidth = [
      {
        selector: 'table',
        styles: {
          width: '100%',
        },
        inherit: false,
      },
    ];
    editor.formatter.register('tablefullwidth', tablefullwidth);
    return () => undefined;
  };

  if (!editor.ui.registry.getAll().icons[defaultOptions.id]) {
    editor.ui.registry.addIcon(defaultOptions.id, defaultOptions.icon);
  }

  editor.ui.registry.addButton(defaultOptions.id, {
    icon: defaultOptions.id,
    tooltip: defaultOptions.tooltip,
    onAction,
    onSetup,
  });

  editor.ui.registry.addMenuItem(defaultOptions.id, {
    icon: defaultOptions.id,
    text: defaultOptions.tooltip,
    onAction,
  });
};

export { register };
