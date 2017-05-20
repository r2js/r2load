const glob = require('glob');
const _ = require('underscore');
const log = require('debug')('r2:load');

const toString = Object.prototype.toString;

module.exports = (options = {}) => {
  const { baseDir } = options;
  const scripts = [];
  const pattern = source => source.includes('.js') ? source : `${source}/**/*.js`;
  const getList = cwd => list => list.map(name => ({ cwd, name }));
  const app = getList(process.cwd());
  const base = getList(baseDir);
  const push = list => scripts.push(list);
  const getApp = _.compose(push, app, glob.sync, pattern);
  const getBase = _.compose(push, base, _.partial(glob.sync, _, { cwd: baseDir }), pattern);
  const getObj = (name, instance) => ({ [name.replace('.js', '')]: instance });

  return {
    load(source) {
      getApp(source);
      return this;
    },

    local(source) {
      getBase(source);
      return this;
    },

    serve(...args) {
      const [object, name, opts] = args;
      let getName = name;
      let getOpts = opts;
      if (name && !opts && _.isObject(name)) {
        getName = name.name || object.name;
        getOpts = name;
      } else if (!name && !opts && object) {
        getName = object.name;
      }

      if (object && getName) {
        push({ object, name: getName, opts: getOpts });
      } else {
        log('service not found!');
      }

      return this;
    },

    into(...args) {
      const [obj = {}] = args;
      obj.services = {};
      const list = _.uniq(_.flatten(scripts), 'name');
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
        return Object.assign(memo, getObj(name, instance));
      }, obj.services);

      return this;
    },
  };
};
