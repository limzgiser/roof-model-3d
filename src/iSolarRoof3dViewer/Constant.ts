const CAMERA_CONFIG = {
    NEAR: 0.,
    FAR: 5000
}

const CAMERA_POSITION = {
    x: 0,
    y: -1,
    z: 0.5
}

// 简单屋顶
const SIMPLE_ROOF = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// 高低楼左右房等
const HIGHT_LOW_ROOF = [20, 21, 22, 23, 25, 26]

const CAMERA_MAX_DISTANCE = 500

const CAMERA_MIN_DISTANCE = 0.001

/**
 * 屋顶类型
 */
enum ROOF_TYPE {
    CourtYard_DoubleSlop = 7,  // 院落人字坡 7 
    CourtYard_SingleSlop = 5,  // 院落单坡  
    SunDoubleSlop = 4,         // 阳光房人字坡 4
    SunSingleSlop = 6         //  阳光房单坡 6
}

/**
 * 柱脚类型
 */
enum BASE_COLUMN_TYPE {

    YL_LXZ = 92260,     // 院落人字坡度--螺旋桩
    YL_HNT = 92261,     // 院落人字坡度- 混凝土墩（混凝土地坪厚度≥100）
    YL_HNT_2 = 92262,   // 院落人字坡度-混凝土墩（无地坪或混凝土地坪厚度＜100）
    YL_ZKGZZ = 92272,   //院落-- 钻孔灌注桩
    YGF_DP = 6          // 阳光房单坡
}

enum OBS_TYPE {
    Chimney = 1,                    // 烟囱
    SolarEnergy = 2,                // 太阳能
    WaterTower = 3,                 // 水塔
    Tree = 4,                       // 树
    TelegraphPole = 5,              // 电线杆
    GunTurret = 6,                  // 炮楼
    NeighborFlatRoof = 7,           // 邻居家平屋顶
    UpperPopulation = 8,            // 上人口
    Inverter = 9,                   // 逆变器
    OtherObs = 10,                  // 其他障碍物
    NeighborPitchedRoof = 11,       // 邻居家斜屋顶
    FlatRoof = 12,                  // 平屋顶
    LongitudinalWall = 14,          // 纵墙
    CrossWall = 15,                 // 横墙
    NorthAndSouthPitchedRoof = 16,  // 南北斜屋顶
    EastAndWestPitchedRoof = 17,    //东西斜屋顶
    RectangularOverhangingArea = 18,// 矩形悬空区域
    Doorhole = 21,                  // 门洞
    Probe = 22,                     // 下探障碍物
    SolarPowerNorthAndSouth = 27,   // 南北光伏电站
    SolarPowerEastAndWest = 28,     // 东西光伏电站

    TIAO_JI = 30                    // 条基




}


enum LAYER_TYPE {
    ROOF = 'roof',                  // 屋顶
    BRANCKET = 'brancket',          //支架
    COMPONENT = 'component',        // 组件，
    WATER_TANK = 'water_tank',      // 水槽
    OBSTACLE = 'obstacle',          // 障碍物
    BASE_COLUMN = 'base_column',     // 柱脚

    PARPET_WALL = 'parpet_wall'     // 柱脚
}


const ROOF_HEIGHT = 0.2



const MOUSE_MOVE_EVENT = 'MOUSE_MOVE_EVENT'
export {
    ROOF_TYPE,
    LAYER_TYPE,
    OBS_TYPE,
    BASE_COLUMN_TYPE,
    CAMERA_POSITION,
    CAMERA_CONFIG,


    CAMERA_MAX_DISTANCE,
    CAMERA_MIN_DISTANCE,


    HIGHT_LOW_ROOF,

    SIMPLE_ROOF,
    ROOF_HEIGHT,
    MOUSE_MOVE_EVENT
}
