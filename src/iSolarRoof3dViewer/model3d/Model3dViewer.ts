
import * as THREE from 'three'
import { } from '../Tools'
import { ROOF_HEIGHT } from '../Constant'
import { data } from '../mock/Mock'
import { getAreaPoint } from '../mock/Tools'
import { ISFEngine } from '../Engine'
import { DragMove } from './DragMove'
import { cloneDeep } from 'lodash'
import { createPolygonMesh, createRoof, getMaxEdge } from './tool'
import { COLORS } from './Constant'
import { DragPoint } from './DragPoint'
import { DragHelper } from './helper/DrageHelper'

class Model3dViewer {


    public drawIngData: any = null

    private engine: ISFEngine

    private drageMove: DragMove

    private group: THREE.Group

    private roofGroup: THREE.Group

    private dragHelper: DragHelper = new DragHelper()

    private movedPoint: any = {

    }

    // private transformInfo = {
    //     '111':{
    //         areaIndex:0,
    //         lockLine:[id1,id2]
    //     },

    // }

    private lockedLine = [
        // {
        //     pid:'',
        //     areaIndex:'',
        //     lockLine:[pid1,pid2]
        // }
    ]

    constructor(engine: ISFEngine) {

        this.engine = engine

        this.group = new THREE.Group()
        this.roofGroup = new THREE.Group()

        this.engine.scene.add(this.group)

        this.engine.scene.add(this.roofGroup)

        this.init()
    }
    public renderRoof = (roofData: any) => {


        let roofTopArea = roofData.roof.map((id: any) => roofData.points.find((pt: any) => pt.pid == id).point)
        let points: any = [];

        roofTopArea.forEach((p: any) => {
            points.push(new THREE.Vector3((p[0]), (p[1]), p[2]))
        })
        let mesh: any = createRoof(points, 'yellow')

        this.group.add(mesh)

    }

    public renderArea(data: any) {

        const _data = getAreaPoint(data)

        _data.forEach((area: any, index: number) => {

            let points: any = [];

            area.forEach((p: any) => {
                points.push(new THREE.Vector3((p[0]), (p[1]), p[2]))
            })

            let mesh = createPolygonMesh(points, COLORS[index % COLORS.length - 1])
            mesh.scale.y = -1
            this.group.add(mesh)

        })

    }

    public renderPoint(data: any) {
        let points = data.points

        points.forEach((point: any) => {


            const geometry = new THREE.SphereGeometry(0.005, 16, 16);
            const material = new THREE.MeshPhongMaterial({ color: 0x0077ff, opacity: 0.2 });
            const sphere = new THREE.Mesh(geometry, material);

            sphere.position.x = (point.point[0])
            sphere.position.y = (-point.point[1])
            sphere.position.z = point.point[2]

            sphere.userData = {
                featureType: 'point',
                _id_: point.pid,
                position: sphere.position
            }

            this.group.add(sphere)
        });
    }

    public updateLoackLine = () => { }

    public rectify(_data: any) {
        // 纠正直接关联的面，如果一个面有三个点是移动的。那么纠正该面其他点
        if (!data) return

        let movedPoint = Object.keys(this.movedPoint)
        _data.areas.forEach((area: any) => {
            let points = area.points

            let updatedPoints = points.filter((pp: string) => movedPoint.includes(pp))

            if (updatedPoints.length >= 3) {
                let [p1, p2, p3] = updatedPoints

                let areaPoints = area.points.map((id: string) => {
                    const _point = _data.points.find((a: any) => a.pid == id).point
                    return {
                        pid: id,
                        point: new THREE.Vector3(..._point)
                    }
                })

                let pont1 = _data.points.find((ii: any) => ii.pid == p1)
                let pont2 = _data.points.find((ii: any) => ii.pid == p2)
                let pont3 = _data.points.find((ii: any) => ii.pid == p3)
                const result = new DragPoint().update(areaPoints, pont1, pont2, pont3)
                this.updatePointsValue(_data, result)
            }
        });


    }
    private updatePointsValue = (data: any, list: Array<any>) => {

        if (!list || !list.length) return
        list.forEach(pt => {
            let pointInfo = data.points.find((oldPt: any) => oldPt.pid == pt.pid)
            if (pointInfo) {
                pointInfo.point = [pt.point.x, pt.point.y, pt.point.z]
                this.movedPoint[pointInfo.pid] = true
            }
        })
    }


    public updateOtherPoint = (_data: any, pInfo: any) => {

        /**
         * 1.获取当前点所在的面
         * 2.遍历面，获取当前点的固定轴
         * 3.更新当前点，关联的移动点
         * 
         * 备注，移动过程中会实时计算旋转轴，旋转轴应该在出事时候固定
         */

        const { point: movePoint, pid: id } = pInfo
        const areas = _data.areas.filter((item: any) => item.points.includes(id))
        this.movedPoint[pInfo.pid] = true
        if (!areas || !areas.length) return



        for (let i = 0; i < areas.length; i++) {
            const areaIds = areas[i].points;
            let areaPoints = areaIds.map((id: string) => {
                const _point = _data.points.find((a: any) => a.pid == id).point
                return {
                    pid: id,
                    point: new THREE.Vector3(..._point)
                }
            })

            let edgeInfo = this.dragHelper.getLockLine(id, areas[i].pid)
            if (!edgeInfo) continue

            const edge = edgeInfo.lockLine

            if (!edge || !edge.length) {
                continue
            }

            const _edge = edge

            const edgep1 = _data.points.find((a: any) => a.pid == _edge[0].pid).point
            const edgep2 = _data.points.find((a: any) => a.pid == _edge[1].pid).point

            _edge[0].point = new THREE.Vector3(...edgep1)
            _edge[1].point = new THREE.Vector3(...edgep2)

            const result = new DragPoint().update(areaPoints, pInfo, edge[0], edge[1])

            this.updatePointsValue(_data, result)

            this.rectify(_data)

        }

    }

    public init() {

        let open = false
        let thisData = data

        if (open) {
            thisData = window['_data_']
        }

        if (!thisData) return

        this.renderArea(thisData)

        this.renderPoint(thisData)
        this.renderRoof(thisData)
        this.dragHelper.preproces(thisData)

        if (!this.drageMove) {
            this.drageMove = new DragMove(this.engine, (pointMesh: any) => {

                this.movedPoint = {}
                const userData = pointMesh

                let _data = cloneDeep(this.drawIngData || thisData)
                let p: any = _data.points.find((item: any) => item.pid == userData._id_)

                p.point[2] = userData.position.z


                this.updateOtherPoint(_data, p)

                this.engine.disposeGroup(this.group)

                this.renderArea(_data)
                this.renderPoint(_data)
                this.renderRoof(_data)
                this.drawIngData = _data


            })

        }

        this.drageMove.enabled = true


        // this.test()
    }
}

export {
    Model3dViewer
}
