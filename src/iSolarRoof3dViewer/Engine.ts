import { EventEmitter } from "eventemitter3";

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { traits } from 'traits-decorator';

import { CAMERA_MAX_DISTANCE, CAMERA_MIN_DISTANCE, CAMERA_POSITION, LAYER_TYPE, MOUSE_MOVE_EVENT, OBS_TYPE, ROOF_HEIGHT } from "./Constant";



import * as Stats from 'stats.js'

import { createSky } from "./ext/skybox/Skybox";
import { toMeter } from "./Tools";

import { booleanPointInPolygon, point, polygon } from "@turf/turf";
import { Model3dViewer } from "./model3d/Model3dViewer";



class ISFEngine extends EventEmitter {
    [x: string]: any;

    private _scene: THREE.Scene

    private _style: any = null

    private controls: any

    private axesHelper: THREE.AxesHelper

    private _camera: THREE.Camera
    private roofBox: THREE.Box3
    private initCameraPosition: THREE.Vector3
    private _renderer: any
    private _root: HTMLElement


    private model3dViewer: Model3dViewer
    private _globeConfig: any = null

    private stats: any = null

    get config() {
        return this._globeConfig
    }
    get roofData() {
        return this.style.data.find((item: any) => item.type == LAYER_TYPE.ROOF)
    }

    get camera(): THREE.Camera {
        return this._camera
    }

    get scene(): THREE.Scene {
        return this._scene
    }
    get root(): any {
        return this._root
    }

    get renderer() {
        return this._renderer
    }

    get style() {
        return this._style
    }

    get boundingClientRect() {
        return this._root.getBoundingClientRect()
    }

    constructor(options: any) {
        super();
        this._options = options
        this._root = options.domElement

        this.createViewer()


        this.model3dViewer = new Model3dViewer(this)

        this.enabledStats()
        this.enableAxes(true)

        this.bindEvent()

    }

    private enabledStats = () => {
        this.stats = new Stats();

        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '20px';
        this.stats.domElement.style.right = '20px';
        this.stats.domElement.style.left = 'auto';
        document.body.appendChild(this.stats.domElement);

    }


    // TODO: ref 
    /**
     * 获取低楼高度
     */
    public getBaseRoofHight() {
        const roof = this.roofData

        if (!roof) return 0
        const coordiantes = roof.data.geometry.coordiante

        if (!coordiantes || coordiantes.length < 2) return 0


        const getHightRoof = () => {

            const sortHeightRoof = coordiantes.sort(((a: any, b: any) => a.height - b.height))

            return sortHeightRoof
        }

        const sortedRoof = getHightRoof()


        if (!sortedRoof || !sortedRoof.length) return 0


        return sortedRoof[0].height

    }

    // TODO: ref 
    public checkObsInRoof(obsData: any) {

        const roof = this.roofData

        if (!roof) return 0
        const coordiantes = roof.data.geometry.coordiante

        if (!coordiantes || !coordiantes.length) return false


        const { obstacleCoordinate: { x, y }, obstacleLenth, obstacleWidth } = obsData

        const inRoof = coordiantes.some((item: any) => {
            const pt = point([x + obstacleLenth / 2, y - obstacleWidth / 2]);


            const points = item.points.map((item: any) => [item.x, item.y])
            points.push(points[0])
            const poly = polygon([points]);
            return booleanPointInPolygon(pt, poly);
        })


        return inRoof

    }

    public add3DStyle(style: any) {

        if (!style) return
        const { data, config } = style
        this._globeConfig = config

        this._style = style

        data.forEach((element: any) => this.addLayer(element));
    }

    /**
     *  根据图层类型显示隐藏图层
     * @param type 
     * @param visible 
     */
    public toggleLayerByType(type: LAYER_TYPE, visible: boolean) {

        if (type == LAYER_TYPE.COMPONENT) {
            this.coms && this.coms.toggle(visible)
        }
    }

    private getObsByType(type: OBS_TYPE) {
        const obsList = this.style.data.filter((item: any) => item.type == LAYER_TYPE.OBSTACLE)

        let probeObs = []
        if (obsList && obsList.length && obsList[0].data) {
            probeObs = obsList[0].data.filter((item: any) => item.obstacleType == type)
        }

        return probeObs

    }


    public renderRoof = (roofData: any) => {


        this.model3dViewer.init()
    }
    public addLayer(options: any) {
        if (!options) return


        // 下探障碍物
        let probeObs = this.getObsByType(OBS_TYPE.Probe)


        const { type, data } = options

        if (type == LAYER_TYPE.ROOF) {

            this.roofLayer.render(data, probeObs)
        }

        /**支架 */

        if (type == LAYER_TYPE.BRANCKET) {
            this.brackets.render(data)
        }

        /**水槽 */

        if (type == LAYER_TYPE.WATER_TANK) {
            this.waterTank.render(data)
        }

        /**组件 */

        if (type == LAYER_TYPE.COMPONENT) {
            this.coms.render(data)
        }

        // /**障碍物 */
        // if (type == LAYER_TYPE.OBSTACLE) {

        //     this.obs.render(data, probeObs)
        // }

        /**柱脚 */
        if (type == LAYER_TYPE.BASE_COLUMN) {
            this.baseColumn.render(data)
        }

        /**女儿墙 */
        if (type == LAYER_TYPE.PARPET_WALL) {
            this.parapetWall.render(data, probeObs)
        }
    }

    public update() { }

    public toMeter(value: number) {
        return value / 1000
    }

    public resize() {

        if (!this.camera) return
        const { width, height } = this.boundingClientRect;

        (this.camera as any).aspect = width / height;
        (this.camera as any).updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private _createScene() {
        this._scene = new THREE.Scene();
    }

    private _createCamera() {
        const { width, height } = this.boundingClientRect
        this._camera = new THREE.PerspectiveCamera(75, width / height, 0.001, 3000);

        this.camera.up.set(0, 0, 1);

        this.camera.position.x = CAMERA_POSITION.x;
        this.camera.position.y = CAMERA_POSITION.y;
        this.camera.position.z = CAMERA_POSITION.z;

    }
    /**
     * 开启/禁用 坐标轴
     * @param enabled 
     */
    public enableAxes(enabled: boolean) {
        if (!this.axesHelper) return
        this.axesHelper.visible = enabled
    }
    /**
      * 开启/禁用 帧率监控
      * @param enabled 
     */
    public enabledStates(enabled: boolean) {
        if (!this.stats) return
        const top = enabled ? '20px' : '-2000px'
        this.stats.domElement.style.top = top
    }

    public rotateCamera(angle: number) {
        if (!this.initCameraPosition) return

        const { x, y, z } = this.initCameraPosition.clone()
        if (angle == 0) {

            this.camera.position.set(x, y, z)
        }
        if (angle == 45) {

            const center = this.roofBox.getCenter(new THREE.Vector3())
            const cameraPos = this.initCameraPosition.clone()
            const distance = cameraPos.distanceTo(center.clone())

            const direction = cameraPos.sub(center).normalize();

            const rotationMatrix = new THREE.Matrix4().makeRotationZ(-Math.PI / 4)
            const rotateDirection = direction.applyMatrix4(rotationMatrix).normalize();

            const res = center.clone().add(rotateDirection.clone().multiplyScalar(distance))
            this.camera.position.set(res.x, res.y, res.z)
        }

    }

    private updateCameraPosition() {
        if (!this.roofBox) return

        const size = this.roofBox.getSize(new THREE.Vector3())
        const cneter = this.roofBox.getCenter(new THREE.Vector3())
        // const distance = Math.max(size.x, size.y, size.z); // 适当的距离
        this.controls?.target.set(cneter.x, cneter.y, cneter.z);

        //TODO::相机初始问题，适配屋顶
        this.camera.position.setX(cneter.x)
        this.camera.position.setY(-size.x)

        this.camera.position.setZ(5)
        this.initCameraPosition = this.camera.position.clone()
    }
    public setCameraInitPosition(box: THREE.Box3) {
        if (!box) return

        this.roofBox = box

        this.updateCameraPosition()

    }

    private _pointerMove = (event: any) => {

        const rect = this.root.getBoundingClientRect()

        const x = (event.offsetX / rect.width) * 2 - 1;
        const y = -(event.offsetY / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);



        const objects: any = [];
        this.scene.traverse((child: any) => {
            if (child.userData.featureType == 'point') {
                objects.push(child);
            }
        });

        const intersects = raycaster.intersectObjects(objects, true);
        if (intersects.length > 0) {

            this.emit(MOUSE_MOVE_EVENT, {
                data: intersects[0]
            })

        } else {
            this.emit(MOUSE_MOVE_EVENT, null)

        }
    }
    private bindEvent = () => {
        this.root.addEventListener('pointermove', this._pointerMove, false)
    }

    private removeEvent = () => {
        this.root.addEventListener('pointermove', this._pointerMove, false)
    }
    public enabledControls(enabled: boolean) {
        this.controls.enabled = enabled;
    }
    private createViewer() {

        this._createScene()
        this._createCamera()

        const { width, height } = this.boundingClientRect
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setSize(width, height);
        this._root.appendChild(renderer.domElement);
        this._renderer = renderer



        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI / 2;
        controls.minDistance = CAMERA_MIN_DISTANCE;
        controls.maxDistance = CAMERA_MAX_DISTANCE;

        this.controls = controls

        // controls.enablePan = true;
        // controls.enableRotate = true;
        this.scene.background = new THREE.Color(0xffffff);

        const axesHelper = new THREE.AxesHelper(1000);

        this.axesHelper = axesHelper
        this.scene.add(axesHelper);


        const ambienLight = new THREE.AmbientLight(0xffffff);

        this.scene.add(ambienLight)

        const dirLight = new THREE.DirectionalLight(0xfefefe, 0.6);

        dirLight.position.set(100, 100, 100);

        this.scene.add(dirLight)

        const skybox = createSky()

        this.scene.add(skybox)

        // 渲染循环
        const animate = () => {
            requestAnimationFrame(animate);
            if (controls.enabled) {
                controls.update();
            }

            this.stats && this.stats.update()
            // 渲染场景
            renderer.render(this.scene, this.camera);
        }

        animate();
    }

    public applyDipHeight = (group: THREE.Group | THREE.Mesh) => {

        if (!group) return


        const dipHeight = this.config?.dipHeight || 0

        group.translateZ(-toMeter(dipHeight))
    }


    public disposeGroup(group: THREE.Group) {
        // 移除所有子对象
        while (group.children.length > 0) {
            const child: any = group.children[0];
            group.remove(child);

            // 如果子对象有几何体和材质，进行清理
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((material: any) => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    }

    public dispose() {
        // 移除所有子对象
        while (this.scene.children.length > 0) {
            const child: any = this.scene.children[0];
            this.scene.remove(child);

            // 如果子对象有几何体和材质，进行清理
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((material: any) => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }

        this.removeAllListeners()
        this.removeEvent()
    }
}

export {
    ISFEngine
}
