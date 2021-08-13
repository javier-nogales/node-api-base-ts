import express from 'express';

const default_port :number = 3000;



    export interface Application {
        readonly app :express.Application;
        readonly port :number;

        addRouters(routers :Router[]) :void;
        start() :void;
    }

    export class Router {
        private _basePath :string;
        private _router :express.Router;
        private _securityFilter? :SecurityFilter;
        private constructor(
            basePath :string,
            endPoints :EndPoint[],
            securityFilter? :SecurityFilter
        ) {
            this._basePath = basePath;
            this._securityFilter = securityFilter;
            this._router = express.Router();
            // this._router.use(WapiErrorHandler.requestErrorHandler);
            if (this._securityFilter) {
                this.securizeRouter(this._securityFilter);
            }
            endPoints.forEach(endPoint => {
                this._endpointBuilder(endPoint);
            });
        }
        static from(metadata :RouterMetadata) :Router {
            return new Router(
                metadata.basePath,
                metadata.endpoints,
                metadata.securityFilter
            );
        }
        securizeRouter(securityFilter :SecurityFilter) {
            this._router.all(
                /.*/,
                securityFilter.checkAuth,
                (req, res, next) => {
                    next();
                }
            );
        }
        runOn(app :express.Application) {
            app.use(this._router);
        }
        private _endpointBuilder(endpoint:EndPoint) {
            switch(endpoint.method) {
                case Method.get:
                    this._router.get(this._basePath + endpoint.path,
                                     this._getCallback(endpoint));
                break;
                case Method.post:
                    this._router.post(this._basePath + endpoint.path,
                                      this._getCallback(endpoint));
                break;
                case Method.put:
                    this._router.put(this._basePath + endpoint.path,
                                     this._getCallback(endpoint));
                break;
                case Method.delete:
                    this._router.delete(this._basePath + endpoint.path,
                                        this._getCallback(endpoint));
                break; 
                default:
                    // throw new ApiRestSystemError(`Method ${endpoint.method} is not supported`);
                    throw new Error(`Method ${endpoint.method} is not supported`);
            }
        }
        private _getCallback(endpoint:EndPoint): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> {
            return async (req :express.Request, res:express.Response, next:express.NextFunction) => {
                try {
                    console.log('--> INTO REQUEST HANDLER')
                    //[1] Validate request entry
                    const dataIn:any = await endpoint.validationHandler(req);
                    //[2] Call to controller method
                    const dataOut:any = await endpoint.controllerEntry(dataIn);
                    //[3] Send response
                    endpoint.responseHandler(res, dataOut);
                } catch (err) {
                    //[4] Handle errors
                    next(err);
                }
            };
            
        }
    }

    export function createFor(app: express.Application) {
        return new BuilderPortStep(new ApiBase(app));
    }

    class ApiBase implements Application {

        _app :express.Application;
        _port :number = default_port;
        startCallback? :Function;

        get app() {return this._app};
        get port() {return this._port};

        constructor(app :express.Application) {
            this._app = app;
        }

        addRouters(routers :Router[]): void {
            routers.forEach(router => {
                router.runOn(this._app);
            });
        }

        start() {
            if(this.startCallback)
                this._app.listen(this._port, this.startCallback());
            else
                this._app.listen(this._port);
        }

    }

    class BuilderPortStep {
        
        constructor (
            private api: ApiBase
        ) {}

        public withDefaultPort(): BuilderJSONRestStep {
            return new BuilderJSONRestStep(this.api);
        }
        
        public withPort(port:number): BuilderJSONRestStep {
            this.api._port = port;
            return new BuilderJSONRestStep(this.api);
        }

    }

    class BuilderJSONRestStep {
        
        constructor (
            private api: ApiBase
        ) {}

        public asJSONRest(): Build {
            this.api.app.use(express.json);
            return new Build(this.api);
        }

    }

    class Build {
            
        constructor (
            private api: ApiBase
        ) {}

        public build(callback?: Function):Application {
            if (callback)
                this.api.startCallback = callback;
            return this.api;
        }

    }

    export type RouterMetadata = {
        basePath:string
        securityFilter?:SecurityFilter,
        endpoints:EndPoint[];
    };

    export interface SecurityFilter {
        checkAuth(req:express.Request, res:express.Response, next:Function):void;
    };

    export interface EndPoint {
        path :string;
        method :Method;
        validationHandler :ValidationHandler;
        controllerEntry :ValidationHandler;
        responseHandler :ResponseHandler;
    };

    export enum Method {get, post, put, delete};
    export interface ValidationHandler {
        (req:express.Request):Promise<Object>;
    }

    export interface ControllerEntry {
        (input:Object) :Promise<Object>;
    }

    export interface ResponseHandler {
        (res:express.Response, dataOut:any):void;
    }

