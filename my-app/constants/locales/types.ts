// 翻译键类型（所有可翻译文本的 key）
export type TranslationKeys =
  | 'appName'
  | 'home'
  | 'hall'
  | 'profile'
  | 'order'
  | 'accept'
  | 'success'
  | 'fail'
  | 'language'
  | 'chinese'
  | 'english'
  | 'confirm'
  | 'cancel'
  | 'saveAndBack'
  | 'settings'

// 翻译资源结构
export interface TranslationResource {
  [key in TranslationKeys]: string
}
