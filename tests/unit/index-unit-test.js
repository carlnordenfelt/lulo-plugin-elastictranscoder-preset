'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var createPresetStub = sinon.stub();
    var deletePresetStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            ElasticTranscoder: function () {
                this.createPreset = createPresetStub;
                this.deletePreset = deletePresetStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        createPresetStub.reset().resetBehavior();
        createPresetStub.yields(undefined, { Preset: { Id: 'Id', Arn: 'Arn' } });
        deletePresetStub.reset().resetBehavior();
        deletePresetStub.yields();

        event = {
            ResourceProperties: {
                Container: 'Container',
                Name: 'Name'
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if Container is not set', function (done) {
            delete event.ResourceProperties.Container;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Container/);
            done();
        });
        it('should fail if Name is not set', function (done) {
            delete event.ResourceProperties.Name;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Name/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(createPresetStub.calledOnce).to.equal(true);
                expect(deletePresetStub.called).to.equal(false);
                expect(response.physicalResourceId).to.equal('Id');
                done();
            });
        });
        it('should fail due to createPreset error', function (done) {
            createPresetStub.yields('createPreset');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('createPreset');
                expect(createPresetStub.calledOnce).to.equal(true);
                expect(deletePresetStub.called).to.equal(false);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('update', function () {
        it('should do nothing', function (done) {
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(createPresetStub.called).to.equal(false);
                expect(deletePresetStub.called).to.equal(false);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = '1234567890123-123456';
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(createPresetStub.called).to.equal(false);
                expect(deletePresetStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to deletePreset error', function (done) {
            event.PhysicalResourceId = '1234567890123-123456';
            deletePresetStub.yields({ code: 'deletePipeline' });
            subject.delete(event, {}, function (error, response) {
                expect(error.code).to.equal('deletePipeline');
                expect(createPresetStub.called).to.equal(false);
                expect(deletePresetStub.calledOnce).to.equal(true);
                expect(response).to.equal(undefined);
                done();
            });
        });
        it('should not fail if deletePreset error is ResourceNotFound', function (done) {
            event.PhysicalResourceId = '1234567890123-123456';
            deletePresetStub.yields({ code: 'ResourceNotFoundException' });
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(createPresetStub.called).to.equal(false);
                expect(deletePresetStub.calledOnce).to.equal(true);
                expect(response).to.equal(undefined);
                done();
            });
        });
        it('should not fail if PhysicalResourceId is not an actual preset id', function (done) {
            event.PhysicalResourceId = 'PhysicalResourceId';
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(createPresetStub.called).to.equal(false);
                expect(deletePresetStub.called).to.equal(false);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });
});
