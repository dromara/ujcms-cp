import i18n from '@/i18n';
import { isShowPerm } from '@/store/useCurrentUser';

function filterExcludePerms(arr: any[]): any[] {
  const resultes = arr.filter((item) => (item.perms?.findIndex((perm: string) => !isShowPerm(perm)) ?? -1) === -1);
  for (let i = 0, len = resultes.length; i < len; i += 1) {
    if (resultes[i].children) {
      resultes[i].children = filterExcludePerms(resultes[i].children);
    }
  }
  return resultes;
}

export function getPermsTreeData(): any[] {
  const {
    global: { t },
  } = i18n;
  const perms = [
    {
      label: t('menu.personal'),
      key: 'menu.personal.key',
      perms: ['menu.personal'],
      children: [
        {
          label: t('menu.personal.password'),
          key: 'password:update',
          perms: ['password:update', 'password:matches'],
        },
        {
          label: t('menu.personal.homepage.environment'),
          key: 'homepage:environment',
          perms: ['homepage:environment'],
        },
        {
          label: t('menu.personal.homepage.generatedKey'),
          key: 'homepage:generatedKey',
          perms: ['homepage:generatedKey'],
        },
        {
          label: t('menu.personal.machine.code'),
          key: 'machine:code',
          perms: ['machine:code'],
        },
        {
          label: t('menu.personal.machine.license'),
          key: 'machine:license',
          perms: ['machine:license'],
        },
      ],
    },
    {
      label: t('menu.content'),
      key: 'menu.content.kay',
      perms: ['menu.content'],
      children: [
        {
          label: t('menu.content.article'),
          key: 'article.key',
          perms: ['article:page', 'article:list', 'channel:list', 'dict:list', 'model:list', 'block:list', 'processInstance:task'],
          children: [
            { label: t('list'), key: 'article:page' },
            { label: t('add'), key: 'article:create', perms: ['article:create', 'article.submit', 'jodConvert:doc', 'jodConvert:library'] },
            { label: t('view'), key: 'article:show', perms: ['article:show'] },
            { label: t('edit'), key: 'article:update', perms: ['article:update', 'article.submit', 'article:show', 'jodConvert:doc', 'jodConvert:library'] },
            { label: t('article.op.sticky'), key: 'article:sticky', perms: ['article:sticky'] },
            { label: t('article.op.submit'), key: 'article:submit', perms: ['article:submit'] },
            { label: t('article.op.archive'), key: 'article:archive', perms: ['article:archive'] },
            { label: t('article.op.offline'), key: 'article:offline', perms: ['article:offline'] },
            { label: t('delete'), key: 'article:delete', perms: ['article:delete'] },
            { label: t('completelyDelete'), key: 'article:completelyDelete', perms: ['article:completelyDelete'] },
          ],
        },
        {
          label: t('menu.content.articleReview'),
          key: 'articleReview.key',
          perms: ['articleReview:page', 'articleReview:list', 'channel:list', 'dict:list', 'model:list', 'block:list', 'processInstance:task'],
          children: [
            { label: t('list'), key: 'articleReview:page' },
            { label: t('pass'), key: 'articleReview:pass', perms: ['articleReview:pass'] },
            { label: t('reject'), key: 'articleReview:reject', perms: ['articleReview:reject'] },
          ],
        },
        {
          label: t('menu.content.channel'),
          key: 'channel.key',
          perms: ['channel:page', 'channel:list', 'processDefinition:list', 'model:list'],
          children: [
            { label: t('list'), key: 'channel:page' },
            { label: t('add'), key: 'channel:create', perms: ['channel:create'] },
            { label: t('edit'), key: 'channel:update', perms: ['channel:update', 'channel:show'] },
            { label: t('delete'), key: 'channel:delete', perms: ['channel:delete'] },
          ],
        },
        {
          label: t('menu.content.blockItem'),
          key: 'blockItem.key',
          perms: ['blockItem:page', 'blockItem:list', 'block:list'],
          children: [
            { label: t('list'), key: 'blockItem:page' },
            { label: t('add'), key: 'blockItem:create', perms: ['blockItem:create'] },
            { label: t('edit'), key: 'blockItem:update', perms: ['blockItem:update', 'blockItem:show'] },
            { label: t('delete'), key: 'blockItem:delete', perms: ['blockItem:delete'] },
          ],
        },
        {
          label: t('menu.content.dict'),
          key: 'dict.key',
          perms: ['dict:page', 'dict:list', 'dictType:list'],
          children: [
            { label: t('list'), key: 'dict:page' },
            { label: t('add'), key: 'dict:create', perms: ['dict:create'] },
            { label: t('edit'), key: 'dict:update', perms: ['dict:update', 'dict:show'] },
            { label: t('delete'), key: 'dict:delete', perms: ['dict:delete'] },
          ],
        },
        {
          label: t('menu.content.attachment'),
          key: 'attachment.key',
          perms: ['attachment:page', 'attachment:list'],
          children: [
            { label: t('list'), key: 'attachment:page' },
            { label: t('add'), key: 'attachment:create', perms: ['attachment:create'] },
            { label: t('edit'), key: 'attachment:update', perms: ['attachment:update', 'attachment:show'] },
            { label: t('delete'), key: 'attachment:delete', perms: ['attachment:delete'] },
          ],
        },
        {
          label: t('menu.content.generator'),
          key: 'generator.key',
          perms: ['generator:show', 'siteSettings:html:show', 'task:list', 'task:show', 'task:delete'],
          children: [
            { label: t('generator.op.fulltext.reindexAll'), key: 'generator:fulltext:reindexAll', perms: ['generator:fulltext:reindexAll'] },
            { label: t('generator.op.fulltext.reindexSite'), key: 'generator:fulltext:reindexSite', perms: ['generator:fulltext:reindexSite'] },
            { label: t('generator.html'), key: 'generator:html', perms: ['generator:html'] },
            { label: t('site.settings.html'), key: 'siteSettings:html:update', perms: ['siteSettings:html:update', 'generator:html'] },
          ],
        },
      ],
    },
    {
      label: t('menu.interaction'),
      key: 'menu.interaction.key',
      perms: ['menu.interaction'],
      children: [
        {
          label: t('menu.interaction.messageBoard'),
          key: 'messageBoard.key',
          perms: ['messageBoard:page', 'messageBoard:list'],
          children: [
            { label: t('list'), key: 'messageBoard:page' },
            { label: t('add'), key: 'messageBoard:create', perms: ['messageBoard:create'] },
            { label: t('edit'), key: 'messageBoard:update', perms: ['messageBoard:update', 'messageBoard:show'] },
            { label: t('updateStatus'), key: 'messageBoard:updateStatus', perms: ['messageBoard:updateStatus'] },
            { label: t('delete'), key: 'messageBoard:delete', perms: ['messageBoard:delete'] },
          ],
        },
      ],
    },
    {
      label: t('menu.config'),
      key: 'menu.config.key',
      perms: ['menu.config'],
      children: [
        {
          label: t('menu.config.globalSettings'),
          key: 'config.key',
          perms: ['config:show'],
          children: [
            { label: t('config.settings.base'), key: 'config:base:update', perms: ['config:base:update'] },
            { label: t('config.settings.upload'), key: 'config:upload:update', perms: ['config:upload:update'] },
            { label: t('config.settings.register'), key: 'config:register:update', perms: ['config:register:update'] },
            { label: t('config.settings.security'), key: 'config:security:update', perms: ['config:security:update'] },
            { label: t('config.settings.sms'), key: 'config:sms:update', perms: ['config:sms:show', 'config:sms:update'] },
            { label: t('config.settings.email'), key: 'config:email:update', perms: ['config:email:show', 'config:email:update'] },
            {
              label: t('config.settings.uploadStorage'),
              key: 'config:uploadStorage:update',
              perms: ['config:uploadStorage:show', 'config:uploadStorage:update'],
            },
            {
              label: t('config.settings.htmlStorage'),
              key: 'config:htmlStorage:update',
              perms: ['config:htmlStorage:show', 'config:htmlStorage:update'],
            },
            {
              label: t('config.settings.templateStorage'),
              key: 'config:templateStorage:update',
              perms: ['config:templateStorage:show', 'config:templateStorage:update'],
            },
            { label: t('config.settings.customs'), key: 'config:customs:update', perms: ['config:customs:update'] },
          ],
        },
        {
          label: t('menu.config.siteSettings'),
          key: 'siteSettings.key',
          perms: ['siteSettings:show'],
          children: [
            { label: t('site.settings.base'), key: 'siteSettings:base:update', perms: ['siteSettings:base:update'] },
            { label: t('site.settings.watermark'), key: 'siteSettings:watermark:update', perms: ['siteSettings:watermark:update'] },
            { label: t('site.settings.messageBoard'), key: 'siteSettings:messageBoard:update', perms: ['siteSettings:messageBoard:update'] },
            { label: t('site.settings.customs'), key: 'siteSettings:customs:update', perms: ['siteSettings:customs:update'] },
          ],
        },
        {
          label: t('menu.config.model'),
          key: 'model.key',
          perms: ['model:page', 'model:list'],
          children: [
            { label: t('list'), key: 'model:page' },
            { label: t('add'), key: 'model:create', perms: ['model:create'] },
            { label: t('edit'), key: 'model:update', perms: ['model:update', 'model:show'] },
            { label: t('delete'), key: 'model:delete', perms: ['model:delete'] },
          ],
        },
        {
          label: t('menu.config.block'),
          key: 'block.key',
          perms: ['block:page', 'block:list', 'block:validation'],
          children: [
            { label: t('list'), key: 'block:page' },
            { label: t('add'), key: 'block:create', perms: ['block:create'] },
            { label: t('edit'), key: 'block:update', perms: ['block:update', 'block:show'] },
            { label: t('delete'), key: 'block:delete', perms: ['block:delete'] },
          ],
        },
        {
          label: t('menu.config.dictType'),
          key: 'dictType.key',
          perms: ['dictType:page', 'dictType:list', 'dictType:validation'],
          children: [
            { label: t('list'), key: 'dictType:page' },
            { label: t('add'), key: 'dictType:create', perms: ['dictType:create'] },
            { label: t('edit'), key: 'dictType:update', perms: ['dictType:update', 'dictType:show'] },
            { label: t('delete'), key: 'dictType:delete', perms: ['dictType:delete'] },
          ],
        },
      ],
    },
    {
      label: t('menu.user'),
      key: 'menu.user.key',
      perms: ['menu.user'],
      children: [
        {
          label: t('menu.user.user'),
          key: 'user.key',
          perms: ['user:page', 'user:list', 'group:list', 'org:list'],
          children: [
            { label: t('list'), key: 'user:page' },
            { label: t('add'), key: 'user:create', perms: ['user:create'] },
            { label: t('edit'), key: 'user:update', perms: ['user:update', 'user:show'] },
            { label: t('changePassword'), key: 'user:updatePassword', perms: ['user:updatePassword', 'user:show'] },
            { label: t('updateStatus'), key: 'user:updateStatus', perms: ['user:updateStatus', 'user:show'] },
            { label: t('permissionSettings'), key: 'user:updatePermission', perms: ['user:updatePermission', 'user:show'] },
            { label: t('delete'), key: 'user:delete', perms: ['user:delete'] },
          ],
        },
        {
          label: t('menu.user.role'),
          key: 'role.key',
          perms: ['role:page', 'role:list', 'role:validation', 'channel:list'],
          children: [
            { label: t('list'), key: 'role:page' },
            { label: t('add'), key: 'role:create', perms: ['role:create'] },
            { label: t('edit'), key: 'role:update', perms: ['role:update', 'role:show'] },
            { label: t('permissionSettings'), key: 'role:updatePermission', perms: ['role:updatePermission', 'role:show'] },
            { label: t('delete'), key: 'role:delete', perms: ['role:delete'] },
          ],
        },
        {
          label: t('menu.user.org'),
          key: 'org.key',
          perms: ['org:page', 'org:list'],
          children: [
            { label: t('list'), key: 'org:page' },
            { label: t('add'), key: 'org:create', perms: ['org:create'] },
            { label: t('edit'), key: 'org:update', perms: ['org:update', 'org:show'] },
            { label: t('delete'), key: 'org:delete', perms: ['org:delete'] },
          ],
        },
        {
          label: t('menu.user.group'),
          key: 'group.key',
          perms: ['group:page', 'group:list'],
          children: [
            { label: t('list'), key: 'group:page' },
            { label: t('add'), key: 'group:create', perms: ['group:create'] },
            { label: t('edit'), key: 'group:update', perms: ['group:update', 'group:show'] },
            { label: t('permissionSettings'), key: 'group:updatePermission', perms: ['group:updatePermission', 'group:show'] },
            { label: t('delete'), key: 'group:delete', perms: ['group:delete'] },
          ],
        },
      ],
    },
    {
      label: t('menu.log'),
      key: 'menu.log.key',
      perms: ['menu.log'],
      children: [
        {
          label: t('menu.log.shortMessage'),
          key: 'shortMessage.key',
          perms: ['shortMessage:page', 'shortMessage:list', 'shortMessage:show'],
          children: [
            { label: t('list'), key: 'shortMessage:page' },
            { label: t('delete'), key: 'shortMessage:delete', perms: ['shortMessage:delete'] },
          ],
        },
        {
          label: t('menu.log.loginLog'),
          key: 'loginLog.key',
          perms: ['loginLog:page', 'loginLog:list', 'loginLog:show'],
          children: [
            { label: t('list'), key: 'loginLog:page' },
            { label: t('delete'), key: 'loginLog:delete', perms: ['loginLog:delete'] },
          ],
        },
        {
          label: t('menu.log.operationLog'),
          key: 'operationLog.key',
          perms: ['operationLog:page', 'operationLog:list', 'operationLog:show'],
          children: [
            { label: t('list'), key: 'operationLog:page' },
            { label: t('delete'), key: 'operationLog:delete', perms: ['operationLog:delete'] },
          ],
        },
      ],
    },
    {
      label: t('menu.system'),
      key: 'menu.system.key',
      perms: ['menu.system'],
      children: [
        {
          label: t('menu.system.site'),
          key: 'site.key',
          perms: ['site:page', 'site:list', 'org:list', 'model:list'],
          children: [
            { label: t('list'), key: 'site:page' },
            { label: t('add'), key: 'site:create', perms: ['site:create'] },
            { label: t('edit'), key: 'site:update', perms: ['site:update', 'site:show'] },
            { label: t('delete'), key: 'site:delete', perms: ['site:delete'] },
          ],
        },
        {
          label: t('menu.system.processModel'),
          key: 'processModel.key',
          perms: ['processModel:page', 'processModel:list', 'processDefinition:list', 'dict:list', 'processDefinition:xml'],
          children: [
            { label: t('list'), key: 'processModel:page' },
            { label: t('add'), key: 'processModel:create', perms: ['processModel:create'] },
            { label: t('edit'), key: 'processModel:update', perms: ['processModel:update', 'processModel:show', 'processModel:validate'] },
            { label: t('processModel.op.deploy'), key: 'processModel:deploy', perms: ['processModel:deploy'] },
            { label: t('delete'), key: 'processModel:delete', perms: ['processModel:delete', 'processDefinition:delete'] },
          ],
        },
        {
          label: t('menu.system.processInstance'),
          key: 'processInstance.key',
          perms: ['processInstance:page', 'processInstance:list', 'processInstance:task', 'processHistory:activity', 'dict:list'],
          children: [
            { label: t('list'), key: 'processInstance:page' },
            { label: t('delete'), key: 'processInstance:delete', perms: ['processInstance:delete'] },
          ],
        },
        {
          label: t('menu.system.processHistory'),
          key: 'processHistory.key',
          perms: ['processHistory:page', 'processHistory:list', 'processInstance:task', 'processHistory:activity', 'dict:list'],
          children: [
            { label: t('list'), key: 'processHistory:page' },
            { label: t('delete'), key: 'processHistory:delete', perms: ['processHistory:delete'] },
          ],
        },
        // {
        //   label: t('menu.system.task'),
        //   key: 'task.key',
        //   perms: ['task:page', 'task:list'],
        //   children: [
        //     { label: t('list'), key: 'task:page' },
        //     { label: t('add'), key: 'task:create', perms: ['task:create'] },
        //     { label: t('edit'), key: 'task:update', perms: ['task:update', 'task:show'] },
        //     { label: t('delete'), key: 'task:delete', perms: ['task:delete'] },
        //   ],
        // },
      ],
    },
  ];
  return filterExcludePerms(perms);
}

export function getModelData(): any {
  return {
    article: {
      mains: [
        { code: 'title', must: true, show: true, double: false, required: true },
        { code: 'subtitle', must: false, show: false, double: false, required: false },
        { code: 'fullTitle', must: false, show: false, double: false, required: false },
        { code: 'linkUrl', must: false, show: true, double: false, required: false },
        { code: 'seoKeywords', must: false, show: false, double: false, required: false },
        { code: 'seoDescription', must: false, show: true, double: false, required: false },
        { code: 'author', must: false, show: false, double: true, required: false },
        { code: 'editor', must: false, show: false, double: true, required: false },
        { code: 'image', must: false, show: true, double: false, required: false, type: 'image', imageWidth: 300, imageHeight: 200, imageMode: 'manual' },
        { code: 'file', must: false, show: false, double: false, required: false },
        { code: 'video', must: false, show: false, double: false, required: false },
        { code: 'audio', must: false, show: false, double: false, required: false },
        { code: 'doc', must: false, show: false, double: false, required: false },
        { code: 'imageList', must: false, show: false, double: false, required: false, type: 'imageList', imageListType: 'pictureCard', imageMaxWidth: 1920, imageMaxHeight: 1920 },
        { code: 'fileList', must: false, show: false, double: false, required: false },
        { code: 'text', must: false, show: true, double: false, required: true, type: 'editor', editorType: 1, editorSwitch: true },
      ],
      asides: [
        { code: 'channel', must: true, show: true, required: true },
        { code: 'org', must: false, show: true, required: true },
        { code: 'publishDate', must: true, show: true, required: true },
        // { code: 'offlineDate', must: false, show: true, required: false },
        { code: 'source', must: false, show: true, required: false },
        { code: 'articleTemplate', must: false, show: true, required: false },
        { code: 'allowComment', must: false, show: true, required: true },
        { code: 'user', must: false, show: false, required: true },
        { code: 'created', must: false, show: false, required: true },
        { code: 'modifiedUser', must: false, show: false, required: false },
        { code: 'modified', must: false, show: false, required: false },
      ],
    },
    channel: {
      mains: [
        { code: 'name', must: true, show: true, double: true, required: true },
        { code: 'alias', must: true, show: true, double: true, required: true },
        { code: 'linkUrl', must: true, show: true, double: false, required: true },
        { code: 'seoTitle', must: false, show: true, double: true, required: false },
        { code: 'seoKeywords', must: false, show: true, double: true, required: false },
        { code: 'seoDescription', must: false, show: true, double: false, required: false },
        { code: 'channelTemplate', must: false, show: true, double: true, required: true },
        { code: 'articleTemplate', must: false, show: true, double: true, required: true },
        { code: 'channelModel', must: true, show: true, double: true, required: true },
        { code: 'articleModel', must: true, show: true, double: true, required: true },
        { code: 'nav', must: false, show: true, double: true, required: true },
        { code: 'allowComment', must: false, show: true, double: true, required: true },
        { code: 'allowContribute', must: false, show: true, double: true, required: true },
        { code: 'allowSearch', must: false, show: true, double: true, required: true },
        { code: 'text', must: false, show: false, double: false, required: false },
      ],
      asides: [
        { code: 'parent', must: true, show: true, required: false },
        { code: 'type', must: true, show: true, required: true },
        { code: 'processKey', must: false, show: true, required: false },
        { code: 'pageSize', must: true, show: true, required: true },
      ],
    },
  };
}

export function mergeModelFields(defaultFields: any[], str: string | null | undefined, type: string): any[] {
  const fields = JSON.parse(str || '[]');
  const defaults = defaultFields.map((item: any) => ({ ...item, label: `${type}.${item.code}` }));
  // 去除默认字段中不存在的字段
  fields.filter((field: any) => defaults.findIndex((item) => item.code === field.code) !== -1);
  defaults.forEach((item) => {
    const index = fields.findIndex((it: any) => it.code === item.code);
    if (index !== -1) {
      // 加上缺失属性，覆盖不可改属性
      fields[index] = { ...item, ...fields[index], must: item.must, label: item.label, type: item.type };
    } else {
      // 加上没有的字段
      fields.push(item);
    }
  });
  return fields;
}

export function arr2obj(arr: any[]): Record<string, any> {
  const obj: Record<string, any> = {};
  arr.forEach((item: any) => {
    obj[item.code] = item;
  });
  return obj;
}

export const logModules = [
  'article',
  'channel',
  'blockItem',
  'dict',
  'attachment',
  'fulltext',
  'html',
  'messageBoard',
  'config',
  'siteSettings',
  'model',
  'block',
  'dictType',
  'user',
  'role',
  'org',
  'group',
  'shortMessage',
  'loginLog',
  'operationLog',
  'site',
  'process',
  'task',
  'personal',
];

export const logNames = [
  'article.create',
  'article.update',
  'article.submit',
  'article.pass',
  'article.reject',
  'article.completelyDelete',
  'article.delete',
  'article.sticky',

  'channel.create',
  'channel.update',
  'channel.updateOrder',
  'channel.delete',

  'blockItem.create',
  'blockItem.update',
  'blockItem.updateOrder',
  'blockItem.delete',

  'dict.create',
  'dict.update',
  'dict.updateOrder',
  'dict.delete',

  'attachment.delete',

  'fulltext.reindexAll',
  'fulltext.reindexSite',

  'html.updateAll',
  'html.updateHome',
  'html.updateChannel',
  'html.updateArticle',

  'messageBoard.create',
  'messageBoard.update',
  'messageBoard.updateStatus',
  'messageBoard.delete',

  'config.updateBase',
  'config.updateUpload',
  'config.updateRegister',
  'config.updateSecurity',
  'config.updateSms',
  'config.sendSms',
  'config.updateEmail',
  'config.sendEmail',
  'config.updateUploadStorage',
  'config.updateHtmlStorage',
  'config.updateTemplateStorage',
  'config.updateCustoms',

  'siteSettings.updateBase',
  'siteSettings.updateWatermark',
  'siteSettings.updateMessageBoard',
  'siteSettings.updateCustoms',
  'siteSettings.updateHtml',

  'model.create',
  'model.update',
  'model.updateOrder',
  'model.delete',

  'block.create',
  'block.update',
  'block.updateOrder',
  'block.delete',

  'dictType.create',
  'dictType.update',
  'dictType.updateOrder',
  'dictType.delete',

  'user.create',
  'user.update',
  'user.updatePermission',
  'user.updateStatus',
  'user.updatePassword',
  'user.delete',

  'role.create',
  'role.update',
  'role.updateOrder',
  'role.delete',

  'org.create',
  'org.update',
  'org.updateOrder',
  'org.delete',

  'group.create',
  'group.update',
  'group.updatePermission',
  'group.updateOrder',
  'group.delete',

  'shortMessage.delete',

  'loginLog.delete',

  'operationLog.delete',

  'site.create',
  'site.update',
  'site.updateOrder',
  'site.delete',

  'process.createProcessModel',
  'process.updateProcessModel',
  'process.updateProcessXml',
  'process.deployProcessModel',
  'process.deleteProcessModel',
  'process.deleteProcessDefinition',
  'process.deleteProcessHistory',
  'process.deleteProcessInstance',

  'task.delete',

  'personal.updatePassword',
];
