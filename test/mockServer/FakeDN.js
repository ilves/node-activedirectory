'use strict';

const util = require('util');
const ldap = require('ldapjs');
const FakeRDN = require('./FakeRDN');

function FakeDN(rdns) {
  this.rdns = [rdns];
}
util.inherits(FakeDN, ldap.DN);

FakeDN.prototype.equals = function equals(dn) {
  if (dn instanceof FakeDN) {
    return this.rdns[0].attrs.dn.value === dn.rdns[0].attrs.dn.value;
  } else {
    return ldap.DN.prototype.equals.call(this, dn);
  }
};

FakeDN.prototype.format = function format(dn) {
  return dn;
};

FakeDN.prototype.toString = function toString() {
  return this.rdns[0].attrs.dn.value;
};

const realParse = require('ldapjs/lib/dn').parse;
FakeDN.parse = function parse(name) {
  if (name.indexOf('@') !== -1 || name.indexOf('\\') !== -1) {
    // AD principal name
    return new FakeDN(
      new FakeRDN(name)
    );
  }
  return realParse(name);
};

module.exports = FakeDN;