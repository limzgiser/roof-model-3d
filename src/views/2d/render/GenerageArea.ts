import { Graph } from "./Graph";

class GenerageArea {

    public removeDuplicateArrays(arrays: any) {
        const seen = new Set();

        return arrays.filter((subArray: any) => {
            // 排序并将子数组转换为字符串
            const sortedSubArray = subArray.slice().sort().join(',');

            // 如果该排序后的子数组已出现过，跳过
            if (seen.has(sortedSubArray)) {
                return false;
            } else {
                seen.add(sortedSubArray);  // 否则添加到 Set 中
                return true;  // 保留当前子数组
            }
        });
    }
}

export {
    GenerageArea
}
