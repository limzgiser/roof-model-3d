import * as THREE from 'three'
import { createPolygonMesh } from './tool'
import { COLORS } from './Constant'


class DragPoint {



    constructor() {

    }
    private computeNormalVector(p1: Array<number>, p2: Array<number>, p3: Array<number>) {
        const v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        const v2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

        // 叉积计算法向量
        const normal = [
            v1[1] * v2[2] - v1[2] * v2[1],  // A
            v1[2] * v2[0] - v1[0] * v2[2],  // B
            v1[0] * v2[1] - v1[1] * v2[0]   // C
        ];

        return normal;
    }
    private solveZCoordinateOnPlane(plane: any, x: number, y: number) {
        const { A, B, C, D } = plane;

        // 代入平面方程，解出 z
        return (D - A * x - B * y) / C;
    }

    private planeEquation(normal: Array<number>, point: Array<number>) {
        const [A, B, C] = normal;
        const [x1, y1, z1] = point;

        // 平面方程: A(x - x1) + B(y - y1) + C(z - z1) = 0
        const D = A * x1 + B * y1 + C * z1;

        return { A, B, C, D };
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

    private updateHeightsRef = (plane: any, updatePoints: Array<{ point: THREE.Vector3, pid: number }>) => {

        let result: any = []

        // 更新 p2 和 p5 的高度
        updatePoints.forEach(p => {


            const P2 = [
                p.point.x,
                p.point.y
            ]
            let resZ = this.solveZCoordinateOnPlane(plane, P2[0], P2[1]);

            result.push({
                pid: p.pid,
                point: {
                    x: P2[0],
                    y: P2[1],
                    resZ
                }
            })

        });

        return result
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
        movePoint: { point: any, pid: number },
        lockPoint1: { point: any, pid: number },
        locakPoint2: { point: any, pid: number }) {


        const P1 = [...movePoint.point];
        const P2 = [...lockPoint1.point];
        const P3 = [...locakPoint2.point];


        // 计算向量叉积
        function crossProduct(v1: any, v2: any) {
            return [
                v1[1] * v2[2] - v1[2] * v2[1],  // A
                v1[2] * v2[0] - v1[0] * v2[2],  // B
                v1[0] * v2[1] - v1[1] * v2[0]   // C
            ];
        }

        function planeEquation(p2: any, p3: any, p4: any) {
            const v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];  // P3 - P2
            const v3 = [p4[0] - p2[0], p4[1] - p2[1], p4[2] - p2[2]];  // P4 - P2
            const normal = crossProduct(v2, v3);  // 叉积计算法向量
            const [A, B, C] = normal;
            const D = A * p2[0] + B * p2[1] + C * p2[2];  // 计算D值
            return { A, B, C, D };
        }

        // 计算修改后的P4的z坐标
        function solveZ4(plane: any, p4: any) {
            const { A, B, C, D } = plane;
            const z4 = (D - A * p4[0] - B * p4[1]) / C;  // 解z4
            return z4;
        }
        const plane = planeEquation(P1, P2, P3);

        // const normal = this.computeNormalVector(P1, P2, P3);
        // const plane = this.planeEquation(normal, P1);
        // let result: Array<any> = this.updateHeightsRef(plane, updatePoints);

        let result: any = []
        // 更新 p2 和 p5 的高度
        updatePoints.forEach(p => {


            const P2 = [
                p.point.x,
                p.point.y,
                p.point.z
            ]
            let resZ = solveZ4(plane, P2);

            result.push({
                pid: p.pid,
                point: {
                    x: P2[0],
                    y: P2[1],
                    z: resZ
                }
            })

        });


        return result.filter((item: any) => ![movePoint.pid, lockPoint1.pid, locakPoint2.pid].includes(item.pid))

    }
}

export {
    DragPoint
}
