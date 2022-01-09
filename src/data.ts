import i18n from '@/i18n';

export function getPermsTreeData(): any[] {
  const {
    global: { t },
  } = i18n;
  return [
    {
      label: t('menu.home'),
      key: 'home',
      perms: ['auth'],
      children: [
        {
          label: t('menu.personal'),
          key: 'personal',
          children: [
            {
              label: t('menu.personal.password'),
              key: 'password:update',
              perms: ['password:update'],
            },
          ],
        },
        {
          label: t('menu.content'),
          key: 'content',
          children: [
            {
              label: t('menu.content.article'),
              key: 'article:page',
              perms: ['article:page', 'article:list', 'channel:list', 'dict:list', 'model:list'],
              children: [
                { label: t('list'), key: 'article:page' },
                { label: t('add'), key: 'article:create', perms: ['article:create'] },
                { label: t('edit'), key: 'article:update', perms: ['article:update', 'article:show'] },
                { label: t('delete'), key: 'article:delete', perms: ['article:delete'] },
              ],
            },
            {
              label: t('menu.content.channel'),
              key: 'channel:page',
              perms: ['channel:page', 'channel:list'],
              children: [
                { label: t('list'), key: 'channel:page' },
                { label: t('add'), key: 'channel:create', perms: ['channel:create'] },
                { label: t('edit'), key: 'channel:update', perms: ['channel:update', 'channel:show'] },
                { label: t('delete'), key: 'channel:delete', perms: ['channel:delete'] },
              ],
            },
            {
              label: t('menu.content.blockItem'),
              key: 'blockItem:page',
              perms: ['blockItem:page', 'blockItem:list', 'block:list'],
              children: [
                { label: t('list'), key: 'blockItem:page' },
                { label: t('add'), key: 'blockItem:create', perms: ['blockItem:create'] },
                { label: t('edit'), key: 'blockItem:update', perms: ['blockItem:update', 'blockItem:show'] },
                { label: t('delete'), key: 'blockItem:delete', perms: ['blockItem:delete'] },
              ],
            },
            {
              label: t('menu.content.attachment'),
              key: 'attachment:page',
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
              key: 'generator:show',
              perms: ['generator:show'],
              children: [
                { label: t('generator.op.reindexAll'), key: 'generator:fulltext:reindexAll', perms: ['generator:fulltext:reindexAll'] },
                { label: t('generator.op.reindexSite'), key: 'generator:fulltext:reindexSite', perms: ['generator:fulltext:reindexSite'] },
              ],
            },
          ],
        },
        {
          label: t('menu.config'),
          key: 'config',
          children: [
            { label: t('menu.config.globalSettings'), key: 'globalSettings:show', perms: ['globalSettings:show', 'globalSettings:update'] },
            { label: t('menu.config.siteSettings'), key: 'siteSettings:show', perms: ['siteSettings:show', 'siteSettings:update'] },
            {
              label: t('menu.config.model'),
              key: 'model:page',
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
              key: 'block:page',
              perms: ['block:page', 'block:list'],
              children: [
                { label: t('list'), key: 'block:page' },
                { label: t('add'), key: 'block:create', perms: ['block:create'] },
                { label: t('edit'), key: 'block:update', perms: ['block:update', 'block:show'] },
                { label: t('delete'), key: 'block:delete', perms: ['block:delete'] },
              ],
            },
            {
              label: t('menu.config.dictType'),
              key: 'dictType:page',
              perms: ['dictType:page', 'dictType:list'],
              children: [
                { label: t('list'), key: 'dictType:page' },
                { label: t('add'), key: 'dictType:create', perms: ['dictType:create'] },
                { label: t('edit'), key: 'dictType:update', perms: ['dictType:update', 'dictType:show'] },
                { label: t('delete'), key: 'dictType:delete', perms: ['dictType:delete'] },
              ],
            },
            {
              label: t('menu.config.dict'),
              key: 'dict:page',
              perms: ['dict:page', 'dict:list', 'dictType:list'],
              children: [
                { label: t('list'), key: 'dict:page' },
                { label: t('add'), key: 'dict:create', perms: ['dict:create'] },
                { label: t('edit'), key: 'dict:update', perms: ['dict:update', 'dict:show'] },
                { label: t('delete'), key: 'dict:delete', perms: ['dict:delete'] },
              ],
            },
          ],
        },
        {
          label: t('menu.user'),
          key: 'user',
          children: [
            {
              label: t('menu.user.user'),
              key: 'user:page',
              perms: ['user:page', 'user:list', 'group:list', 'org:list'],
              children: [
                { label: t('list'), key: 'user:page' },
                { label: t('add'), key: 'user:create', perms: ['user:create'] },
                { label: t('edit'), key: 'user:update', perms: ['user:update', 'user:show'] },
                { label: t('delete'), key: 'user:delete', perms: ['user:delete'] },
              ],
            },
            {
              label: t('menu.user.role'),
              key: 'role:page',
              perms: ['role:page', 'role:list'],
              children: [
                { label: t('list'), key: 'role:page' },
                { label: t('add'), key: 'role:create', perms: ['role:create'] },
                { label: t('edit'), key: 'role:update', perms: ['role:update', 'role:show'] },
                { label: t('delete'), key: 'role:delete', perms: ['role:delete'] },
              ],
            },
            {
              label: t('menu.user.group'),
              key: 'group:page',
              perms: ['group:page', 'group:list'],
              children: [
                { label: t('list'), key: 'group:page' },
                { label: t('add'), key: 'group:create', perms: ['group:create'] },
                { label: t('edit'), key: 'group:update', perms: ['group:update', 'group:show'] },
                { label: t('delete'), key: 'group:delete', perms: ['group:delete'] },
              ],
            },
            {
//               label: t('menu.user.org'),
              key: 'org:page',
              perms: ['org:page', 'org:list'],
              children: [
                { label: t('list'), key: 'org:page' },
                { label: t('add'), key: 'org:create', perms: ['org:create'] },
                { label: t('edit'), key: 'org:update', perms: ['org:update', 'org:show'] },
                { label: t('delete'), key: 'org:delete', perms: ['org:delete'] },
              ],
            },
          ],
        },
        {
          label: t('menu.system'),
          key: 'system',
          children: [
            {
//               label: t('menu.system.site'),
              key: 'site:page',
              perms: ['site:page', 'site:list', 'org:list', 'model:list', 'storage:list'],
              children: [
                { label: t('list'), key: 'site:page' },
                { label: t('add'), key: 'site:create', perms: ['site:create'] },
                { label: t('edit'), key: 'site:update', perms: ['site:update', 'site:show'] },
                { label: t('delete'), key: 'site:delete', perms: ['site:delete'] },
              ],
            },
            {
              label: t('menu.system.storage'),
              key: 'storage:page',
              perms: ['storage:page', 'storage:list'],
              children: [
                { label: t('list'), key: 'storage:page' },
                { label: t('add'), key: 'storage:create', perms: ['storage:create'] },
                { label: t('edit'), key: 'storage:update', perms: ['storage:update', 'storage:show'] },
                { label: t('delete'), key: 'storage:delete', perms: ['storage:delete'] },
              ],
            },
          ],
        },
      ],
    },
  ];
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
        { code: 'doc', must: false, show: false, double: false, required: false },
        { code: 'imageList', must: false, show: false, double: false, required: false, type: 'imageList', imageMaxWidth: 1920, imageMaxHeight: 1920 },
        { code: 'fileList', must: false, show: false, double: false, required: false },
        { code: 'text', must: false, show: true, double: false, required: true },
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
        { code: 'group', must: false, show: true, double: false, required: true },
        { code: 'nav', must: false, show: true, double: true, required: true },
        { code: 'allowComment', must: false, show: true, double: true, required: true },
        { code: 'allowContribute', must: false, show: true, double: true, required: true },
        { code: 'allowSearch', must: false, show: true, double: true, required: true },
        { code: 'text', must: false, show: false, double: false, required: false },
      ],
      asides: [
        { code: 'type', must: true, show: true, required: true },
        { code: 'parent', must: true, show: true, required: false },
        { code: 'pageSize', must: true, show: true, required: true },
      ],
    },
  };
}

export function mergeModelFields(defaultFields: any[], s: string | null | undefined, type: string): any[] {
  const fields = JSON.parse(s || '[]');
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

export function arr2obj(arr: any[]) {
  const obj: Record<string, any> = {};
  arr.forEach((item: any) => {
    obj[item.code] = item;
  });
  return obj;
}
