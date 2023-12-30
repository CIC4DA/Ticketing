import nats, {Stan} from 'node-nats-streaming';

/*
    Here we are making this NatsWrapper Class instead of using it directly in index.ts.

    Because we want to remove any sicklekal dependencies(circular dependencies). 

    Now we can start the client on index.ts. And can access the client from this file. So we do not have any dependency on the index.ts

*/

class NatsWrapper {
    private _client?: Stan;

    // it is a getter, it is going to define the client property. No need to use paranthesis when calling it
    get clientGetter() {
        if(!this._client){
            throw new Error('Cannot Access NATS Client before connecting');
        } 

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string){
        this._client = nats.connect(clusterId,clientId,{url});

        return new Promise<void>((resolve, reject) => {
            this._client!.on('connect', () => {
              console.log('Connected to NATS');
              resolve();
            });
            this._client!.on('error', (err) => {
                reject(err);
            });
        });
      
    }
}

export const natsWrapper = new NatsWrapper();