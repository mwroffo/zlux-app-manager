"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const Promise = require('bluebird');
const http = require('http');
const https = require('https');
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/
// TODO init the plugin
// TODO implement the proxy in ts via express requests.
class EmbeddedBrowserProxy {
    constructor() {
        const router = express.Router();
        let options = {
            isHttps: false,
            allowInvalidTLSProxy: true // hardcode for now
        };
        router.use((req, res) => {
            console.log('console.log: hello proxy-plugin');
            res.send('hello proxy-plugin!');
        });
        router.post('/', function handleProxyReq(req, res) {
            console.log('router.post: hello proxy-plugin');
            let messageFromClient = req.body ? req.body.messageFromClient : "<No/Empty Message Received from Client>";
            let responseBody = {
                "_docType": "org.zowe.zlux.embedded.browser",
                "_metaDataVersion": "1.0.0",
                "requestBody": req.body,
                "requestURL": req.originalUrl,
                "serverResponse": `Router received
        
                '${messageFromClient}'
        
                from client`
            };
            console.log(`client gives headers ${req.headers}`);
            res.status(200).json(responseBody);
        });
        this.router = router;
    }
    getRouter() {
        return this.router;
    }
}
exports.EmbeddedBrowserProxy = EmbeddedBrowserProxy;
function getEmbeddedBrowserProxy() {
    return new Promise(function (resolve, reject) {
        let embeddedBrowserProxy = new EmbeddedBrowserProxy();
        resolve(embeddedBrowserProxy.getRouter());
    });
}
const app = express();
const router = new EmbeddedBrowserProxy().getRouter();
app.use('/', router); // router can be passed like a callback
app.listen(3000);
module.exports.getEmbeddedBrowserProxy = getEmbeddedBrowserProxy;
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/ 
//# sourceMappingURL=proxy-plugin.js.map