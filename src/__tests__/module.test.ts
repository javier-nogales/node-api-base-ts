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
