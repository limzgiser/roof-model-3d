
import { getRandomHexColor } from '../../views/2d/tools/RenderArea';
import earcut from 'earcut'
import * as THREE from 'three'

const pickPoint = (scene: any, point: THREE.Vector3, direction: THREE.Vector3) => {


    const rayOrigin = point;
    const rayDirection = direction.normalize();

    const ray = new THREE.Ray(rayOrigin, rayDirection);

    // 创建 Raycaster 实例
    const raycaster = new THREE.Raycaster();
    raycaster.ray = ray; // 将我们的射线赋值给 raycaster

    const objects: any = [];
    scene.traverse((child: any) => {
        if (child.userData.featureType == 'point') {
            objects.push(child);
        }
    });

    // 计算射线与物体的交点
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        return intersects[0]
    }
}


const createPolygonMesh = (vertices: Array<THREE.Vector3>, color = "#f00") => {

    const bufferGeom = new THREE.BufferGeometry();

    let points: Array<number> = []

    vertices.forEach((item => {
        points.push(item.x, item.y, item.z)
    }))


    const indices = earcut(points, null, 3);
    const positions = new Float32Array(points);

    bufferGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const indexs = new Uint16Array(indices);

    bufferGeom.index = new THREE.BufferAttribute(indexs, 1);

    // bufferGeom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const material = new THREE.MeshBasicMaterial({
        // map: texture,
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    return new THREE.Mesh(bufferGeom, material);
}

// 
const getPointToAreaLineNotZero = (point: { pid: string, point: THREE.Vector3 }, area: Array<any>) => {
    let result: any = []
    let tmpArr = area.slice()
    tmpArr.push(area[0])

    for (let i = 0; i < tmpArr.length - 1; i += 1) {

        const dis = distancePointToSegment(point.point, tmpArr[i].point, tmpArr[i + 1].point)

        if (+dis.toFixed(8) > 0) {
            result.push([tmpArr[i], tmpArr[i + 1]])
        }
    }

    return result
}


const getMaxEdge = (point: { pid: string, point: THREE.Vector3 }, area: Array<any>) => {
    let result: any = [

    ]
    let distance = 0;
    let tmpArr = area.slice()

    tmpArr.push(area[0])

    for (let i = 0; i < tmpArr.length - 1; i += 1) {

        const dis = distancePointToSegment(point.point, tmpArr[i].point, tmpArr[i + 1].point)

        if (dis > distance) {
            distance = dis
            result = [tmpArr[i], tmpArr[i + 1]]
        }
    }

    return result
}


const distancePointToSegment = (point: THREE.Vector3, segmentStart: THREE.Vector3, segmentEnd: THREE.Vector3) => {
    // 计算边的向量
    const segmentVector = new THREE.Vector3().subVectors(segmentEnd, segmentStart);
    // 计算点到起始点的向量
    const pointVector = new THREE.Vector3().subVectors(point, segmentStart);
    // 计算边的单位向量
    let segmentLengthSquared = segmentVector.lengthSq();

    if (!segmentLengthSquared || isNaN(segmentLengthSquared)) return 0
    segmentLengthSquared = isNaN(segmentLengthSquared) ? 1 : segmentLengthSquared
    const t = segmentVector.dot(pointVector) / segmentLengthSquared;

    // 判断投影是否在线段内
    const clampedT = Math.max(0, Math.min(1, t));

    // 计算投影点
    const projection = segmentStart.clone().add(segmentVector.clone().multiplyScalar(clampedT));

    // 返回点到边的距离
    return point.distanceTo(projection);
}

// const arraysAreEqual = (arr1: Array<string>, arr2: Array<string>) => {
//     if (arr1.length !== arr2.length) {
//         return false;
//     }

//     const set1 = new Set(arr1);
//     const set2 = new Set(arr2);

//     if (set1.size !== set2.size) {
//         return false;
//     }

//     for (let item of set1) {
//         if (!set2.has(item)) {
//             return false;
//         }
//     }

//     return true;
// }
const calculateDistance3D = (point1: any, point2: any) => {


    const dx = (point2[0] || point2.x) - (point1[0] || point1.x); // x 坐标差
    const dy = (point2[1] || point2.y) - (point1[1] || point1.y); // y 坐标差
    const dz = (point2[2] || point2.z) - (point1[2] || point1.z); // z 坐标差

    // 欧几里得距离公式
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return distance;
}

const getMaxLengthLine = (lines: any) => {
    if (!lines || !lines.length) return

    let result = null
    let dis = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const tmpDis = calculateDistance3D(line[0].point, line[1].point)

        if (i == 0) {
            result = line
            dis = tmpDis
        } else {
            if (tmpDis > dis) {
                result = line
                dis = tmpDis
            }
        }

    }

    return result

}

export {
    pickPoint,
    createPolygonMesh,
    getMaxEdge,
    distancePointToSegment,
    getPointToAreaLineNotZero,
    calculateDistance3D,
    getMaxLengthLine

}
