import { suite, test, slow, timeout } from "mocha-typescript";
import "mocha";
const chai = require('chai')
const expect = chai.expect;
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import { EmbeddedBrowserProxy } from "../src/proxy-plugin"
import { Router } from "express";

describe('embedded browser proxy', () => {
    let app = null;
    let client = null;
    beforeEach(() => {
        app = new EmbeddedBrowserProxy().getRouter();
        client = chai.request(app).keepOpen()
    })
    it('is an instantiable object', done => {
        // make GET to google.com, show that its headers include X-FRAME-OPTIONS: SAMEORIGIN || DENY
        
        const proxyRouter = new EmbeddedBrowserProxy();
        // make a post to proxy, show that proxy returns through res1 the same data with the blocking header stripped.
        client.post('/')
            .send({
                'payload':'hello world'
            })
            .then((res: any) => {
                expect(res.body).to.eql('hello world');
                expect(res.status).to.eql(200);
            })
            .then(() => {
                client.close()
                done()
            })
    }).timeout(8000)
})