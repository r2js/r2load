const glob = require('glob');
const _ = require('underscore');
const log = require('debug')('r2:load');

module.exports = (options = {}) => {
  const { baseDir } = options;
  const scripts = [];
  const pattern = source => source.includes('.js') ? source : `${source}/**/*.js`;
  const getList = cwd => list => _.map(list, name => ({ cwd, name }));
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
      let fName = name;
      let fOpts = opts;
      if (name && !opts && _.isObject(name)) {
        fName = name.name || object.name;
        fOpts = name;
      } else if (!name && !opts && object) {
        fName = object.name;
      }

      if (object && fName) {
        push({ object, name: fName, opts: fOpts });
      } else {
        log('service not found!');
      }

      return this;
    },

    into(...args) {
      const [obj = {}] = args;
      obj.services = {};
      const list = _.uniq(_.flatten(scripts), 'name');
      _.reduce(list, (memo, item) => {
        const { object, name, opts } = item;
        let instance;
        if (object && typeof object === 'object') {
          instance = object; // load directly
        } else if (object && typeof object === 'function') {
          instance = object.call(object, obj, opts);
        } else {
          const fullPath = `${item.cwd}/${item.name}`;
          instance = require(fullPath); // eslint-disable-line
          if (typeof instance.call === 'function') {
            instance = instance.call(instance, obj);
          }
        }
        log(`loaded, ${item.name}`);
        const extendObj = name ? getObj(name, instance) : {};
        return _.extend(memo, extendObj);
      }, obj.services);

      return this;
    },
  };
};
