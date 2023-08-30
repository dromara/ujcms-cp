// npm run plop core user user page
// npm run plop <子系统> <分类> <模块> <page|list>
/* eslint-disable func-names */
module.exports = function (plop) {
  // controller generator
  plop.setGenerator('view', {
    description: 'application views',
    prompts: [
      {
        type: 'input',
        name: 'sub',
        message: 'sub:',
      },
      {
        type: 'input',
        name: 'path',
        message: 'path:',
      },
      {
        type: 'input',
        name: 'name',
        message: 'name:',
      },
      {
        type: 'input',
        name: 'type',
        message: 'type:',
      },
    ],
    actions: (data) => {
      const actions = [];
      actions.push({
        type: 'add',
        path: 'src/views/{{kebabCase path}}/{{pascalCase name}}Form.vue',
        templateFile: 'plop-templates/view_form.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/views/{{kebabCase path}}/{{pascalCase name}}List.vue',
        templateFile: `plop-templates/view_${data.type}.hbs`,
      });
      actions.push({
        type: 'append',
        path: 'src/api/{{kebabCase path}}.ts',
        templateFile: 'plop-templates/api.hbs',
        data: { isList: data.type === 'list' },
      });
      return actions;
    },
  });
};
