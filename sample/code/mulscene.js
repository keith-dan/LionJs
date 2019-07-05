/// <reference path="/js/angularJs-1.6.6/angular.js"/>
/// <reference path="/lion.js"/>

var flow1 = {
    nodes:
        [
            { "id": 101, "name": "节点1", "type": "node", x: 1, y: 1 },
            { "id": 102, "name": "节点2", "type": "node", x: 1, y: 2 },
            { "id": 103, "name": "节点3", "type": "node", x: 1, y: 3 },
            { "id": 104, "name": "节点4", "type": "node", x: 1, y: 4 },
            { "id": 105, "name": "节点5", "type": "node", x: 2, y: 2 },
            { "id": 106, "name": "节点6", "type": "node", x: 2, y: 3 },
            { "id": 107, "name": "节点7", "type": "node", x: 3, y: 1 },
            { "id": 108, "name": "节点8", "type": "node", x: 3, y: 2 },
            { "id": 109, "name": "节点9", "type": "node", x: 3, y: 3 },
            { "id": 110, "name": "节点10", "type": "node", x: 3, y: 4 },
            { "id": 111, "name": "节点11", "type": "node", x: 4, y: 1 },
            { "id": 112, "name": "节点12", "type": "node", x: 4, y: 4 }
        ],
    links:
        [
            { "id": 201, "type": "link", from: 102, to: 105 },
            { "id": 201, "type": "link", from: 101, to: 107 },
            { "id": 201, "type": "link", from: 107, to: 111 },
            { "id": 201, "type": "link", from: 103, to: 105 },
            { "id": 201, "type": "link", from: 106, to: 108 },
            { "id": 201, "type": "link", from: 104, to: 109 },
            { "id": 201, "type": "link", from: 105, to: 110 },
            { "id": 201, "type": "link", from: 110, to: 112 }
        ]
}

var flow2 = {
    nodes:
        [
            { "id": 101, "name": "节点1", "type": "node", x: 1, y: 2 },
            { "id": 102, "name": "节点2", "type": "node", x: 2, y: 1 },
            { "id": 103, "name": "节点3", "type": "node", x: 2, y: 2 },
            { "id": 104, "name": "节点4", "type": "node", x: 2, y: 3 },
            { "id": 105, "name": "节点5", "type": "node", x: 3, y: 1 },
            { "id": 106, "name": "节点6", "type": "node", x: 3, y: 2 },
            { "id": 107, "name": "节点7", "type": "node", x: 3, y: 3 },
            { "id": 108, "name": "节点8", "type": "node", x: 3, y: 4 },
        ],
    links:
        [
            { "id": 201, "type": "link", from: 101, to: 102 },
            { "id": 201, "type": "link", from: 101, to: 103 },
            { "id": 201, "type": "link", from: 101, to: 104 },
            { "id": 201, "type": "link", from: 102, to: 105 },
            { "id": 201, "type": "link", from: 103, to: 106 },
            { "id": 201, "type": "link", from: 104, to: 107 },
            { "id": 201, "type": "link", from: 104, to: 108 },

        ]
}



var ele = new lion.RectElement();
ele.x = 50;
ele.y = 100;
ele.text = "业务A";
ele.width = 100;
ele.backgroundColor = "#0091d6"
stage.currentScene.addElement(ele);

ele = new lion.PolygonElement();
ele.x = 190;
ele.y = 100;
ele.path = "0,10 50,10 50,0 80,25 50,50 50,40 0,40";
ele.backgroundColor = "green";
stage.currentScene.addElement(ele);

ele = new lion.RectElement();
ele.x = 300;
ele.y = 100;
ele.text = "业务B";
ele.width = 100;
ele.backgroundColor = "#0091d6"
stage.currentScene.addElement(ele);

ele = new lion.PolygonElement();
ele.x = 440;
ele.y = 100;
ele.path = "0,10 50,10 50,0 80,25 50,50 50,40 0,40";
ele.backgroundColor = "green";
stage.currentScene.addElement(ele);

ele = new lion.RectElement();
ele.x = 550;
ele.y = 100;
ele.text = "业务C";
ele.width = 100;
ele.backgroundColor = "#0091d6"
stage.currentScene.addElement(ele);

ele = new lion.PolygonElement();
ele.x = 320;
ele.y = 180;
ele.rotate = 90;
ele.path = "0,10 50,10 50,0 80,25 50,50 50,40 0,40";
ele.backgroundColor = "green";
stage.currentScene.addElement(ele);

ele = new lion.RectElement();
ele.x = 50;
ele.y = 280;
ele.text = "分析处理系统";
ele.width = 600;
ele.backgroundColor = "#c53030";
ele.onClick(function (e, layer) {
    layer.cancelSelected();
    stage.changeScene(2);
})
stage.currentScene.addElement(ele);

ele = new lion.PolygonElement();
ele.x = 320;
ele.y = 360;
ele.rotate = 90;
ele.path = "0,10 50,10 50,0 80,25 50,50 50,40 0,40";
ele.backgroundColor = "green";
stage.currentScene.addElement(ele);

ele = new lion.RectElement();
ele.x = 50;
ele.y = 460;
ele.width = 600;
ele.text = "数据底层系统";
ele.backgroundColor = "#f1ab0f";
ele.onClick(function (e, layer) {
    layer.cancelSelected();
    stage.changeScene(1);
})
stage.currentScene.addElement(ele);


function buildScene(flow) {
    var scene1 = new lion.Scene();
    stage.addScene(scene1);
    for (var i = 0; i < flow.nodes.length; i++) {

        ele = new lion.CircleElement();
        ele.x = flow.nodes[i].x * 150;
        ele.y = flow.nodes[i].y * 100;;
        ele.radius = 20;
        ele.text = flow.nodes[i].name;
        ele.data = flow.nodes[i];
        ele.align = lion.Align.BottomMiddle;
        ele.backgroundColor = "#f1ab0f";
        ele.shadow = "gray";
        ele.onClick(function (e, layer) {
            layer.cancelSelected();
            stage.changeScene(0);
        })
        scene1.addElement(ele);

    }

    for (var i = 0; i < flow.links.length; i++) {
        var sele = scene1.find(lion.LayerMode.Action, function (e) {
            return e.data.id == flow.links[i].from;
        });
        var eele = scene1.find(lion.LayerMode.Action, function (e) {
            return e.data.id == flow.links[i].to;
        })

        ele = new lion.LinkElement();
        ele.data = flow.links[i];
        ele.setStartAndEnd(sele, eele);
        //ele.backgroundColor = "#000000";
        scene1.addElement(ele);

    }
    scene1.onClick(function (e, target) {
        stage.changeScene(0);
    })
}

buildScene(flow1);
buildScene(flow2);

