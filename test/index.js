const chai = require('chai');
const r2load = require('../index');

const expect = chai.expect;

describe('r2load', () => {
  describe('load local directories', () => {
    it('should load all local directories', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      loader.local('model').local('controller').local('service').into(app);
      ['a', 'b', 'c'].map((file) => {
        const model = `model/${file}`;
        const controller = `controller/${file}`;
        const service = `service/${file}`;
        expect(app.services[model].objName).to.equal(model);
        expect(app.services[controller].objName).to.equal(controller);
        expect(app.services[service].objName).to.equal(service);
        return file;
      });
    });
  });

  describe('load parent directories', () => {
    it('should load all parent directories', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      loader
        .load('test/model')
        .load('test/controller')
        .load('test/service')
        .into(app);
      ['a', 'b', 'c'].map((file) => {
        const model = `model/${file}`;
        const controller = `controller/${file}`;
        const service = `service/${file}`;
        expect(app.services[`test/${model}`].objName).to.equal(model);
        expect(app.services[`test/${controller}`].objName).to.equal(controller);
        expect(app.services[`test/${service}`].objName).to.equal(service);
        return file;
      });
    });
  });

  describe('load local files and directories', () => {
    it('should load single local file', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      loader.local('model/a.js').into(app);
      expect(app.services['model/a'].objName).to.equal('model/a');
      expect(app.services['model/b']).to.equal(undefined);
      expect(app.services['model/c']).to.equal(undefined);
      expect(app.services['controller/a']).to.equal(undefined);
      expect(app.services['service/a']).to.equal(undefined);
    });

    it('should load local files in the given order', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      loader.local('model/b.js').local('model/c.js').local('model').into(app);
      const keys = Object.keys(app.services).join('|');
      expect(keys).to.equal('model/b|model/c|model/a');
    });
  });

  describe('load services', () => {
    it('should load named function', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceA = require('./service/a'); // eslint-disable-line
      loader.serve(ServiceA).into(app);
      expect(app.services.ServiceA.objName).to.equal('service/a');
    });

    it('should load named function with name parameter', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceA = require('./service/a'); // eslint-disable-line
      loader.serve(ServiceA, 'ServiceA-Name').into(app);
      expect(app.services['ServiceA-Name'].objName).to.equal('service/a');
    });

    it('should load named function with opts parameter', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceA = require('./service/a'); // eslint-disable-line
      loader.serve(ServiceA, { param: 'a' }).into(app);
      expect(app.services.ServiceA.opts.param).to.equal('a');
    });

    it('should load named function both with name and opts parameter', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceA = require('./service/a'); // eslint-disable-line
      loader.serve(ServiceA, 'ServiceA-Name', { param: 'a' }).into(app);
      expect(app.services['ServiceA-Name'].opts.param).to.equal('a');
    });

    it('should not load anonymous function', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceB = require('./service/b'); // eslint-disable-line
      loader.serve(ServiceB).into(app);
      expect(app.services.ServiceB).to.equal(undefined);
    });

    it('should load anonymous function with name parameter', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceB = require('./service/b'); // eslint-disable-line
      loader.serve(ServiceB, 'ServiceB').into(app);
      expect(app.services.ServiceB.objName).to.equal('service/b');
    });

    it('should load anonymous function with opts parameter and opts.name property', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceB = require('./service/b'); // eslint-disable-line
      loader.serve(ServiceB, { name: 'ServiceB', param: 'b' }).into(app);
      expect(app.services.ServiceB.objName).to.equal('service/b');
      expect(app.services.ServiceB.opts.param).to.equal('b');
    });

    it('should not load anonymous function with opts parameter and without opts.name property', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceB = require('./service/b'); // eslint-disable-line
      loader.serve(ServiceB, { param: 'a' }).into(app);
      expect(app.services.ServiceB).to.equal(undefined);
    });

    it('should load anonymous function both with name and opts parameter', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceB = require('./service/b'); // eslint-disable-line
      loader.serve(ServiceB, 'ServiceB-Name', { param: 'b' }).into(app);
      expect(app.services['ServiceB-Name'].objName).to.equal('service/b');
      expect(app.services['ServiceB-Name'].opts.param).to.equal('b');
    });

    it('should load object', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      loader.serve({ a: 1, b: 2 }, 'CustomObject').into(app);
      expect(app.services.CustomObject).to.not.equal(undefined);
      expect(app.services.CustomObject.a).to.equal(1);
      expect(app.services.CustomObject.b).to.equal(2);
    });

    it('should get previous service in current service', () => {
      const app = {};
      const loader = r2load({ baseDir: __dirname });
      const ServiceB = require('./service/b'); // eslint-disable-line
      const ServiceC = require('./service/c'); // eslint-disable-line
      loader.serve(ServiceB, 'ServiceB').serve(ServiceC, 'ServiceC').into(app);
      expect(app.services.ServiceC.prevService.objName).to.equal('service/b');
    });
  });
});
