import EventEmitter3 from 'eventemitter3'
import { ISFEngine } from './Engine'


class ISFViewer extends EventEmitter3 {


    private options


    private _engine: ISFEngine

    get dom() {
        return this.options.dom
    }

    get engine() {
        return this._engine
    }

    constructor(options: any) {
        super()
        this.options = options

        this.init()

    }

    init() {
        this._engine = new ISFEngine(this.options)
    }

    addLayer(options: any) {
        this.engine.addLayer(options)
    }

}

export {
    ISFViewer
}
