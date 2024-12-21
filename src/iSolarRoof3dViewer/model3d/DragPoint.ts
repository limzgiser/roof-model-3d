import * as THREE from 'three'
import { createPolygonMesh } from './tool'
import { COLORS } from './Constant'


class DragPoint {



    constructor() {

    }

    private getPlaneEquation = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) => {
        // 计算向量 v1 = p2 - p1 和 v2 = p3 - p1
        const v1 = new THREE.Vector3().subVectors(p2, p1);
        const v2 = new THREE.Vector3().subVectors(p3, p1);
        // 计算法向量 normal = v1 × v2 (叉积)
        const normal = new THREE.Vector3().crossVectors(v1, v2);
        // 计算 D
        const d = -normal.dot(p1);
        return { normal, d };
    };

    private updateHeights = (facePoint: Array<THREE.Vector3>, updatePoints: Array<{ point: THREE.Vector3, pid: number }>) => {

        let result: any = []
        // 计算平面方程
        const { normal, d } = this.getPlaneEquation(facePoint[0], facePoint[1], facePoint[2]);

        // 更新 p2 和 p5 的高度
        updatePoints.forEach(p => {
            // 使用平面方程 Ax + By + Cz + D = 0 求 z
            let tmpP = p.point.clone()
            tmpP.z = (-normal.x * p.point.x - normal.y * p.point.y - d) / normal.z;
            result.push({
                pid: p.pid,
                point: tmpP
            })

        });

        return result
    };


    /**
     * @param updatePoints  需要更新的点
     * @param movePoint 一个面中修改的点
     * @param lockPoint1 
     * @param locakPoint2 
     */
    public update(updatePoints: Array<{ point: THREE.Vector3, pid: number }>,
        movePoint: { point: THREE.Vector3, pid: number },
        lockPoint1: { point: THREE.Vector3, pid: number },
        locakPoint2: { point: THREE.Vector3, pid: number }) {

        let p1 = new THREE.Vector3(...movePoint.point)
        let p2 = new THREE.Vector3(...lockPoint1.point)
        let p3 = new THREE.Vector3(...locakPoint2.point)

        let result: Array<any> = this.updateHeights([p1, p2, p3], updatePoints);
        return result.filter(item => ![movePoint.pid, lockPoint1.pid, locakPoint2.pid].includes(item.pid))

    }
}

export {
    DragPoint
}
