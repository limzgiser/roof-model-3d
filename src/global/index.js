/*
 * @Author: wujian
 * @Date: 2022-10-24 11:00:25
 * @LastEditors: wujian
 * @LastEditTime: 2022-11-23 17:11:31
 * @FilePath: \sungrow\src\global\index.js
 * @Description: 全局数据
 * @email: 281919544@qq.com
 * Copyright (c) 2022 by wujian 281919544@qq.com, All Rights Reserved. 
 */
export const globalData = {
    roofNum: 0,
    roofConfig: {},
    roofScale: 0.01,
    houseHeight: 40,
    subHouseHeight: 0,
    scene: {},
    maxDisList: [], // 斜撑最大距离
    // 主梁配置信息
    mainBeamsConfig: {
        width: 60,
        depth: 120
    },
    // 檩条配置信息
    purlineConfig: {
        width: 80,
        depth: 75
    },
    // 柱脚支架配置信息
    columnConfig: {
        width: 60,
        depth: 60
    },
    columnBracingConfig: {
        width: 60,
        depth: 40
    },
    // 主水槽拼接材质信息
    WaterChannelsConfig1: {
        width: 82,
        depth: 5
    },
    // 主水槽拼接材质信息
    WaterChannelsConfig2: {
        width: 48,
        depth: 5
    },
    // 主水槽拼接材质信息
    WaterChannelsConfig3: {
        width: 10,
        depth: 5
    },
    purlineSolarOffset: 0, // 檩条和组件需要抬高的位置
    waterChannelSolarOffset: 0,//主水槽高度
    pannalStartPositions: [], // 最南端组件坐标
    slopStartPoints: [], // 每个斜屋顶需要的最南坐标(西南 东南 西南投影 东南投影 4个坐标)
    roofsInfo: [],  // 每个屋顶的信息
    hasColumnRoofsInfo: [], // 去除没有柱脚的屋顶信息
    solarPanelConfig: [], // 多方阵组件的配置
    beamsEndPoints: [], // 每个方阵最北的主梁终点
    columnfirstPoinsts: [], // 每个方阵首排首个柱脚点
    roofEquipment: {}, // 屋顶基础参数
    columnfirstRowLastPoinsts: [], // 每个方阵最右边1个柱脚点
    columnRowLeftPoinsts: [], // 每个方阵最左边1个柱脚点
    roofCoordinate: [],// 每个屋顶坐标
    roofCoordinateCopy: [],//屋顶原始坐标
    arrange: false,//东西南北排布区分,
    holes: [],//下探障碍物数据,
    relativeHeight: 0,
    dipFlag: false,//下探障碍物是否打立柱
    inputMode: false,//女儿墙向屋内绘制还是向屋外绘制,
    IsZPRoof: false,//阳光房主配房单独处理
    columnPoor: 0,//主配房的首立柱高度差
    mainDipHeight: 0,
    wingDipHeight: 0,
    dipHeight: 0,//后端给的屋顶下压数据
};
