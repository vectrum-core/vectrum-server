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

const robotAccount = 'vectrumrobot';

module.exports = {
  rpc, api, robotAccount,
};

module.exports.getTxTemplateClaimRewards = function getTxTemplateSendVtm(owner) {
  const actions = [];

  actions.push({
    account: 'eosio',
    name: 'claimrewards',
    authorization: [{
      actor: owner,
      permission: 'active',
    }],
    data: {
      owner,
    },
  });

  return { actions, };
}

module.exports.getTxTemplateSendVtm = function getTxTemplateSendVtm(from, to, amount, memo) {
  const actions = [];

  let quantity = (parseInt(parseFloat(amount) * 10000) / 10000).toFixed(4) + ' VTM';

  actions.push({
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: from,
      permission: 'active',
    }],
    data: {
      from,
      to,
      quantity,
      memo: memo || '',
    },
  });

  return { actions, };
}

module.exports.getTxTemplateCreateAccount = function getTxTemplateCreateAccount(newAccountName) {
  const creatorAccountName = robotAccount;
  if (!newAccountName)
    throw new Error('');

  const actions = [];


  // создаем аккаунт
  actions.push({
    account: 'eosio',
    name: 'newaccount',
    authorization: [{
      actor: creatorAccountName,
      permission: 'active',
    }],
    data: {
      creator: creatorAccountName,
      name: newAccountName,
      owner: {
        threshold: 1,
        /*keys: [{ // ?
          key: 'PUB_K1_6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5BoDq63',
          weight: 1
        }],*/
        keys: [],
        //accounts: [],
        accounts: [{ permission: { actor: creatorAccountName, permission: 'owner' }, 'weight': 1 }],
        waits: []
      },
      active: {
        threshold: 1,
        /*keys: [{
          key: 'PUB_K1_6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5BoDq63',
          weight: 1
        }],*/
        keys: [],
        //accounts: [],
        accounts: [{ permission: { actor: creatorAccountName, permission: 'active' }, 'weight': 1 }],
        waits: []
      },
    },
  });


  // стейкаем на аккаунт чтобы транзакции мог отправлять
  actions.push({
    account: 'eosio',
    name: 'buyrambytes',
    authorization: [{
      actor: creatorAccountName,
      permission: 'active',
    }],
    data: {
      payer: creatorAccountName,
      receiver: newAccountName,
      bytes: 25 * 1024,
    },
  });
  actions.push({
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: creatorAccountName,
      permission: 'active',
    }],
    data: {
      from: creatorAccountName,
      receiver: newAccountName,
      stake_net_quantity: '1.0000 VTM',
      stake_cpu_quantity: '1.0000 VTM',
      transfer: false,
    },
  });

  return { actions, };
}

module.exports.getTxTemplateSetupAccount = function getTxTemplateSetupAccount(acountName) {
  if (!acountName)
    throw new Error('');

  const actions = [];


  // создаем новое permission claimrewards
  const authorization_object = {
    threshold: 1,
    accounts: [{
      permission: {
        actor: robotAccount,
        permission: 'claimrewards',
      },
      weight: 1
    }],
    keys: [],
    waits: [],
  };
  const updateauth_input = {
    account: acountName,
    permission: 'claimrewards',
    parent: 'active',
    auth: authorization_object,
  };
  actions.push({
    account: 'eosio',
    name: 'updateauth',
    authorization: [{
      actor: acountName,
      permission: 'active',
    }],
    data: updateauth_input,
  });


  // привязываем вызов claimrewards к permission robotAccount@claimrewards
  actions.push({
    account: 'eosio',
    name: 'linkauth',
    authorization: [{
      actor: acountName,
      permission: 'active',
    }],
    data: {
      account: acountName,
      code: acountName,
      type: 'claimrewards',
      requirement: 'claimrewards',
    },
  });

  return { actions, };
}
