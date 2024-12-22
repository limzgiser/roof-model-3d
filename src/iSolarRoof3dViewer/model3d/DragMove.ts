import * as THREE from 'three'
import { ISFEngine } from '../Engine'
import { MOUSE_MOVE_EVENT } from '../Constant'

class DragMove {


    private domElement: HTMLElement
    private mouse: any = { x: 0, y: 0 }

    private mouseDown = false
    private prevMouseY = 0;

    private currentPoint: any = undefined
    private _enabled = false
    private selectMesh: any = undefined
    private engine: ISFEngine

    private udpate = (data: any) => { }

    constructor(engine: ISFEngine, update: any = (data: any) => { }) {
        this.engine = engine
        this.domElement = engine.root

        this.udpate = update
    }


    get enabled() {
        return this._enabled
    }


    set enabled(value) {

        if (value == this._enabled) return

        if (value) {
            this.bindEvent()
        } else {
            this.removeEvent()
        }

        this._enabled = value
    }



    private _pointerMove = (event: any) => {

        if (!this.selectMesh) {
            return
        }

        if (this.selectMesh && this.currentPoint && this.mouseDown) {

            const currentY = event.clientY;  // 获取当前鼠标的Y坐标

            let dir = 0
            if (currentY < this.prevMouseY) {
                dir = 1
            } else if (currentY > this.prevMouseY) {
                dir = -1
            }

            this.prevMouseY = currentY;  // 更新上次的Y坐标

            this.selectMesh.position.z += dir * 0.01;

            this.udpate(Object.assign(this.selectMesh.userData, { position: this.selectMesh.position }))

        }

    }

    private onMouseMove = (data: any) => {

        if (this.selectMesh && this.mouseDown) return

        if (!data) {
            this.selectMesh = undefined
            document.body.style.cursor = 'default';
            return
        }
        const mesh = data?.data?.object

        if (mesh.userData.featureType == 'point') {
            document.body.style.cursor = 'pointer';
            this.selectMesh = mesh
        } else {
            document.body.style.cursor = 'default';
            this.selectMesh = undefined
        }

        this.currentPoint = data.data.point
    }

    private _pointerDown = (event: MouseEvent) => {


        if (this.selectMesh) {
            this.engine.enabledControls(false)
            this.prevMouseY = event.clientY;
            this.mouseDown = true
        }


    }

    private _pointerUp = () => {

        this.engine.enabledControls(true)

        this.selectMesh = undefined
        this.mouseDown = false
    }


    public bindEvent = () => {

        this.domElement.addEventListener('pointerdown', this._pointerDown, false)
        this.domElement.addEventListener('pointerup', this._pointerUp, false)
        this.domElement.addEventListener('pointermove', this._pointerMove, false)

        this.engine.on(MOUSE_MOVE_EVENT, this.onMouseMove)

    }

    private removeEvent = () => {

        this.domElement.removeEventListener('pointerdown', this._pointerDown, false)
        this.domElement.removeEventListener('pointerup', this._pointerUp, false)
        this.domElement.removeEventListener('pointermove', this._pointerUp, false)
    }

}
export {
    DragMove
}
