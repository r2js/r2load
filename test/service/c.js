// TODO: run fonksiyonu çalışıyor mu test et
module.exports = (app, opts) => {
  this.opts = opts;
  this.objName = 'service/c';
  this.run = () => 'run';
  this.prevService = app.services.ServiceB;
  return this;
};
