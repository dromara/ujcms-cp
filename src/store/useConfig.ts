import { reactive, readonly } from 'vue';
import { queryConfig } from '@/api/config';

export interface UploadSettings {
  imageTypes: string;
  imageInputAccept: string;
  videoInputAccept: string;
  libraryInputAccept: string;
  docInputAccept: string;
  fileInputAccept: string;
  imageLimitByte: number;
  videoLimitByte: number;
  libraryLimitByte: number;
  docLimitByte: number;
  fileLimitByte: number;
}

export interface Config {
  upload: UploadSettings;
}

const state = reactive<Config>({
  upload: {
    imageTypes: 'jpg,jpeg,png,gif',
    imageInputAccept: '.jpg,.jpeg,.png,.gif',
    videoInputAccept: '.mp4,.m3u8',
    libraryInputAccept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
    docInputAccept: '.doc,.docx,.xls,.xlsx',
    fileInputAccept: '.zip,.7z,.gz,.bz2,.iso,.rar,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.m3u8,.mp3,.ogg',
    imageLimitByte: 0,
    videoLimitByte: 0,
    libraryLimitByte: 0,
    docLimitByte: 0,
    fileLimitByte: 0,
  },
});
export const uploadSettings = readonly(state).upload;
export const init = async () => {
  const config = await queryConfig();
  Object.assign(state.upload, config.upload);
};
// 初始化
init();
