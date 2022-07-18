import { reactive, readonly } from 'vue';
import { queryConfig } from '@/api/login';

export interface UploadSettings {
  imageTypes: string;
  imageInputAccept: string;
  videoInputAccept: string;
  audioInputAccept: string;
  libraryInputAccept: string;
  docInputAccept: string;
  fileInputAccept: string;
  imageLimitByte: number;
  videoLimitByte: number;
  audioLimitByte: number;
  libraryLimitByte: number;
  docLimitByte: number;
  fileLimitByte: number;
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordMaxLength: number;
  passwordStrength: number;
}

export interface Config {
  upload: UploadSettings;
  security: SecuritySettings;
}

const state = reactive<Config>({
  upload: {
    imageTypes: 'jpg,jpeg,png,gif',
    imageInputAccept: '.jpg,.jpeg,.png,.gif',
    videoInputAccept: '.mp4,.m3u8',
    audioInputAccept: '.mp3,.ogg,.wav',
    libraryInputAccept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
    docInputAccept: '.doc,.docx,.xls,.xlsx',
    fileInputAccept: '.zip,.7z,.gz,.bz2,.iso,.rar,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.m3u8,.mp3,.ogg',
    imageLimitByte: 0,
    videoLimitByte: 0,
    audioLimitByte: 0,
    libraryLimitByte: 0,
    docLimitByte: 0,
    fileLimitByte: 0,
  },
  security: {
    passwordMinLength: 0,
    passwordMaxLength: 64,
    passwordStrength: 0,
  },
});
export const uploadSettings = readonly(state).upload;
export const securitySettings = readonly(state).security;
export const initConfig = async () => {
  const config = await queryConfig();
  Object.assign(state.upload, config.upload);
  Object.assign(state.security, config.security);
};
// 初始化
initConfig();
