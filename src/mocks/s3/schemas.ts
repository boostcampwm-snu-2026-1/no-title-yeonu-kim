export type S3FileType = 'REVIEW' | 'STORE';

export type S3UploadRequest = {
  fileName: string;
  fileType: S3FileType;
  contentType: string;
};

export type S3UploadResponse = {
  url: string;
  s3Key: string;
};
