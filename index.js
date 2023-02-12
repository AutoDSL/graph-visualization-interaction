import G6 from '@antv/g6'
import axios from 'axios'

const nodesCount = 400
const edgesCount = 800
const ranks = 50

var graph = new G6.Graph({
    container: 'mountNode',
    width: window.innerWidth,
    height: window.innerHeight - 10,
    modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas']
    },
    layout: {
        type: 'dagre',
        // gravity: 5,
        // speed: 100,
        nodeSize: [40, 20],
        nodesep: nodesCount / ranks,
        ranksep: (2 * edgesCount) / ranks
    },
    animate: true,
    fitView: true,
    defaultNode: {
        type: 'rect',
        size: [40, 20],
        color: 'steelblue',
        style: {
            lineWidth: 2,
            fill: '#fff'
        }
    },
    defaultEdge: {
        size: 1,
        color: '#e2e2e2',
        style: {
            // endArrow: {
            //     path: 'M 4,0 L -4,-4 L -4,4 Z',
            //     d: 4
            // }
        }
    }
})

var data = {
    nodes: [],
    edges: []
}

for (let i = 0; i < nodesCount; i++) {
    data.nodes.push({ id: i.toString(), label: i.toString() })
}
for (let r = 0; r < ranks - 1; r++) {
    for (let i = 0; i < edgesCount / ranks; i++) {
        let from = ((nodesCount / ranks) * r + Math.floor(Math.random() * (nodesCount / ranks))).toString()
        let to = ((nodesCount / ranks) * (r + 1) + Math.floor(Math.random() * (nodesCount / ranks))).toString()
        data.edges.push({ source: from, target: to, data: 'from ' + from + ' to ' + to })
    }
}

graph.data(data)
graph.render()

graph.on('node:click', function (e) {
    console.log('node' + e.item._cfg.id)
})
graph.on('node:dragstart', function (e) {
    graph.layout()
    refreshDragedNodePosition(e)
})
graph.on('node:drag', function (e) {
    refreshDragedNodePosition(e)
})
graph.on('node:dragend', function (e) {
    e.item.get('model').fx = null
    e.item.get('model').fy = null
})
graph.on('edge:mouseenter', e => {
    const item = e.item
    graph.update(item, {
        style: {
            stroke: 'red'
        }
    })
})
graph.on('edge:mouseleave', e => {
    const item = e.item
    graph.update(item, {
        style: {
            stroke: '#e2e2e2'
        }
    })
})
graph.on('edge:click', e => {
    console.log(e.item._cfg.model.data)
})

function refreshDragedNodePosition(e) {
    var model = e.item.get('model')
    model.fx = e.x
    model.fy = e.y
}
