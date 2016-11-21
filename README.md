# lulo Elastic Transcoder Preset

lulo Elastic Transcoder Preset creates an Amazon Elastic Trancoder Preset.

lulo Elastic Transcoder Preset is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
$ npm install lulo-plugin-elastictranscoder-preset --save
```

**NOTE:**
This resource does not support updates! Any changes are ignored.

## Usage
### Properties
See the [AWS SDK Documentation for ElasticTranscoder::createPreset](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html#createPreset-property)

### Return Values
When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the Id of the Preset.

`{ "Ref": "Preset" }`

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
       "elastictranscoder:CreatePreset",
       "elastictranscoder:DeletePreset",
       "iam:PassRole"
   ],
   "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
