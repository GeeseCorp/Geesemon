import { GuidLength } from './guidUtils';

export enum FileType {
  File = 'File',
  Image = 'Image',
  Video = 'Video',
}
export const getFileType = (fileUrl: string): FileType => {
  const fileExtension = fileUrl.split('.').pop();
  switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
    case 'png':
    case 'svg':
    case 'webp':
      return FileType.Image;
    case 'mp4':
      return FileType.Video;
    default:
      return FileType.File;
  }
};

export const downloadFile = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const aTag = document.createElement('a');
  aTag.href = objectUrl;
  aTag.download = getFileName(url);
  document.body.appendChild(aTag);
  aTag.click();
  URL.revokeObjectURL(objectUrl);
  aTag.remove();
};

export const getFileName = (url: string): string =>
  url.replace(/^.*[\\\/]/, '').substring(GuidLength + 1);

export const getFileExtension = (str: string): string => {
  const parts = str.split('.');
  if (!parts.length)
    return '';
  const lastPart = parts[parts.length - 1];
  return lastPart.substring(1);
};
