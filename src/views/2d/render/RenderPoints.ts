import Konva from "konva";

class RenderPoints {


    private _layer: Konva.Layer
    private _stage: Konva.Stage

    private _group: Konva.Group

    private _enabled = false

    public data: any = []

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


    private onClick = (event: any) => {
        const mousePos: any = this._stage.getPointerPosition();

        const circle = new Konva.Circle({
            x: mousePos.x,
            y: mousePos.y,
            radius: 8,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
        });
        let pid = Math.random().toString(36).substring(2, 9)
        circle.setAttr('pid', pid)

        this.data.push({
            pid,
            point: [mousePos.x, mousePos.y]
        })
        circle.on('mouseover', () => {
            document.body.style.cursor = 'crosshair';  // 改变鼠标为移动形状
        });

        // 监听鼠标移出事件，恢复为默认鼠标形状
        circle.on('mouseout', () => {
            document.body.style.cursor = 'default';
        });

        // 将圆形添加到图层
        this._group.add(circle);
    }

    bindEvent() {
        this._stage.on('click', this.onClick)
    }
    removeEvent() {
        this._stage.off('click', this.onClick)
    }

    dispose() {
        this.removeEvent()
    }
}

export {
    RenderPoints
}
