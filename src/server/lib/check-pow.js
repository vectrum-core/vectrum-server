const KJUR = require('jsrsasign');


const checkPOW = (string, nonce, zeroNum = 1) => {
  const data = `${string}:${nonce}`;
  const md = new KJUR.crypto.MessageDigest({ alg: 'sha256', prov: 'cryptojs' });
  md.updateString(data);
  const hash = md.digest();
  if (hash.slice(0, zeroNum) === '0'.repeat(zeroNum))
    return true;
  return false;
}


module.exports = {
  checkPOW,
};
