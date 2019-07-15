//对图形按120X150矩阵切割
var im = new lion.ImageMatrix(120, 150);
im.load("res/pic1.png");
im.onLoaded(function (list) {
    var ele = stage.new(lion.RectElement);

    ele.canDrag = true;
    ele.backgroundColor = null;
    ele.text = "我是帧动画";
    ele.x = 400;
    ele.y = 400;
    ele.width = 120;
    ele.height = 150;
    ele.align = lion.Align.TopLeft;
    ele.setAnimation(new lion.Animations.FrameAnimation({
        interval: 100,
        frameList: list[1]
    }));

    stage.currentScene.addElement(ele);
});


var im2 = new lion.ImageMatrix(170, 165, false);
im2.load("res/boom.png");
im2.onLoaded(function (list) {
    var ele = stage.new(lion.RectElement);

    ele.canDrag = true;
    ele.backgroundColor = null;
    ele.text = "我是帧动画";
    ele.x = 600;
    ele.y = 400;
    ele.width = 120;
    ele.height = 150;
    ele.align = lion.Align.TopLeft;
    ele.setAnimation(new lion.Animations.FrameAnimation({
        interval: 100,
        frameList: list
    }));

    stage.currentScene.addElement(ele);
});


var il = new lion.ImageList();
il.load(['res/101.png', 'res/102.png', 'res/103.png']);
il.onLoaded(function (list) {

    var ele = stage.new(lion.RectElement);

    ele.canDrag = true;
    ele.backgroundColor = null;
    ele.text = "帧动画+路径动画";
    ele.x = 100;
    ele.y = 100;
    ele.align = lion.Align.TopLeft;
    ele.setAnimation(new lion.Animations.FrameAnimation({
        interval: 1000,
        frameList: list
    }));
    ele.setAnimation(new lion.Animations.PathAnimation({
        //interval: 0,
        path: [
            { x1: 200, y1: 200, x2: 200, y2: 100 },
            { x1: 200, y1: 100, x2: 200, y2: 200 },
            { x1: 200, y1: 200, x2: 100, y2: 200 },
            { x1: 100, y1: 200, x2: 200, y2: 200 }]
    }));
    stage.currentScene.addElement(ele);
});



//from-to动画
var stepEle = new lion.RectElement();

stepEle.canDrag = true;
stepEle.backgroundColor = null;
stepEle.text = "我是单步动画";
stepEle.x = 400;
stepEle.y = 200;
stepEle.align = lion.Align.TopLeft;
stepEle.setAnimation(new lion.Animations.StepAnimation(
       {
           interval: 200,
           steps:
               [
               //指定0-10，每次递增1，borderSize变化，结束后进行翻转
               { from: 0, to: 10, by: 1, field: 'borderSize', endreverse: true },
               //指定0-100，每次递增3，x变化，结束后进行翻转
               { from: 0, to: 100, by: 3, field: 'x', endreverse: true }
               ]
       }
    ));
stage.currentScene.addElement(stepEle);


var rect1 = stage.new(lion.RectElement);
rect1.backgroundColor = "blue";
rect1.x = 150;
rect1.y = 100;
stage.currentScene.addElement(rect1);
rect1.initNodes();
var rect2 = stage.new(lion.RectElement);

rect2.backgroundColor = "blue";
rect2.x = 420;
rect2.y = 300;
stage.currentScene.addElement(rect2);
rect2.initNodes();


var link = new lion.LinkElement();
link.setStartAndEnd(rect1, rect2, lion.EndPointMode.MiddleRight, lion.EndPointMode.MiddleLeft);
stage.currentScene.addElement(link);

var ele = stage.new(lion.CircleElement);
ele.shadow = 'rgb(0,0,0)';
ele.backgroundColor = 'red';
ele.radius = 3;
//绑定路径
ele.setAnimation(new lion.Animations.PathAnimation(link));
stage.currentScene.addElement(ele);


