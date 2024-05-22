const AWS = require("aws-sdk");
const { getS3 } = require("../config/aws");
const env =require('../config/env');

const actionS3Objects = {
  putObject: "putObject",
  getObject: "getObject",
};

const upload = async (req, res) => {
  const { action, fileName, ResponseContentType } = req.body;
  console.log(fileName)
  const signedUrlExpire = 60 * 5;
  try {
    // Create a new instance of S3
    const s3 = getS3();

    // Set up the payload of what we are sending to the S3 api
    const s3Params = {
      Bucket: env.S3_PRESIGNEDBUCKET,
      Key: fileName,
      Expires: signedUrlExpire,
    };
    console.log(s3Params)
    if (ResponseContentType) {
      s3Params["ResponseContentType"] = ResponseContentType;
    }

    if (
      action === actionS3Objects.putObject ||
      action === actionS3Objects.getObject
    ) {
      const data = await s3.getSignedUrlPromise(action, s3Params);

      const returnData = {
        signedRequest: data,
        url: `https://${env.S3_PRESIGNEDBUCKET}.s3.${env.S3_PRESIGNEDREGION}.amazonaws.com/${fileName}`,
      };
      console.log(returnData);
      res.status(200).json({ success: true, data: returnData });
    }
    // DeleteObject - Validate if file exists in S3
    else if (action === actionS3Objects[2]) {
      const s3DeleteParams = {
        Bucket: env.S3_PRESIGNEDBUCKET,
        Key: fileName,
      };
      try {
        await s3.headObject(s3DeleteParams).promise();
        const deleteFile = await s3.deleteObject(s3DeleteParams).promise();
        console.log("File deleted Successfully");
        res.status(200).json(deleteFile);
      } catch (err) {
        console.log("File not Found ERROR : " + err.code);
        res.status(400).json(err);
      }
    } else {
      res.status(400).json({ success: false, error: err });
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false, error: err });
  }
};

module.exports = { upload };
