import assert from 'assert';
import express from 'express';
import wapi from '../Api';

describe ('wapi builder default values', () => {

    const api: any = wapi.createFor(express())
                            .withDefaultPort()
                            .asJSONRest()
                            .build(() => console.log('wapi is running'));

    it('Aplication interface should be has app member', () => {                              
        expect("app" in api).toBe(true);
    });

    it('Aplication interface should be has port member', () => {                              
        expect("port" in api).toBe(true);                                        
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


