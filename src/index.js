'use strict';

var aws = require('aws-sdk');
var elasticTranscoder = new aws.ElasticTranscoder({ apiVersion: '2012-09-25' });

var pub = {};

pub.validate = function (event) {
    if (!event.ResourceProperties.Container) {
        throw new Error('Missing required property Container');
    }
    if (!event.ResourceProperties.Name) {
        throw new Error('Missing required property Name');
    }
};

pub.create = function (event, _context, callback) {
    delete event.ResourceProperties.ServiceToken;
    var params = event.ResourceProperties;
    elasticTranscoder.createPreset(params, function (error, response) {
        if (error) {
            return callback(error);
        }

        var data = {
            physicalResourceId: response.Preset.Id
        };
        callback(null, data);
    });
};

pub.update = function (_event, _context, callback) {
    return setImmediate(callback);
};

pub.delete = function (event, _context, callback) {
    if (!event.PhysicalResourceId.match(/^\d{13}-\w{6}$/)) {
        return setImmediate(callback);
    }

    var params = {
        Id: event.PhysicalResourceId
    };
    elasticTranscoder.deletePreset(params, function (error) {
        if (error && error.code !== 'ResourceNotFoundException') {
            return callback(error);
        }
        callback();
    });
};

module.exports = pub;
