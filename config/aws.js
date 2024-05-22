const AWS = require('aws-sdk');

const getS3 = () => {
  const S3_PRESIGNEDREGION = process.env.S3_PRESIGNEDREGION;

  //AWS Configuration
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: S3_PRESIGNEDREGION
  });

  // Create a new instance of S3
  const s3 = new AWS.S3();

  return s3;
};

const getS3PublicBaseUrl = () => {
  const url = `https://${process.env.S3_PRESIGNEDBUCKET}.s3.${process.env.S3_PRESIGNEDREGION}.amazonaws.com`;

  return url;
};

module.exports = {
  getS3,
  getS3PublicBaseUrl
};
