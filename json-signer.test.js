var jsonSigner = require('./json-signer')
var assert = require('assert')

var privateKey = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZCATS"
var fakeKey = "FAKEKEY"


var permissionsToSign = [
  {
    client_id: 123123,
    user_id: 3
  },{ 
    test: 1,
    _another_value: 2,
    nested: { x: 1,c: [ 1, 2, 3, 4 ] },  
  },{ 
    test: 1,
    _another_value: 2,
    cat: null,
    nested: { x: 1,c: [ 1, 2, 3, 4 ] },  
  }
]

permissionsToSign.forEach(function(permission, i){
  var signedPermission = jsonSigner(permission, privateKey)
  assert(
    //////
    jsonSigner.check(signedPermission, privateKey)
    ///////
  , "Checking signature of permission " + i + "failed")
  
  var tamperedPermission = jsonSigner(permission, privateKey)
  tamperedPermission.extraValueNotInSignature = "HAXXOR"
  assert(
    ///////
    !jsonSigner.check(tamperedPermission, privateKey)
    ///////
  , "Tampered permission (" + i + ") still passed verification")
})
console.log("Sign + Check tests passed successfully")

var presignedPermissions = [
  { test: 1,
    _another_value: 2,
    nested: 
     { x: 1,
       c: [ 1, 2, 3, 4 ] },
    $signature: 'KONTdPKex6pMUoLL8fHb78RlTueIvRVnC91ANN3h8CE='
  }
]

presignedPermissions.forEach(function(presignedPermission, i){
  assert(
    ///////
    jsonSigner.check(presignedPermission, privateKey)
    ///////
  , "Checking presigned permission " + i + " failed")
  assert(
    ///////
    !jsonSigner.check(presignedPermission, fakeKey)
    ///////
  , "Checking presigned permission with fake key " + i + " should not have passed check")
})

console.log("Presigned check tests passed successfully")