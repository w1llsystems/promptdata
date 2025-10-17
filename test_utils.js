const server = require('./test/server_stub');

module.exports = {
  mockGenerate: server.mockGenerate,
  mockSequential: server.mockSequential
};
