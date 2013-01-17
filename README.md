JSON Signer
===

Signs JSON objects and their keys using a private key (e.g. allowing a server to ensure an object has not been tampered with). Depends on `crypto` built into [Node.js](http://nodejs.org)

### jsonSigner(object, privateKey) => signedObject

We can send signed JSON to the client by passing a javascript object and private key to `jsonSigner`.

```js
  // generate the permissions on the server
  
  var jsonSigner = require('json-signer')
    , privateKey = 'secret-key-only-the-server-knows'
    
  var matcher = jsonSigner({
    match: {
      _id: 'abc123',
      type: 'post'
    },
    update: true
  }, privateKey),
  

```

This generates the following JSON to be sent to client:

```json
  {
    "match": {
      _id: "abc123",
      type: "post"
    },
    update: true,
    "$signature": 'KONTdPKex6pMUoLL8fHb78RlTueIvRVnC91ANN3h8CE='
  }
```

### jsonSigner.check(signedObject, privateKey) => true/false

When the matcher is sent back to the server we can verify the signature using `jsonSigner.check`:

```js

  var matcherFromClient = {
    "match": {
      _id: "abc123",
      type: "post"
    },
    "$signature": 'KONTdPKex6pMUoLL8fHb78RlTueIvRVnC91ANN3h8CE='
  }
  
  jsonSigner.check(matcherFromClient, privateKey) // => true or false
  
```
