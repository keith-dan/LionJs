stage.debugger.write('event sample');
//debugger;



var ele = new lion.RectElement();
ele.canDrag = true;
ele.backgroundColor = "blue";
ele.text = "hello";
ele.x = 100;
ele.y = 100;
ele.align = lion.Align.TopLeft;
ele.borderSize = 4;
ele.onClick(function (ele) {
    ele.setTooltip(new Date().toString());
});
ele.onHover(function (ele) {
    stage.debugger.write('ele hover');
})
ele.onLeave(function (ele) {
    ele.setTooltip();
})
stage.currentScene.addElement(ele);

ele = new lion.CircleElement();
ele.canDrag = true;
ele.backgroundColor = "blue";
ele.text = "hello";
ele.x = 220;
ele.y = 100;
ele.align = lion.Align.TopMiddle;
ele.borderSize = 4;
ele.onClick(function (ele) {
    stage.debugger.write('ele click');
})
ele.onRightClick(function (ele) {
    stage.debugger.write('ele right click');
})
stage.currentScene.addElement(ele);

stage.currentScene.onClick(function () {
    stage.debugger.write('scene click');
});
stage.currentScene.onMouseDown(function (e, scene, ele) {
    stage.debugger.write('scene onmousedown');
});
//stage.currentScene.onMouseMove(function (e,ele) {
//    stage.debugger.write('x:'+e.offsetX+",y:"+e.offsetY);
//});
stage.currentScene.onMouseUp(function (e, ele) {
    stage.debugger.write('scene onmouseup');
});
stage.currentScene.onSelectedElements(function (ele, selected) {

    stage.debugger.write('scene selected:' + selected.length);
});


