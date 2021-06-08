const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountNameValidator = require('./lib/validator-account-name');



const name = 'action_traces';

const schema = new Schema({
  block_num: { type: Number, index: true, },
  block_time: { type: String, index: true, },
  receiver: { type: String, index: true, },
  receipt: {
    receiver: { type: String, index: true, },
  },
  act: {
    account: { type: String, index: true, },
    name: { type: String, index: true, },
    authorization: [{
      actor: { type: String, index: true, },
      permission: { type: String, index: true, },
    }],
    data: { type: Schema.Types.Mixed, },
  },
});


// eosio.token::transfer
schema.index({ 'act.data.from': 1, }, { sparse: true, });
schema.index({ 'act.data.to': 1, }, { sparse: true, });
schema.index({ 'act.data.quantity': 1, }, { sparse: true, });
schema.index({ 'act.data.memo': 1, }, { sparse: true, });


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;

/*
{
  "_id": {
    "$oid": "e0c2697243076d2e9f2560bd"
  },
  "action_ordinal": {
    "$numberLong": "1"
  },
  "creator_action_ordinal": {
    "$numberLong": "0"
  },
  "closest_unnotified_ancestor_action_ordinal": {
    "$numberLong": "0"
  },
  "receipt": {
    "receiver": "eosio",
    "act_digest": "b68a6ce66f46fb8713249220e16e5c82df0d6fcb94718aeb477cc16a3e3e88d7",
    "global_sequence": {
      "$numberLong": "93702"
    },
    "recv_sequence": {
      "$numberLong": "88555"
    },
    "auth_sequence": [
      [
        "eosio",
        {
          "$numberLong": "93632"
        }
      ]
    ],
    "code_sequence": {
      "$numberLong": "3"
    },
    "abi_sequence": {
      "$numberLong": "3"
    }
  },
  "receiver": "eosio",
  "act": {
    "account": "eosio",
    "name": "onblock",
    "authorization": [
      {
        "actor": "eosio",
        "permission": "active"
      }
    ],
    "data": {
      "header": {
        "timestamp": {
          "$numberLong": "1352682463"
        },
        "producer": "defproducerl",
        "confirmed": {
          "$numberLong": "0"
        },
        "previous": "0001509f41f0653bfda142b1bdd3a66425817a64277b3e97888327c2c2aa872f",
        "transaction_mroot": "0000000000000000000000000000000000000000000000000000000000000000",
        "action_mroot": "1fa7bb94de9d82c44675e17fb9116b30fd4ee7ac0d39e291763b767cf3f195c3",
        "schedule_version": {
          "$numberLong": "1"
        },
        "new_producers": null
      }
    },
    "hex_data": "df4ba05010af423ad15b974a00000001509f41f0653bfda142b1bdd3a66425817a64277b3e97888327c2c2aa872f00000000000000000000000000000000000000000000000000000000000000001fa7bb94de9d82c44675e17fb9116b30fd4ee7ac0d39e291763b767cf3f195c3010000000000"
  },
  "context_free": false,
  "elapsed": {
    "$numberLong": "21514"
  },
  "console": "",
  "trx_id": "3d93ebb75cfcdfe9f5971933b45ec76fd3f6c464225933f10af1c483ab3096df",
  "block_num": {
    "$numberLong": "86177"
  },
  "block_time": "2021-06-07T00:33:55.000",
  "producer_block_id": null,
  "account_ram_deltas": [],
  "except": null,
  "error_code": null,
  "trx_status": "executed",
  "createdAt": {
    "$date": "2021-06-07T00:33:54.841Z"
  }
}
*/
