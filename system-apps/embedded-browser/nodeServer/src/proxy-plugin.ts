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

    constructor() {
        
        const router = express.Router();

        let options = {
            isHttps: false,
            allowInvalidTLSProxy: true // hardcode for now
        }
        
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
            // ineffective 
            // const httpApi = req.protocol == http? http: https;
            // console.log(`httpApi = ${req.protocol == http}`)
            let options = {
                'hostname':'www.google.com',
                'port':80,
                'path':'/',
                'method':'GET',
                'headers': {
                    // 'Content-Type':'application/json',
                    // 'Content-Length':Buffer.byteLength(messageFromClient)
                }
            };
            try {
                let chunks = [];
                let obj = null;
                req.on('data', chunk => {
                    chunks.push(chunk)
                })
                req.on('end', () => {
                    const strObj = Buffer.concat(chunks).toString()
                    obj = JSON.parse(strObj)
                    console.log(`obj is`,obj)
                    options = obj;

                    const req2: ClientRequest = http.request(options, (res2: IncomingMessage) => {
                        console.log(`res2 status ${res2.statusCode}`)
                        console.log(`res2.headers before pipe:`,res2.headers) // res2 is http.IncomingMessage, which is a readable Stream
                        res.status(res2.statusCode) // set res status to whatever res2 status is
                        // res2.removeHeader('x-frame-options')
                        res2.pipe(res)
                        console.log(`res.headers after pipe:`, res.getHeaders())
                        res.getHeaders()
                    })
                    req2.on('error', (e:Error) => console.log(`req2 error: ${e.message}`))
    
                    if ((req.method == 'POST') || (req.method == 'PUT')) {
                        console.log('Callservice: Forwarding request body to service');
                        req.pipe(req2);
                    } else {
                        console.log('Callservice: Issuing request to service');
                        req2.end();
                    }
                
                })
            } catch (err) {
                throw err;
            }
            
            // console.log(`client gives headers`,req.headers); 
        });

        this.router = router;        
    }

    getRouter(): Router {
        return this.router;
    }
}

function getEmbeddedBrowserProxy(): Router {
    return new Promise(function(resolve, reject) {
        let embeddedBrowserProxy = new EmbeddedBrowserProxy();
        resolve(embeddedBrowserProxy.getRouter());
    });
}

const app = express()
const app2 = express()
const router = new EmbeddedBrowserProxy().getRouter()
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