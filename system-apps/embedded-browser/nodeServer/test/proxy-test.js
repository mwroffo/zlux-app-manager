"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const expect = require('chai').expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const proxy_plugin_1 = require("../src/proxy-plugin");
describe('embedded browser proxy', () => {
    let app = null;
    let client = null;
    beforeEach(() => {
        app = new proxy_plugin_1.EmbeddedBrowserProxy().getRouter();
        client = chai.request(app).keepOpen();
    });
    it('is an instantiable object', done => {
        // make GET to google.com, show that its headers include X-FRAME-OPTIONS: SAMEORIGIN || DENY
        const proxyRouter = new proxy_plugin_1.EmbeddedBrowserProxy();
        // make a post to proxy, show that proxy returns through res1 the same data with the blocking header stripped.
        client.post('/')
            .send({
            'payload': 'hello world'
        })
            .then((res) => {
            expect(res.body).to.eql('hello world');
            expect(res.status).to.eql(200);
        })
            .then(() => {
            client.close();
            done();
        });
    }).timeout(8000);
});
//# sourceMappingURL=proxy-test.js.map