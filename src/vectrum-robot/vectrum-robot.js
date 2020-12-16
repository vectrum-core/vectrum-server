const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
const cfg = require('../config');
const log = require('../logger').getLogger('ROBOT');



const isProduction = cfg.get('env') === 'production';
const nodeEndpoint = cfg.get('vectrum.node');
const hyperionEndpoint = cfg.get('vectrum.hyperion');

// EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
// = 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
const ownerKey = cfg.get('vectrum.robot.keys.owner');
const activeKey = cfg.get('vectrum.robot.keys.active');
const defaultKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';

const keys = [];
if (ownerKey && !keys.includes(ownerKey))
  keys.push(ownerKey);
if (activeKey && !keys.includes(activeKey))
  keys.push(activeKey);
if (defaultKey && !keys.includes(defaultKey))
  keys.push(defaultKey);

const signatureProvider = new JsSignatureProvider(keys);
const rpc = new JsonRpc(nodeEndpoint, { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


module.exports = {};
