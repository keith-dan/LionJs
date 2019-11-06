/// <reference path="/script/lion.js"/>

var panel = new lion.MixElement();
panel.backgroundColor = 'gray'
panel.x = 100;
panel.y = 100;
stage.currentScene.addElement(panel);


for (var i = 0; i < 2; i++) {
    //循环添加子元素
    var ele = new lion.RectElement();
    ele.backgroundColor = "blue";
    ele.text = "Element" + i;
    ele.radius = 10;
    ele.x = 50 + i * 120;
    ele.y = 100;
    ele.width = 100;
    ele.height = 100;
    ele.borderSize = 4;
    ele.onHover(function () {
        console.log("hover");
    });
    ele.onLeave(function () {
        console.log("leave");
    });
    ele.align = lion.Align.Center;
    panel.add(ele);

}


//添加一个Unicode图标子元素
var ele = new lion.RectElement();
ele.backgroundColor = null;
ele.isGraphicText = true;
ele.fontFamliy = "FontAwesome";
ele.text = "&#xf085;";
ele.x = 0;
ele.y = 0;
ele.width = 30;
ele.height = 30;
ele.foreColor = "white"
ele.align = lion.Align.Center;
panel.add(ele);

