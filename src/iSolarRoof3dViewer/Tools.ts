import * as THREE from 'three';
import { LAYER_TYPE } from './Constant';

/**
 * 空间任意两点为中轴线，绘制长方体，所需要的变换矩阵
 * @param {*} startPoint 
 * @param {*} endPoint 
 * @param {*} upDirection 绘制轴向体的方向 ，默认(0,0,1)
 * @example
 *  const height = startPoint.distanceTo(endPoint);
 *  const geometry = new THREE.BoxGeometry(2,height, 2); // 注意轴向，z-up还是 y-up，本场景默认是y-up
 *  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 绿色
 *  const cube = new THREE.Mesh(geometry, material);
 *  cube.position.set(centerPoint.x, centerPoint.y, centerPoint.z);
 *  const quaternion = getCubeMatrixBySegmentPoint(startPoint，endPoint)
 *  cube.applyQuaternion(quaternion);
 *  scene.add(cube)
 * @returns 
 */
const getCubeMatrixBySegmentPoint = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, upDirection?: THREE.Vector3) => {

    const sartToEndDirection = endPoint.clone().sub(startPoint).normalize();
    const direction = upDirection || new TcEE.Vector3(0, 0, 1); // 注意轴向 z-up (0 , 0 ,1)

    const angle = sartToEndDirection.angleTo(direction);

    const normalVector = new THREE.Vector3();
    normalVector.crossVectors(sartToEndDirection, direction);

    const normal = normalVector.normalize();

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(normal, -angle);

    return quaternion
}

const createWaterCube = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, lineLong: number, lineWide: number, material: any) => {

    const deep = startPoint.distanceTo(endPoint);
    const width = lineLong
    const height = lineWide

    const shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.lineTo(width / 3, 0)
    shape.lineTo(width / 3, height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(-width / 2, -height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.lineTo(-width / 3, height / 2);
    shape.lineTo(-width / 3, 0);
    shape.lineTo(0, 0);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: deep,
        bevelEnabled: false, //禁止倒角,默认true
    });

    const mesh = new THREE.Mesh(extrudeGeometry, material);

    mesh.rotateX(Math.PI / 2)
    mesh.translateZ(-deep / 2)

    const group = new THREE.Group()
    group.add(mesh)

    const centerPoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    group.position.set(centerPoint.x, centerPoint.y, centerPoint.z);

    const quaternion = getCubeMatrixBySegmentPoint(startPoint, endPoint, new THREE.Vector3(0, 1, 0))

    group.applyQuaternion(quaternion);

    return group

}

const createCube = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, lineLong: number, lineWide: number, material: any, propities: any = {}) => {

    const deep = startPoint.distanceTo(endPoint);

    const width = lineLong
    const height = lineWide

    const geometry = new THREE.BoxGeometry(width, height, deep);
    const cube = new THREE.Mesh(geometry, material);

    const centerPoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    cube.position.set(centerPoint.x, centerPoint.y, centerPoint.z);

    const quaternion = getCubeMatrixBySegmentPoint(startPoint, endPoint)


    if (propities) {
        const { name, angle, position } = propities
        if (name == '次梁') {
            let _angle = angle || 0

            if (position == 2) {
                _angle = -angle || 0
            }
            cube.rotateZ(_angle * Math.PI / 180)
        }
    }
    cube.applyQuaternion(quaternion);

    return cube
}

const createCom = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, lineLong: number, lineWide: number, materials: any) => {

    const deep = startPoint.distanceTo(endPoint);

    const width = (lineLong)
    const height = (lineWide)

    const geometry = new THREE.BoxGeometry(width, height, deep);
    const cube = new THREE.Mesh(geometry, materials);

    const centerPoint = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    cube.position.set(centerPoint.x, centerPoint.y, centerPoint.z);

    const quaternion = getCubeMatrixBySegmentPoint(startPoint, endPoint)

    cube.applyQuaternion(quaternion);

    return cube
}
const getVPoint = (x: number, y: number, z: number) => {
    return new THREE.Vector3(toMeter(x), toMeter(y), toMeter(z))
}

const toMeter = (value: number) => {
    return +value / 1000
}


const setLayerType = (obj: any, type: string) => {

    if (!obj) return

    if (obj instanceof THREE.Group) {

        obj.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                child.userData.layerType = type
            }
        });
    }
    if (obj instanceof THREE.Mesh) {
        obj.userData.layerType = type
    }
}

export {

    getCubeMatrixBySegmentPoint,
    toMeter,
    createWaterCube,
    createCube,
    getVPoint,
    createCom,
    setLayerType
}
