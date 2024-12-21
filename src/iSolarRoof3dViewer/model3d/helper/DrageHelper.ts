import * as THREE from 'three'

import { getMaxEdge, getMaxLengthLine, getPointToAreaLineNotZero } from "../tool"

class DragHelper {


    private _lockInfo: any = []


    private data: any = null

    private pointMap: any = {}
    private areaMap: any = {}

    get points() {
        if (!this.data) return []

        return this.data.points
    }

    get roof() {
        if (!this.data) return []

        return this.data.roof
    }



    get areas() {
        if (!this.data) return []
        return this.data.areas
    }

    get lines() {
        if (!this.data) return []
        return this.data.lines
    }


    get lockInfo() {
        return this._lockInfo
    }

    constructor() {

    }


    // 当前点是否为屋顶点
    private isRoofPoint(pid: string) {
        return this.roof.includes(pid)
    }

    // 判断两点是不是屋顶边
    private lineIsRoofEdge(pid1: string, pid2: string) {



        let vertices = this.roof.map((id: string) => this.pointMap[id].point)
        let point1 = this.pointMap[pid1].point
        let point2 = this.pointMap[pid2].point


        for (let i = 0; i < vertices.length; i++) {
            const p1 = vertices[i];
            const p2 = vertices[(i + 1) % vertices.length];

            if ((point1[0] === p1[0] && point1[1] === p1[1] && point1[2] === p1[2] &&
                point2[0] === p2[0] && point2[1] === p2[1] && point2[2] === p2[2]) ||
                (point1[0] === p2[0] && point1[1] === p2[1] && point1[2] === p2[2] &&
                    point2[0] === p1[0] && point2[1] === p1[1] && point2[2] === p1[2])) {
                return true;
            }
        }
        return false;

    }

    // 获取点所在的平面
    private getPointAreas = (pid: string) => {
        return this.areas.filter((ipoits: any) => ipoits.points.includes(pid))
    }



    /**
     * @param pid 当前移动点
     * @param areaId 点对应的一个面
     */
    private getPoitAreaLockLine(pid: string, areaId: string) {

        let result = null

        let pointInfo = this.pointMap[pid]
        let areaInfo = this.areaMap[areaId]
        let areaPoints = areaInfo.points.map((id: string) => {
            const _point = this.pointMap[id]
            return {
                pid: id,
                point: new THREE.Vector3(..._point.point)
            }
        })

        const getPointLines = () => {

            // 获取和当前点共面的所有边，去除相邻边
            let edges = getPointToAreaLineNotZero({
                pid: pid,
                point: new THREE.Vector3(...pointInfo.point)
            }, areaPoints)

            return edges
        }

        // 按照规则获取过滤出锁定边
        const filterLine = (pid: string, lines: Array<any>) => {

            if (lines && lines.length == 1) return lines[0]
            if (!lines || lines.length !== 2) return

            if (this.isRoofPoint(pid)) {
                // 找非屋边锁定
                //TODO::里面可能有多条记录，随机先选一条
                result = lines.find((item: any) => { return !this.lineIsRoofEdge(item[0].pid, item[1].pid) })
            } else {
                // 找屋边锁定

                result = lines.find((item: any) => { return this.lineIsRoofEdge(item[0].pid, item[1].pid) })
            }

            if (!result) {

                result = getMaxLengthLine(lines)

            }
            return result
        }

        // 获取非屋顶点的旋转线
        const pointLines = getPointLines()

        if (!pointLines || !pointLines.length) return

        return filterLine(pid, pointLines)
    }


    private setMap() {
        this.points.forEach((point: any) => {
            this.pointMap[point.pid] = point
        });

        this.areas.forEach((area: any) => {
            this.areaMap[area.pid] = area
        });
    }
    /**
     * 遍历所有顶点，获取顶点移动的关联关系
     * 
     * 1.如果当前顶点，是屋顶边上的顶点，选取非屋顶边上边作为固定边。然后计算边长度最长的边作为旋转边。
     * 2.如果当前点，不是屋顶边上的点，选区屋顶边作为固定边，然后计算长度最长的边作为旋转边。
     * 2.
     */

    public preproces(data: any) {


        this._lockInfo = []
        this.pointMap = {}
        this.areaMap = {}

        this.data = data

        this.setMap()

        this.points.forEach((pointInfo: any) => {
            let { pid } = pointInfo

            const pAreas = this.getPointAreas(pid)
            pAreas.forEach((area: any) => {
                const res = this.getPoitAreaLockLine(pid, area.pid)

                if (res) {
                    this.lockInfo.push({
                        pointId: pid,
                        areaId: area.pid,
                        lockLine: res
                    })
                }
            });

        });

    }

    getLockLine(pid: string, areaId: string) {
        return this._lockInfo.find((item: any) => item.pointId === pid && item.areaId === areaId)
    }

}

export {
    DragHelper
}
