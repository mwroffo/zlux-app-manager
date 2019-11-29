"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
const express = require('express');
const Promise = require('bluebird');
class HelloWorldDataservice {
    constructor(context) {
        this.context = context;
        let router = express.Router();
        // use assigns the middleware function. can I have multiple middleware functions?
        router.use(function noteRequest(req, res, next) {
            context.logger.info('Saw request, method=' + req.method);
            next();
        });
        context.addBodyParseMiddleware(router); // what is this for?
        router.post('/', function (req, res) {
            let messageFromClient = req.body ? req.body.messageFromClient : "<No/Empty Message Received from Client>";
            let responseBody = {
                "_docType": "org.zowe.zlux.sample.service.hello",
                "_metaDataVersion": "1.0.0",
                "requestBody": req.body,
                "requestURL": req.originalUrl,
                "serverResponse": `Router received
        
        '${messageFromClient}'
        
        from client`
            };
            res.status(200).json(responseBody);
        });
        this.router = router; // assign after 
    }
    getRouter() {
        return this.router;
    }
}
exports.helloWorldRouter = function (context) {
    return new Promise(function (resolve, reject) {
        let dataservice = new HelloWorldDataservice(context);
        resolve(dataservice.getRouter());
    });
};
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/
//# sourceMappingURL=helloWorld.js.map