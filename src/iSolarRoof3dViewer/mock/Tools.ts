


const getAreaPoint = (data: any) => {

    const { areas, points } = data

    let result: any = []

    areas.forEach((areaItem: any) => {

        let areaPoints = areaItem.points.map((id: string) => points.find((item: any) => item.pid == id).point)

        if (areaPoints) {
            result.push(areaPoints)
        }
    });


    return result
}

export {
    getAreaPoint
}
