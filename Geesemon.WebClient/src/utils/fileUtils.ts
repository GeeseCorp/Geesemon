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