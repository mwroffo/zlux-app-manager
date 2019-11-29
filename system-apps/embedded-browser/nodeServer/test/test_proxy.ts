import { suite, test, slow, timeout } from "mocha-typescript";
import { EmbeddedBrowserProxy } from "../ts/proxy-plugin"
describe('embedded browser proxy', () => {
    it('is an instantiable object', done => {
        proxy = EmbeddedBrowserProxy();
        done()
    })
})