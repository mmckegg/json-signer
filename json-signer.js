var crypto = require('crypto')  
  
module.exports = function(permissions, privateKey){
  return addSignature(permissions, hashObject({privateKey: privateKey, permissions: permissions}))
}

module.exports.check = function(signedPermissions, privateKey){
  var calculatedSignature = hashObject({privateKey: privateKey, permissions: removeSignature(signedPermissions)})
  return signedPermissions._signature === calculatedSignature
}

function hashObject(object){
  var string = canonicalJSON(object)
  return crypto.createHash('sha256').update(string).digest('base64')
}

function canonicalJSON(object){
  if (object == null){
    return 'null'
  }
  
  var object = object.valueOf()
  
  if (object instanceof Array){
    var result = "["
    
    object.forEach(function(value, i){
      if (i > 0) result += ','
      result += canonicalJSON(value)
    })
    
    return result + ']'
  } else if (object instanceof Object){
    var result = "{"
    
    Object.keys(object).sort().forEach(function(key, i){
      var value = object[key]
      if (i > 0) result += ','
      result += JSON.stringify(key) + ':' + canonicalJSON(value)
    })
    
    return result + '}'
  } else {
    return JSON.stringify(object)
  }
}

function addSignature(permissions, signature){
  var result = Object.keys(permissions).reduce(function(result, key){
    result[key] = permissions[key]
    return result
  }, {})
  result._signature = signature
  return result
}

function removeSignature(signedPermissions){
  return Object.keys(signedPermissions).reduce(function(result, key){
    if (key !== '_signature'){
      result[key] = signedPermissions[key]
    }
    return result
  }, {})
}