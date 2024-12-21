import Konva from "konva";

class RenderLines {


    private _layer: Konva.Layer
    private _stage: Konva.Stage

    private _group: Konva.Group

    private _enabled = false

    public allData: any = []
    private drawData: any = []

    private mouseMovePosition: any = undefined

    constructor(stage: Konva.Stage, layer: Konva.Layer) {

        this._stage = stage
        this._group = new Konva.Group()


        this._layer = layer

        this._layer.add(this._group)




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

    private renderLine = (lineData: any) => {


        const line = new Konva.Line({
            stroke: 'blue',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: false,
            points: lineData.map((item: any) => item.point).flat()
        });
        line.listening(false);
        this._group.add(line)
    }

    private onClick = (event: any) => {

        if (this.mouseMovePosition) {
            this.drawData.push(this.mouseMovePosition)
        }

        if (this.drawData.length == 2) {
            this.allData.push(this.drawData.slice())

            this.renderLine(this.drawData)
            this.drawData = []
        }


    }

    private onMouseMove = (e: any) => {
        const mousePos: any = this._stage.getPointerPosition();

        // 使用 getIntersection() 检测鼠标位置下的对象
        const shapeUnderMouse = this._stage.getIntersection(mousePos);

        if (shapeUnderMouse) {
            this.mouseMovePosition = {
                pid: shapeUnderMouse.getAttr('pid'),
                point: [shapeUnderMouse.x(), shapeUnderMouse.y()]
            }

        } else {
            this.mouseMovePosition = undefined
        }
    }

    bindEvent() {
        this._stage.on('click', this.onClick)

        this._stage.on('mousemove', this.onMouseMove)
    }
    removeEvent() {
        this._stage.off('click', this.onClick)
    }

    dispose() {
        this.removeEvent()
    }
}

export {
    RenderLines
}
