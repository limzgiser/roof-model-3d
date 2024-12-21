
import EventEmitter3 from 'eventemitter3'
import { ISFViewer } from './ISFViewer'

class Application extends EventEmitter3 {


    private _viewer: ISFViewer

    private _options: any

    get viewer() {

        return this._viewer
    }
    constructor(options: any) {
        super()
        this._options = options
        this.init()
    }

    private init() {
        this._viewer = new ISFViewer(this._options)
    }

}

export {
    Application
}
