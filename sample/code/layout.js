/// <reference path="/script/lion.js"/>

var btn = new lion.RectElement();
btn.x = 20;
btn.y = 100;
btn.width = 80;
btn.height = 30;
btn.text = "左对齐";
btn.onClick(function () {
    lion.Layout.align(lion.Layout.AlignMode.Left, eles);
})
stage.currentScene.addElement(btn);

var btn = new lion.RectElement();
btn.x = 20;
btn.y = 150;
btn.width = 80;
btn.height = 30;
btn.text = "上对齐";
btn.onClick(function () {
    lion.Layout.align(lion.Layout.AlignMode.Top, eles);
})
stage.currentScene.addElement(btn);

btn = new lion.RectElement();
btn.x = 20;
btn.y = 200;
btn.width = 80;
btn.height = 30;
btn.text = "纵向排列";
btn.onClick(function () {
    lion.Layout.arrange(lion.Layout.ArrangeMode.Vertical, eles, 10);
})
stage.currentScene.addElement(btn);

btn = new lion.RectElement();
btn.x = 20;
btn.y = 250;
btn.width = 80;
btn.height = 30;
btn.text = "横向排列";
btn.onClick(function () {
    lion.Layout.arrange(lion.Layout.ArrangeMode.Horizontal, eles, 10);
})
stage.currentScene.addElement(btn);

btn = new lion.RectElement();
btn.x = 20;
btn.y = 300;
btn.width = 80;
btn.height = 30;
btn.text = "环绕";
btn.onClick(function () {
    lion.Layout.around(eles, 150);
})
stage.currentScene.addElement(btn);

btn = new lion.RectElement();
btn.x = 20;
btn.y = 350;
btn.width = 80;
btn.height = 30;
btn.text = "流布局";
btn.onClick(function () {
    lion.Layout.flow(eles, new lion.Rect(100, 100, 500, 500), 10);
})
stage.currentScene.addElement(btn);

btn = new lion.RectElement();
btn.x = 20;
btn.y = 400;
btn.width = 80;
btn.height = 30;
btn.text = "table布局";
btn.onClick(function () {
    lion.Layout.table(eles, 3, new lion.Rect(100, 100, 300, 100));
})
stage.currentScene.addElement(btn);


var eles = [];
for (var i = 0; i < 10; i++) {
    var ele = new lion.CircleElement();// stage.new(lion.RectElement2);
    ele.allowMultiline = true;
    ele.canDrag = true;
    ele.backgroundColor = "blue";
    ele.shadow = 'yellow';
    ele.text = i.toString();
    ele.x = Math.random() * 1 * 300 + 400;
    ele.y = Math.random() * 1 * 300 + 100;
    ele.width = 50;//20 * Math.random()*5;
    ele.height = 50;//20 * Math.random()*5;
    ele.align = lion.Align.Center;
    stage.currentScene.addElement(ele);

    eles[i] = ele;
}


lion.Layout.around(eles, 150);



