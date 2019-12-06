import { Router } from "express-serve-static-core";
import { Request, Response } from "express";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { Http2SecureServer } from "http2";
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

export class EmbeddedBrowserProxy {

    private router: Router;
    
    

    constructor(
        private options: object) {
        
        const router = express.Router();

        // passed arrow func is analogous to `makeSimpleProxy`:
        router.use((req: Request,res: Response) => {

            let messageFromClient = req.body ? req.body.messageFromClient : "<No/Empty Message Received from Client>"
            let responseBody = {
                "_docType": "org.zowe.zlux.embedded.browser",
                "_metaDataVersion": "1.0.0",
                "requestBody": req.body,
                "requestURL": req.originalUrl,
                "serverResponse": `Router received
        
                '${messageFromClient}'
        
                from client`
            }

            try {


                    
                // craft forward request
                // uses options taken as constructor:
                const req2: ClientRequest = http.request(options, (res2: IncomingMessage) => {
                    console.log(`res2 status ${res2.statusCode}`)
                    console.log(`res2.headers before pipe:`,res2.headers) // res2 is http.IncomingMessage, which is a readable Stream
                    res.status(res2.statusCode) // set res status to whatever res2 status is
                    for (const header in res2.headers) {
                        res.setHeader(header, res2.headers[header])
                    }
                    res.removeHeader('x-frame-options')
                    res.removeHeader('access-control-allow-origin')
                    res2.pipe(res) // proxy forwards IncomingMessage to ServerResponse
                    
                    console.log(`res.headers after pipe:`, res.getHeaders())
                    res.getHeaders()
                })
                req2.on('error', (e:Error) => console.log(`req2 error: ${e.message}`))

                if ((req.method == 'POST') || (req.method == 'PUT')) {
                    console.log('Callservice: Forwarding request body to service');
                    // TODO but isn't the req stream empty by now?
                    req.pipe(req2); // forward original request body to the forward-request.
                } else {
                    console.log('Callservice: Issuing request to service');
                    req2.end();
                }
                

            } catch (err) {
                throw err;
            }
        });

        this.router = router;        
    }

    getRouter(): Router {
        return this.router;
    }
}

function getEmbeddedBrowserProxy(options): Router {
    return new Promise(function(resolve, reject) {
        let embeddedBrowserProxy = new EmbeddedBrowserProxy(options);
        resolve(embeddedBrowserProxy.getRouter());
    });
}

const app = express()

let options = {
    'hostname': 'www.google.com',
    'port': 80,
    'path': '/',
    'method': 'GET',
    'headers': {
        // 'Content-Type':'application/json',
        // 'Content-Length':Buffer.byteLength(messageFromClient)
    }
};
const router = new EmbeddedBrowserProxy(options).getRouter()
app.use('/', router) // router can be passed like a callback
app.listen(3000)

console.log('express is listening on localhost:3000...')

module.exports.getEmbeddedBrowserProxy = getEmbeddedBrowserProxy;

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/