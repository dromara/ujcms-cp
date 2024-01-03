import { Editor } from 'tinymce';
import { create } from '../core/actions';

const register = (editor: Editor, defaultOptions: any): void => {
  editor.addCommand(defaultOptions.id, () => {
    create(editor);
  });
};

export { register };
