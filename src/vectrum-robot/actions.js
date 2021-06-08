const { processAuth } = require('./lib');
const settings = require('../../settings');
const BN = require('bignumber.js');



const createActionLinkauth = (contract, action, account) => {
  return {
    account: 'eosio',
    name: 'linkauth',
    authorization: [{
      actor: account,
      permission: 'active',
    }],
    data: {
      account: account,
      code: account,
      type: action,
      requirement: 'vectrumrobot',
    },
  };
}
module.exports.createActionLinkauth = createActionLinkauth;


const createActionUpdateauth = ({ auth, authorization, data, }) => {
  const permission = processAuth(auth);

  const action = {
    account: 'eosio',
    name: 'updateauth',
    authorization: [],
    data: {
      account: '_',
      permission: 'vectrumrobot',
      parent: 'active',
      auth: permission,
    },
  };

  for (let i in authorization)
    action.authorization.push({ actor: authorization[i].actor, permission: authorization[i].permission });
  if (data) {
    action.data.account = data.account;
    action.data.permission = data.permission;
    action.data.parent = data.parent || 'active';
  }

  return action;
}


const createRegProxy = (proxy, isproxy) => {
  const action = {
    account: 'eosio',
    name: 'regproxy',
    authorization: [{
      actor: proxy,
      permission: 'vectrumrobot',
    }],
    data: {
      proxy: proxy,
      isproxy: isproxy,
    },
  };
  return action;
}


const createActionRegProducer = (params) => {
  const { producer, producer_key, url, location } = params;
  const action = {
    account: 'eosio',
    name: 'regproducer',
    authorization: [{
      actor: producer,
      permission: 'vectrumrobot',
    }],
    data: {
      producer, producer_key, url, location,
    },
  };
  return action;
}


const createActionUnRegProducer = (producer) => {
  const action = {
    account: 'eosio',
    name: 'unregprod',
    authorization: [{
      actor: producer,
      permission: 'vectrumrobot',
    }],
    data: {
      producer,
    },
  };
  return action;
}



const createTokenTransfer = (params = {}) => {
  const { from, to, quantity, memo } = params;

  const action = {
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: from,
      permission: 'vectrumrobot',
    }],
    data: {
      from,
      to,
      quantity,
      memo: memo || '',
    },
  };
  return action;
}


const createAccountClaimrewards = (owner) => {
  const action = {
    account: 'eosio',
    name: 'claimrewards',
    authorization: [{
      actor: owner,
      permission: 'vectrumrobot',
    }],
    data: {
      owner,
    },
  };
  return action;
}

const createAccountDelegatebw = (
  { from, receiver, quantity, stake_net_quantity, stake_cpu_quantity, transfer = false }
) => {
  const action = {
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: from,
      permission: 'vectrumrobot',
    }],
    data: {
      from,
      receiver,
      stake_net_quantity,
      stake_cpu_quantity,
      transfer,
    }
  };
  if (quantity) {
    let q = parseInt(quantity * 10000);
    let cpu_rate = settings.newAccount.cpu_rate;
    let cpu = parseInt((q * cpu_rate));
    let net = parseInt(q - cpu);

    net = net / 10000;
    cpu = cpu / 10000;

    action.data.stake_net_quantity = `${net.toFixed(4)} eosio`;
    action.data.stake_cpu_quantity = `${cpu.toFixed(4)} eosio`;
  }
  return action;
}

const createAccountUndelegatebw = (
  { from, receiver, unstake_net_quantity, unstake_cpu_quantity, transfer = false }
) => {
  const action = {
    account: 'eosio',
    name: 'undelegatebw',
    authorization: [{
      actor: from,
      permission: 'vectrumrobot',
    }],
    data: {
      from,
      receiver,
      unstake_net_quantity,
      unstake_cpu_quantity,
      transfer,
    }
  };
  return action;
}


const createAccountVoteproducer = (
  { voter, proxy = '', producers = [] }
) => {
  const action = {
    account: 'eosio',
    name: 'voteproducer',
    authorization: [{
      actor: voter,
      permission: 'vectrumrobot',
    }],
    data: {
      voter,
      proxy,
      producers,
    }
  };
  return action;
}




const deleteauth = {
  account: 'eosio',
  name: 'deleteauth',
  authorization: [{
    actor: 'vectrumrobot',
    permission: 'owner',
  }],
  data: {
    account: '',
    permission: 'permission',
  },
};
