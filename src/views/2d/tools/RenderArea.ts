import Konva from "konva";
function getRandomHexColor() {
    // 生成一个随机的 6 位十六进制颜色代码
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

function renderArea(pointsList: any, areaIdList: any, group: Konva.Group) {


    if (!areaIdList) return

    areaIdList.forEach((ids: any) => {

        let _points: any = []

        ids.forEach((id: string) => {
            let point = pointsList.find((pt: any) => pt.pid == id)

            if (point) {
                _points.push(point.point)
            }
        });

        if (_points.length) {
            let line = new Konva.Line({
                points: _points.flat(),
                fill: getRandomHexColor(),
                stroke: '#f00',
                strokeWidth: 2,
                closed: true,
                opacity: 0.2
            })
            group.add(line)
        }

    });


}

export {
    renderArea,
    getRandomHexColor
}
