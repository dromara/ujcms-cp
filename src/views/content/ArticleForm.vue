<template>
  <div>
    <dialog-form
      ref="dialog"
      :name="$t('menu.content.article')"
      :queryBean="queryArticle"
      :createBean="createArticle"
      :updateBean="updateArticle"
      :deleteBean="completelyDeleteArticle"
      :beanId="beanId"
      :beanIds="beanIds"
      :focus="focus"
      :initValues="
        () => ({
          editorType: mains['text'].editorType,
          channelId: channel?.id,
          allowComment: true,
          customs: initCustoms({}),
          fileList: [],
          imageList: [],
        })
      "
      :toValues="(bean) => ({ ...bean })"
      perms="article"
      v-model:values="values"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @finished="$emit('finished')"
      @beanChange="
        (bean) => {
          showSubtitle = !!bean.subtitle;
          showFullTitle = !!bean.fullTitle;
          showLinkUrl = !!bean.linkUrl;
          articleModelId = bean.channel?.articleModelId ?? channel?.articleModelId;
        }
      "
      :addable="!isReview"
      :disableEdit="(bean) => bean.id != null && !bean.editable"
      labelWidth="140px"
      large
    >
      <template #header-action="{ isEdit, bean, unsaved, handleDelete }">
        <el-button-group v-if="isReview">
          <el-popconfirm v-if="isEdit && isReview" @confirm="handleExecute('pass', bean.id)" :title="$t('confirmPass')">
            <template #reference>
              <el-button :disabled="perm('articleReview:pass') || unsaved" type="primary" :icon="CircleCheck">{{ $t('pass') }}</el-button>
            </template>
          </el-popconfirm>
          <el-button :disabled="perm('articleReview:reject') || unsaved" @click="handleExecute('reject', bean.id)" :icon="CircleClose">{{ $t('reject') }}</el-button>
        </el-button-group>
        <el-button-group v-if="!isReview">
          <el-popconfirm v-if="isEdit" @confirm="handleExecute('submit', bean.id)" :title="$t('confirmExecute')">
            <template #reference>
              <el-button :disabled="[0, 12].includes(bean.status) || perm('article:submit') || unsaved" :icon="Finished">{{ $t('article.op.submit') }}</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="isEdit" @confirm="handleExecute('archive', bean.id)" :title="$t('confirmExecute')">
            <template #reference>
              <el-button :disabled="![0].includes(bean.status) || perm('article:archive') || unsaved" :icon="Box">{{ $t('article.op.archive') }}</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="isEdit" @confirm="handleExecute('offline', bean.id)" :title="$t('confirmExecute')">
            <template #reference>
              <el-button :disabled="![0, 1, 5, 11, 12].includes(bean.status) || perm('article:offline') || unsaved" :icon="Hide">{{ $t('article.op.offline') }}</el-button>
            </template>
          </el-popconfirm>
        </el-button-group>
        <el-button-group>
          <el-popconfirm v-if="isEdit && !isReview" @confirm="handleDelete()" :title="$t('confirmDelete')">
            <template #reference>
              <el-button :disabled="perm('article:delete') || unsaved" :icon="DocumentRemove">{{ $t('delete') }}</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="isEdit" :title="$t('confirmCompletelyDelete')" @confirm="handleDelete()">
            <template #reference>
              <el-button :disabled="perm('article:completelyDelete')" :icon="Delete">{{ $t('article.op.completelyDelete') }}</el-button>
            </template>
          </el-popconfirm>
        </el-button-group>
      </template>
      <template #header-status="{ isEdit }">
        <template v-if="isEdit">
          <span v-if="values.status != null">
            <el-tag v-if="values.status === 0" type="success" size="small" disable-transitions>{{ $t(`article.status.${values.status}`) }}</el-tag>
            <el-tag v-else-if="values.status === 1" size="small" disable-transitions>{{ $t(`article.status.${values.status}`) }}</el-tag>
            <el-tag v-else-if="values.status === 20" type="danger" size="small" disable-transitions>{{ $t(`article.status.${values.status}`) }}</el-tag>
            <el-tag v-else-if="[21, 22].includes(values.status)" type="warning" size="small" disable-transitions>{{ $t(`article.status.${values.status}`) }}</el-tag>
            <el-tag v-else type="info" size="small" disable-transitions>{{ $t(`article.status.${values.status}`) }}</el-tag>
          </span>
        </template>
      </template>
      <template #default="{ isEdit, disabled }">
        <el-row>
          <el-col :span="18">
            <el-row>
              <el-col :span="mains['title'].double ? 12 : 24">
                <el-form-item prop="title" :label="mains['title'].name ?? $t('article.title')" :rules="{ required: true, message: () => $t('v.required') }">
                  <el-input v-model="values.title" ref="focus" maxlength="150">
                    <template
                      #append
                      v-if="
                        (!mains['subtitle'].required || !mains['fullTitle'].required || !mains['linkUrl'].required) &&
                        (mains['subtitle'].show || mains['fullTitle'].show || mains['linkUrl'].show)
                      "
                    >
                      <el-button
                        v-if="mains['subtitle'].show && !mains['subtitle'].required"
                        :class="showSubtitle ? 'text-primary' : undefined"
                        @click="
                          showSubtitle = !showSubtitle;
                          values.subtitle = undefined;
                        "
                        >{{ mains['subtitle'].name ?? $t('article.subtitle') }}
                      </el-button>
                      <el-button
                        v-if="mains['fullTitle'].show && !mains['fullTitle'].required"
                        :class="showFullTitle ? 'text-primary' : undefined"
                        @click="
                          showFullTitle = !showFullTitle;
                          values.fullTitle = undefined;
                        "
                        >{{ mains['fullTitle'].name ?? $t('article.fullTitle') }}
                      </el-button>
                      <el-button
                        v-if="mains['linkUrl'].show && !mains['linkUrl'].required"
                        :class="showLinkUrl ? 'text-primary' : undefined"
                        @click="
                          showLinkUrl = !showLinkUrl;
                          values.linkUrl = undefined;
                          values.targetBlank = false;
                        "
                        >{{ mains['linkUrl'].name ?? $t('article.linkUrl') }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                :span="mains['subtitle'].double ? 12 : 24"
                v-if="((values.subtitle || showSubtitle) && mains['subtitle'].show) || (mains['subtitle'].show && mains['subtitle'].required)"
              >
                <el-form-item
                  prop="subtitle"
                  :label="mains['subtitle'].name ?? $t('article.subtitle')"
                  :rules="mains['subtitle'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.subtitle" maxlength="150"></el-input>
                </el-form-item>
              </el-col>
              <el-col
                :span="mains['fullTitle'].double ? 12 : 24"
                v-if="((values.fullTitle || showFullTitle) && mains['fullTitle'].show) || (mains['fullTitle'].show && mains['fullTitle'].required)"
              >
                <el-form-item
                  prop="fullTitle"
                  :label="mains['fullTitle'].name ?? $t('article.fullTitle')"
                  :rules="mains['fullTitle'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.fullTitle" type="textarea" :rows="2" maxlength="150"></el-input>
                </el-form-item>
              </el-col>
              <el-col
                :span="mains['linkUrl'].double ? 12 : 24"
                v-if="((values.linkUrl || showLinkUrl) && mains['linkUrl'].show) || (mains['linkUrl'].show && mains['linkUrl'].required)"
              >
                <el-form-item
                  prop="linkUrl"
                  :label="mains['linkUrl'].name ?? $t('article.linkUrl')"
                  :rules="
                    mains['linkUrl'].required
                      ? [
                          { required: true, message: () => $t('v.required') },
                          { pattern: /^(http|\/).*$/, message: () => $t('article.error.linkUrl') },
                        ]
                      : { pattern: /^(http|\/).*$/, message: () => $t('article.error.linkUrl') }
                  "
                >
                  <el-input v-model="values.linkUrl" maxlength="255">
                    <template #append>
                      <el-checkbox v-model="values.targetBlank">{{ $t('article.targetBlank') }}</el-checkbox>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['seoKeywords'].double ? 12 : 24" v-if="mains['seoKeywords'].show">
                <el-form-item
                  prop="seoKeywords"
                  :label="mains['seoKeywords'].name ?? $t('article.seoKeywords')"
                  :rules="mains['seoKeywords'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.seoKeywords" maxlength="150"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['seoDescription'].double ? 12 : 24" v-if="mains['seoDescription'].show">
                <el-form-item
                  prop="seoDescription"
                  :label="mains['seoDescription'].name ?? $t('article.seoDescription')"
                  :rules="mains['seoDescription'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input type="textarea" v-model="values.seoDescription" :rows="3" maxlength="1000"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['author'].double ? 12 : 24" v-if="mains['author'].show">
                <el-form-item
                  prop="author"
                  :label="mains['author'].name ?? $t('article.author')"
                  :rules="mains['author'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.author" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['editor'].double ? 12 : 24" v-if="mains['editor'].show">
                <el-form-item
                  prop="editor"
                  :label="mains['editor'].name ?? $t('article.editor')"
                  :rules="mains['editor'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-input v-model="values.editor" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="mains['image'].double ? 12 : 24" v-if="mains['image'].show">
                <el-form-item
                  prop="image"
                  :label="mains['image'].name ?? $t('article.image')"
                  :rules="mains['image'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <image-upload
                    v-model="values.image"
                    :height="mains['image'].imageHeight"
                    :width="mains['image'].imageWidth"
                    :mode="mains['image'].imageMode"
                    :disabled="disabled"
                  ></image-upload>
                  <el-button class="ml-2 self-start" @click="extractImage()">{{ $t('article.extractImage') }}</el-button>
                </el-form-item>
              </el-col>
              <template v-for="field in fields" :key="field.code">
                <el-col :span="field.double ? 12 : 24">
                  <el-form-item :prop="`customs.${field.code}`" :rules="field.required ? { required: true, message: () => $t('v.required') } : undefined">
                    <template #label><label-tip :label="field.name" /></template>
                    <field-item :field="field" v-model="values.customs[field.code]" v-model:model-key="values.customs[field.code + '_key']"></field-item>
                  </el-form-item>
                </el-col>
              </template>
              <el-col :span="mains['file'].double ? 12 : 24" v-if="mains['file'].show">
                <el-form-item
                  prop="file"
                  :label="mains['file'].name ?? $t('article.file')"
                  :rules="mains['file'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-row class="w-full">
                    <el-col :span="16">
                      <el-input v-model="values.fileName">
                        <template #prepend>{{ $t('name') }}</template>
                      </el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input v-model="values.fileLength">
                        <template #prepend>{{ $t('size') }}</template>
                        <template #append>Byte</template>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-input v-model="values.file">
                    <template #prepend>URL</template>
                  </el-input>
                  <base-upload
                    type="file"
                    :on-success="(res: any) => ((values.file = res.url), (values.fileName = res.name), (values.fileLength = res.size))"
                    :disabled="disabled"
                  ></base-upload>
                </el-form-item>
              </el-col>
              <el-col :span="mains['video'].double ? 12 : 24" v-if="mains['video'].show">
                <el-form-item
                  prop="video"
                  :label="mains['video'].name ?? $t('article.video')"
                  :rules="mains['video'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-row class="w-full">
                    <el-col :span="16">
                      <el-input v-model="values.video" maxlength="255">
                        <template #prepend>URL</template>
                      </el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input v-model="values.videoDuration" maxlength="10">
                        <template #prepend>{{ $t('article.videoDuration') }}</template>
                        <template #append> {{ formatDuration(values.videoDuration) }}</template>
                      </el-input>
                    </el-col>
                  </el-row>
                  <base-upload
                    type="video"
                    :on-success="
                      (res) => {
                        values.video = res.url;
                        values.videoDuration = res.duration;
                        if (!values.image) {
                          values.image = res.image;
                        }
                      }
                    "
                    :disabled="disabled"
                  ></base-upload>
                </el-form-item>
              </el-col>
              <el-col :span="mains['audio'].double ? 12 : 24" v-if="mains['audio'].show">
                <el-form-item
                  prop="audio"
                  :label="mains['audio'].name ?? $t('article.audio')"
                  :rules="mains['audio'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <el-row class="w-full">
                    <el-col :span="16">
                      <el-input v-model="values.audio" maxlength="255">
                        <template #prepend>URL</template>
                      </el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input v-model="values.audioDuration" maxlength="10">
                        <template #prepend>{{ $t('article.audioDuration') }}</template>
                        <template #append> {{ formatDuration(values.audioDuration) }}</template>
                      </el-input>
                    </el-col>
                  </el-row>
                  <base-upload
                    type="audio"
                    :on-success="
                      (res) => {
                        values.audio = res.url;
                        values.audioDuration = res.duration;
                      }
                    "
                    :disabled="disabled"
                  ></base-upload>
                </el-form-item>
              </el-col>
              <el-col :span="mains['doc'].double ? 12 : 24" v-if="mains['doc'].show">
                <el-form-item
                  prop="doc"
                  :label="mains['doc'].name ?? $t('article.doc')"
                  :rules="mains['doc'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <div class="w-full">
                    <el-row>
                      <el-col :span="12">
                        <el-input v-model="values.docName">
                          <template #prepend>{{ $t('name') }}</template>
                        </el-input>
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model="values.docLength">
                          <template #prepend>{{ $t('size') }}</template>
                          <template #append>Byte</template>
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-input v-model="values.doc">
                      <template #prepend>URL</template>
                    </el-input>
                    <el-input v-model="values.docOrig">
                      <template #prepend>{{ $t('article.docOrig') }}</template>
                    </el-input>
                    <base-upload
                      v-if="jodconverterEnabled && currentUser.epRank > 0"
                      type="library"
                      :disabled="perm('jodConvert:library') || disabled"
                      :upload-action="jodConvertLibraryUrl"
                      :on-success="
                      (res: any) => {
                        values.doc = res.doc;
                        values.docOrig = res.docOrig;
                        values.docName = res.docName;
                        values.docLength = res.docLength;
                        values.image = res.docImage;
                      }
                    "
                    ></base-upload>
                    <el-alert v-if="!jodconverterEnabled && currentUser.epRank > 0" :title="$t('error.jodConverterNotEnabled')" type="error" :closable="false" />
                    <el-button v-if="currentUser.epRank === 0" type="primary" @click="$alert($t('error.enterprise'), { dangerouslyUseHTMLString: true })">
                      {{ $t('article.op.clickToUpload') }}
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="mains['imageList'].double ? 12 : 24" v-if="mains['imageList'].show">
                <el-form-item
                  prop="imageList"
                  :label="mains['imageList'].name ?? $t('article.imageList')"
                  :rules="mains['imageList'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <image-list-upload
                    v-model="values.imageList"
                    :maxHeight="mains['imageList'].imageMaxHeight"
                    :maxWidth="mains['imageList'].imageMaxWidth"
                    :listType="mains['imageList'].imageListType"
                    :disabled="disabled"
                  ></image-list-upload>
                </el-form-item>
              </el-col>
              <el-col :span="mains['fileList'].double ? 12 : 24" v-if="mains['fileList'].show">
                <el-form-item
                  prop="fileList"
                  :label="mains['fileList'].name ?? $t('article.fileList')"
                  :rules="mains['fileList'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <file-list-upload v-model="values.fileList" :disabled="disabled"></file-list-upload>
                </el-form-item>
              </el-col>
              <el-col :span="mains['text'].double ? 12 : 24" v-if="mains['text'].show">
                <el-form-item
                  prop="text"
                  :label="mains['text'].name ?? $t('article.text')"
                  :rules="mains['text'].required ? { required: true, message: () => $t('v.required') } : undefined"
                >
                  <div class="w-full">
                    <el-radio-group v-if="mains['text'].editorSwitch" v-model="values.editorType" @change="values.markdown = ''" class="mr-6">
                      <el-radio v-for="n in [1, 2]" :label="n">{{ $t(`model.field.editorType.${n}`) }}</el-radio>
                    </el-radio-group>
                    <div v-if="values.editorType === 1 && jodconverterEnabled && currentUser.epRank > 0" class="inline-flex mb-1">
                      <base-upload
                        type="doc"
                        :disabled="perm('jodConvert:doc')"
                        :upload-action="jodConvertDocUrl"
                        :on-success="(res: string) => (values.text = res)"
                        :button="$t('article.op.docImport')"
                      ></base-upload>
                    </div>
                    <div v-if="currentUser.epRank === 0 && currentUser.epDisplay" class="inline-flex mb-1">
                      <el-button type="primary" @click="$alert($t('error.enterprise'), { dangerouslyUseHTMLString: true })">{{ $t('article.op.docImport') }}</el-button>
                    </div>
                    <tui-editor v-if="values.editorType === 2" v-model="values.markdown" v-model:html="values.text" class="leading-6" />
                    <tinymce v-else v-model="values.text" :disabled="disabled" />
                  </div>
                </el-form-item>
              </el-col>
              <template v-for="field in editorFields" :key="field.code">
                <el-col :span="field.double ? 12 : 24">
                  <el-form-item :prop="`customs.${field.code}`" :label="field.name" :rules="field.required ? { required: true, message: () => $t('v.required') } : undefined">
                    <template #label><label-tip :label="field.name" /></template>
                    <field-item :field="field" v-model="values.customs[field.code]"></field-item>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-col>
          <el-col :span="6" class="el-form--label-top label-top">
            <el-tabs type="border-card" class="ml-5">
              <el-tab-pane :label="$t('article.tabs.setting')">
                <el-form-item prop="channelId" :label="asides['channel'].name ?? $t('article.channel')" :rules="[{ required: true, message: () => $t('v.required') }]">
                  <el-tree-select
                    v-model="values.channelId"
                    :data="channelList"
                    node-key="id"
                    :props="{ label: 'name' }"
                    :render-after-expand="false"
                    class="w-full"
                    @change="
                    (value: any) => {
                      articleModelId = flatChannelList.find((item) => item.id === value)?.articleModelId;
                      nextTick().then(() => {
                        initCustoms(values.customs);
                      });
                    }
                  "
                  />
                </el-form-item>
                <el-form-item :label="asides['org'].name ?? $t('article.org')" v-if="isEdit && asides['org'].show" required>
                  <el-input :value="values.org?.name" disabled></el-input>
                </el-form-item>
                <el-form-item
                  prop="publishDate"
                  :label="asides['publishDate'].name ?? $t('article.publishDate')"
                  :rules="isEdit ? { required: true, message: () => $t('v.required') } : undefined"
                  v-if="asides['publishDate'].show"
                >
                  <el-date-picker
                    v-model="values.publishDate"
                    @change="
                      (value: any) => {
                        // 清空日期值后，value会变成null，导致后台校验失败
                        if (value === null) values.publishDate = undefined;
                      }
                    "
                    type="datetime"
                    class="w-full"
                  ></el-date-picker>
                </el-form-item>
                <!--
                <el-form-item
                  prop="offlineDate"
                  :label="asides['offlineDate'].name ?? $t('article.offlineDate')"
                  :rules="asides['offlineDate'].required ? { required: true, message: () => $t('v.required') } : undefined"
                  v-if="asides['offlineDate'].show"
                >
                  <el-date-picker v-model="values.offlineDate" type="datetime" class="w-full"></el-date-picker>
                </el-form-item>
                 -->
                <el-form-item
                  prop="source"
                  :label="asides['source'].name ?? $t('article.source')"
                  :rules="asides['source'].required ? { required: true, message: () => $t('v.required') } : undefined"
                  v-if="asides['source'].show"
                >
                  <el-autocomplete
                    v-model="values.source"
                    value-key="name"
                    :fetch-suggestions="async (query:string, callback:any) => callback(await fetchSourceList(query))"
                    class="w-full"
                    @keydown.enter.prevent
                    highlight-first-item
                    hide-loading
                    clearable
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item
                  prop="articleTemplate"
                  :label="asides['articleTemplate'].name ?? $t('article.articleTemplate')"
                  :rules="asides['articleTemplate'].required ? { required: true, message: () => $t('v.required') } : undefined"
                  v-if="asides['articleTemplate'].show"
                >
                  <template #label><label-tip :label="asides['articleTemplate'].name ?? $t('article.articleTemplate')" message="article.articleTemplate" help /></template>
                  <el-select v-model="values.articleTemplate" class="w-full">
                    <el-option v-for="item in articleTemplates" :key="item" :label="item + '.html'" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="allowComment"
                  :rules="asides['allowComment'].required ? { required: true, message: () => $t('v.required') } : undefined"
                  v-if="asides['allowComment'].show"
                >
                  <template #label><label-tip :label="asides['allowComment'].name ?? $t('article.allowComment')" message="article.allowComment" help /></template>
                  <el-switch v-model="values.allowComment"></el-switch>
                </el-form-item>
                <el-form-item :label="asides['user'].name ?? $t('article.user')" v-if="asides['user'].show">
                  <el-input :model-value="values.user?.username" disabled></el-input>
                </el-form-item>
                <el-form-item :label="asides['created'].name ?? $t('article.created')" v-if="asides['created'].show">
                  <el-date-picker :model-value="values.created" type="datetime" class="w-full" disabled></el-date-picker>
                </el-form-item>
                <el-form-item :label="asides['modifiedUser'].name ?? $t('article.modifiedUser')" v-if="asides['modifiedUser'].show">
                  <el-input :model-value="values.modifiedUser?.username" disabled></el-input>
                </el-form-item>
                <el-form-item :label="asides['modified'].name ?? $t('article.modified')" v-if="asides['modified'].show">
                  <el-date-picker :model-value="values.modified" type="datetime" class="w-full" disabled></el-date-picker>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </template>
      <template #footer-action="{ isEdit, handleSubmit }">
        <el-button :disabled="perm(isEdit ? 'article:update' : 'article:create')" @click.prevent="handleSubmit()" type="primary" native-type="submit">
          {{ $t(isEdit ? 'save' : 'submit') }}
        </el-button>
        <el-button v-if="!isEdit" @click="handleSaveAsDraft()">{{ $t('article.op.saveAsDraft') }}</el-button>
      </template>
    </dialog-form>
    <image-extractor v-model="imageExtractorVisible" :urls="imageExtractorUrls" :append-to-body="true" @finished="(urls) => (values.image = urls[0])" />
  </div>
</template>

<script lang="ts">
export default { name: 'ArticleForm' };
</script>

<script setup lang="ts">
import { computed, ref, toRefs, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Finished, Box, Hide, DocumentRemove, Delete, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import * as htmlparser2 from 'htmlparser2';
import * as domutils from 'domutils';
import { baseSettings } from '@/store/useConfig';
import { perm, currentUser } from '@/store/useCurrentUser';
import {
  queryArticle,
  createArticle,
  updateArticle,
  submitArticle,
  archiveArticle,
  offlineArticle,
  deleteArticle,
  completelyDeleteArticle,
  passArticle,
  rejectArticle,
  queryChannelList,
  queryArticleTemplates,
} from '@/api/content';
import { queryModelList } from '@/api/config';
import { jodConvertDocUrl, jodConvertLibraryUrl, queryjodConvertEnabled, queryDictListByAlias } from '@/api/content';
import { toTree } from '@/utils/tree';
import { formatDuration } from '@/utils/common';
import { getModelData, mergeModelFields, arr2obj } from '@/data';
import FieldItem from '@/views/config/components/FieldItem.vue';
import DialogForm from '@/components/DialogForm.vue';
import Tinymce from '@/components/Tinymce';
import { TuiEditor } from '@/components/TuiEditor';
import LabelTip from '@/components/LabelTip.vue';
import { BaseUpload, ImageUpload, ImageListUpload, FileListUpload } from '@/components/Upload';
import ImageExtractor from './components/ImageExtractor.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  beanId: { required: true },
  beanIds: { type: Array, required: true },
  channel: null,
  isReview: { type: Boolean, default: false },
});
defineEmits({ 'update:modelValue': null, finished: null });

const { modelValue: visible, channel } = toRefs(props);
const { t } = useI18n();
const dialog = ref<any>();
const showSubtitle = ref<boolean>(false);
const showFullTitle = ref<boolean>(false);
const showLinkUrl = ref<boolean>(false);
const focus = ref<any>();
const values = ref<any>({});
const jodconverterEnabled = ref<boolean>(false);
const channelList = ref<any[]>([]);
const flatChannelList = ref<any[]>([]);
const articleModelList = ref<any[]>([]);
const articleTemplates = ref<any[]>([]);
const articleModelId = ref<number>();
const articleModel = computed(() => articleModelList.value.find((item) => item.id === articleModelId.value));
const mains = computed(() => arr2obj(mergeModelFields(getModelData().article.mains, articleModel.value?.mains, 'article')));
const asides = computed(() => arr2obj(mergeModelFields(getModelData().article.asides, articleModel.value?.asides, 'article')));
const fields = computed(() => JSON.parse(articleModel.value?.customs || '[]').filter((item: any) => item.type !== 'tinyEditor'));
const editorFields = computed(() => JSON.parse(articleModel.value?.customs || '[]').filter((item: any) => item.type === 'tinyEditor'));

watch(visible, () => {
  if (visible.value) {
    articleModelId.value = channel?.value?.articleModelId;
    fetchChannelList();
    fetchArticleModeList();
    fetchArticleTemplates();
    fetchJodconverterEnabled();
  }
});
const fetchJodconverterEnabled = async () => {
  if (currentUser.epRank > 0) {
    jodconverterEnabled.value = await queryjodConvertEnabled();
  }
};
const fetchSourceList = (name: string) => queryDictListByAlias('sys_article_source', name);
const fetchChannelList = async () => {
  flatChannelList.value = await queryChannelList({ isArticlePermission: true });
  channelList.value = toTree(flatChannelList.value);
};
const fetchArticleModeList = async () => {
  articleModelList.value = await queryModelList({ type: 'article' });
  // 如果 articleModelId 无值，则默认赋予第一个模型的值
  if (articleModelId.value == null && articleModelList.value.length > 0) {
    articleModelId.value = articleModelList.value[0].id;
  }
};
const fetchArticleTemplates = async () => {
  articleTemplates.value = await queryArticleTemplates();
};
const initCustoms = (customs: any) => {
  fields.value.forEach((field: any) => {
    if (customs[field.code] == null) {
      customs[field.code] = field.defaultValue;
      if (field.defaultValueKey != null) {
        customs[field.code + '_key'] = field.defaultValueKey;
      }
    }
  });
  return customs;
};

const handleSaveAsDraft = () => {
  dialog.value.submit(async (values: any, { focus, emit, props, form }: { focus: any; emit: any; props: any; form: any }) => {
    // 草稿
    values.status = 10;
    await createArticle(values);
    focus?.focus?.();
    emit('update:values', props.initValues(values.value));
    form.resetFields();
    ElMessage.success(t('success'));
  });
};

const handleExecute = async (action: string, id: number) => {
  if (['pass', 'reject'].includes(action)) {
    dialog.value.remove(async (values: any) => {
      if (action === 'pass') {
        await passArticle([id]);
      } else if (action === 'reject') {
        const { value } = await ElMessageBox.prompt(t('article.rejectReason'), t('reject'), {
          confirmButtonText: t('submit'),
          cancelButtonText: t('cancel'),
          inputPattern: /\S+/,
          inputErrorMessage: t('v.required'),
        });
        await rejectArticle([id], value);
      }
    });
    return;
  }

  dialog.value.submit(async (values: any, { loadBean }: { loadBean: () => Promise<any> }) => {
    if (action === 'delete') {
      await deleteArticle([id]);
    } else if (action === 'submit') {
      await submitArticle([id]);
    } else if (action === 'archive') {
      await archiveArticle([id]);
    } else if (action === 'offline') {
      await offlineArticle([id]);
    } else {
      throw new Error(`not support action: ${action}`);
    }
    loadBean();
  });
};

const imageExtractorVisible = ref<boolean>(false);
const imageExtractorUrls = ref<string[]>([]);
const extractImage = () => {
  imageExtractorVisible.value = true;
  const dom = htmlparser2.parseDocument(values.value.text);
  const imgs = domutils.getElementsByTagName('img', dom);
  const urls = imgs.map((img: any) => domutils.getAttributeValue(img, 'src')).filter((src: string | undefined) => src?.startsWith(baseSettings.uploadUrlPrefix)) as string[];
  imageExtractorUrls.value = [...(values.value.imageList?.map((img: any) => img.url) ?? []), ...urls];
};
</script>

<style lang="scss" scoped>
.label-top {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
  :deep(.el-form-item__label) {
    margin-bottom: 4px;
    width: 100% !important;
  }
}
</style>
