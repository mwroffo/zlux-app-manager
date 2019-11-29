"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const Promise = require('bluebird');
const http = require('http');
const https = require('https');
const util = require('../../../../../zlux-server-framework/utils');
const proxyLog = util.loggers.proxyLogger;
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
    // TODO base this constructor off of makeProxy 
    constructor(context, noAuth, overrideOptions, host, port) {
        this.context = context;
        const router = express.Router();
        let proxiedHost;
        let proxiedPort;
        if (host && port) {
            proxiedHost = host;
            proxiedPort = port;
        }
        else {
            console.log(`in EmbeddedBrowserProxy constructor: either host ${host} or port ${port} is undefined`);
        }
        let options = {
            isHttps: false,
            allowInvalidTLSProxy: true // hardcode for now
        };
        const proxyHandler = makeSimpleProxy(proxiedHost, proxiedPort, options, undefined, undefined);
        router.use(proxyHandler);
        // router.post('/', function handleProxyReq(req: Request, res: Response) {
        //     let messageFromClient = req.body ? req.body.messageFromClient : "<No/Empty Message Received from Client>"
        //     let responseBody = {
        //         "_docType": "org.zowe.zlux.sample.service.hello",
        //         "_metaDataVersion": "1.0.0",
        //         "requestBody": req.body,
        //         "requestURL": req.originalUrl,
        //         "serverResponse": `Router received
        //         '${messageFromClient}'
        //         from client`
        //     }
        //     console.log(`client gives headers ${req.headers}`);
        //     res.status(200).json(responseBody);
        // });
        this.router = router;
    }
    getRouter() {
        return this.router;
    }
}
exports.EmbeddedBrowserProxy = EmbeddedBrowserProxy;
// TODO what kind of options does an express Request need? do I need a convertOptions function for this?
/**
 * given host,port,options, returns a doProxy function to be passed to a router's .use method.
 * @param host
 * @param port
 * @param options
 * @param pluginID
 * @param serviceName
 */
function makeSimpleProxy(host, port, options, pluginID, serviceName) {
    if (!(host && port)) {
        throw new Error(`Proxy (${pluginID}:${serviceName}) setup failed.\n`
            + `Host & Port for proxy destination are required but were missing.\n`
            + `For information on how to configure a proxy service, see the Zowe wiki on dataservices `
            + `(https://github.com/zowe/zlux/wiki/ZLUX-Dataservices)`);
    }
    const { urlPrefix, isHttps, addProxyAuthoriziations, processProxiedHeaders, allowInvalidTLSProxy } = options;
    const httpApi = isHttps ? https : http;
    return function proxyHandler(req1, res1, next) {
        console.log(`Request: ${req1.protocol} :// ${req1.get('host')}${req1.url}, to ${options.host}:${options.port}${options.path}`);
        // TODO? add proxy authorizations
        const req2 = new Request(options, (res2) => {
            console.log(`successfully inited new request res2` + res2);
            // processProxiedHeaders?
            // for header in headers.keys:
        });
        // use res2.pipe(res1) to stream through the proxy back to the client.
        // protocol of incoming request determines protocol of the forwarding-request. we receive this in options.
        console.log(`receiving request via ${req.method}`);
        next();
    };
}
function getEmbeddedBrowserProxy(context) {
    return new Promise(function (resolve, reject) {
        let embeddedBrowserProxy = new EmbeddedBrowserProxy(context);
        resolve(embeddedBrowserProxy.getRouter());
    });
}
const app = express(new EmbeddedBrowserProxy());
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