class Graph {

        private adjList: any = {}
        constructor() {
            this.adjList = {};
        }
    
        addNode(node: any) {
            if (!this.adjList[node]) {
                this.adjList[node] = [];
            }
        }
    
        addEdge(node1: any, node2: any) {
            this.adjList[node1].push(node2);
            this.adjList[node2].push(node1); // 无向图
        }
    
        // 使用回溯法找到所有简单环
        findSimpleCycles(node: any, parent: any, visited: any = {}, path: any = [], cycles: any = []) {
            visited[node] = true;
            path.push(node);
    
            for (let neighbor of this.adjList[node]) {
                if (!visited[neighbor]) {
                    // 深度优先搜索
                    this.findSimpleCycles(neighbor, node, visited, path, cycles);
                } else if (neighbor !== parent && path.indexOf(neighbor) !== -1) {
                    // 找到了一个环
                    let cycle = [...path.slice(path.indexOf(neighbor) + 1), neighbor];
                    cycles.push(cycle);
                }
            }
    
            // 回溯
            path.pop();
            delete visited[node];
    
            return cycles;
        }
    
        getAllSimpleCycles() {
            let allCycles: any = [];
            for (let node in this.adjList) {
                if (this.adjList.hasOwnProperty(node)) {
                    let cyclesFromNode = this.findSimpleCycles(node, null);
                    allCycles = allCycles.concat(cyclesFromNode);
                }
            }
    
            // 去除重复的环（注意：这里假设环的顺序和顶点都相同才算重复）
            let uniqueCycles = [...new Map(allCycles.map((cycle: any) => [JSON.stringify(cycle), cycle])).values()];
    
            return uniqueCycles;
        }
    
    
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
    
    export { Graph }
    