import express from 'express';
import wapi from '../index';

describe ('wapi builder default values', () => {

    const api :wapi.Application = wapi.createFor(express())
                                        .withDefaultPort()
                                        .asJSONRest()
                                        .build(() => console.log('wapi is running'));
    
    it('Aplication interface should be has app member', () => {                              
        expect(isInstanceOfWapiApplication(api)).toBe(true);
    });

    it('Aplication app should has http methods', () => {
        expect(isInstanceOfExpressApplication(api.app)).toBe(true);
    });
    
    it('Api default port should be 3000', () => {                              
        expect(api.port).toBe(3000);                                        
    });

});

describe ('wapi builder custom values', () => {

    const api: wapi.Application = wapi.createFor(express())
                                        .withPort(80)
                                        .asJSONRest()
                                        .build();

    it('Api default port should be 3000', () => {                              
        expect(api.port).toBe(80);                                        
    });

});

describe ('wapi check methods', () => {
    
    const api: wapi.Application = wapi.createFor(express())
                                        .withPort(80)
                                        .asJSONRest()
                                        .build();

    it ('Api should has addRouters() method 2', () => {
        expect (api.addRouters).toBeInstanceOf(Function);
    });
});

describe ('wapi properties should be readonly', () => {
    const api: wapi.Application = wapi.createFor(express())
                                        .withDefaultPort()
                                        .asJSONRest()
                                        .build();
    it('app shold be read-only', () => {
        expect(isWritable(api, 'app')).toBe(false);        
    });
    it('port should be read-only', () => {
        expect(isWritable(api, 'port')).toBe(false);
    });
});

// describe('Routers', () => {
//     it('api has method to add routers', () => {
//         const api: wapi.Application = wapi.createFor(express())
//                                         .withDefaultPort()
//                                         .asJSONRest()
//                                         .build();
//         const routers :wapi.Router[] = [];
//         api.addRouters(routers);
        
//     });
// });

function isWritable<T extends Object>(obj :T, key :keyof T) :boolean {
    // Beware!! The object property should be private and the access way by getter,
    //          otherwise allway returns true;
    const desc = Object.getOwnPropertyDescriptor(obj, key) || {};
    return Boolean(desc.writable);
}
function isInstanceOfWapiApplication(object :any) :object is wapi.Application {
    return "app" in object &&
           "port" in object &&
           "addRouters" in object &&
           "start" in object;
}
function isInstanceOfExpressApplication(object :any) :object is express.Application {
    return "request" in object && 
           "response" in object &&
           "router" in object &&
           isInstanceOfIRouter(object);
}
function isInstanceOfIRouter(object :any) :object is express.IRouter {
    return "get" in object &&
           "post" in object &&
           "put" in object &&
           "delete" in object &&
           "patch" in object &&
           "use" in object &&
           "options" in object &&
           "head" in object &&
           "route" in object;
}

