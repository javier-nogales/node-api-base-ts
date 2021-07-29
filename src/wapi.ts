import express from 'express';

const default_port :number = 3000;



    export interface Application {
        readonly app :express.Application;
        readonly port :number;

        addRouters() :void;
        start() :void;
    }

    export function createFor(app: express.Application) {
        return new BuilderPortStep(new ApiBase(app));
    }

    class ApiBase implements Application {

        app :express.Application;
        port :number = default_port;
        startCallback? :Function;

        constructor(app :express.Application) {
            this.app = app;
        }

        addRouters():void {
            
        }

        start() {
            if(this.startCallback)
                this.app.listen(this.port, this.startCallback());
            else
                this.app.listen(this.port);
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
            this.api.port = port;
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