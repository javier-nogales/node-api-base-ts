import request from 'supertest';
import wapi from './../index';
import express, { Router } from 'express';

describe('Api can be listening', () => {
    it('get on "/" should return status 200', async (done) => {
        const api :wapi.Application = wapi.createFor(express())
                                          .withDefaultPort()
                                          .asJSONRest()
                                          .build(() => console.log('wapi is running'));
        console.log('--> INTO TEST')
        const router :wapi.Router = wapi.Router.from({
            basePath: '/',
            endpoints: [
                {
                    method: wapi.Method.get,
                    path: '',
                    validationHandler: async (req :express.Request) :Promise<Object> => {
                        console.log('--> INTO VALIDATION HANDLER')
                        return {result: "ok"}
                    },
                    controllerEntry: async (input:Object) :Promise<Object> => {
                        return {input}
                    },
                    responseHandler: (res:express.Response, dataOut:any) :void => {
                        res.status(200).json(dataOut);
                    }
                }
            ]
        });
        
        api.addRouters([router]);
        api.start();

        try {
            const req :request.Response = await request(api.app)
                .get('/fake');
            expect(req.status).toBe(200);
            // expect(req.body).toBe('falla');
        } catch (error) {
            throw error;
        } finally {
            done();
        }
        
    });
});