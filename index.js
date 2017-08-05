const glob = require('glob');
const _ = require('underscore');
const log = require('debug')('r2:load');

module.exports = (options = {}) => {
  const { baseDir } = options;
  const toString = Object.prototype.toString;
  const scriptList = [];
  const pattern = source => source.includes('.js') ? source : `${source}/**/*.js`;
  const pushScript = list => scriptList.push(list);
  const getFileList = cwd => list => list.map(name => ({ cwd, name }));
  const appFileList = getFileList(process.cwd());
  const baseFileList = getFileList(baseDir);
  const globSyncBase = _.partial(glob.sync, _, { cwd: baseDir });
  const getApp = _.compose(pushScript, appFileList, glob.sync, pattern);
  const getBase = _.compose(pushScript, baseFileList, globSyncBase, pattern);
  const getInstanceObj = (name, instance) => ({ [name.replace('.js', '')]: instance });

  return {
    load(source) {
      getApp(source);
      return this;
    },

    local(source) {
      if (!baseDir) {
        log('baseDir param not found!');
      } else {
        getBase(source);
      }

      return this;
    },

    resolveService(...args) {
      const [object, ...rest] = args;
      let [name, opts] = rest;

      if (name && !opts && _.isObject(name)) {
        opts = name;
        name = name.name || object.name;
      } else if (!name && !opts && object) {
        name = object.name;
      }

      return { object, name, opts };
    },

    serve(...args) {
      const { object, name, opts } = this.resolveService(...args);

      if (object && name) {
        pushScript({ object, name, opts });
      } else {
        log('service not found!');
      }

      return this;
    },

    into(...args) {
      const [obj = {}] = args;
      obj.services = {};
      const list = _.uniq(_.flatten(scriptList), 'name');

      list.reduce((memo, item) => {
        const { object, name, opts } = item;
        let instance;

        if (object && typeof object === 'object') {
          instance = object; // load directly
        } else if (object && typeof object === 'function') {
          instance = object.call(object, obj, opts);
        } else {
          const fullPath = `${item.cwd}/${item.name}`;
          instance = require(fullPath); // eslint-disable-line
          if (toString.call(instance) === '[object Function]') {
            instance = instance.call(instance, obj);
          }
        }
        log(`loaded, ${item.name}`);
        return Object.assign(memo, getInstanceObj(name, instance));
      }, obj.services);

      return this;
    },
  };
};
