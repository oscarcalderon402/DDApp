const AWS = require("aws-sdk");
const config = require("config");
const accessKeyId = config.get("AWS.ACCESSKEYID");
const secretAccessKey = config.get("AWS.SECRETACCESSKEY");

AWS.config.setPromisesDependency();
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  //   region,
});

const S3 = new AWS.S3();

module.exports = S3;
