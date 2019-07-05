
function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range); //舍去
    return num;
}


var colors = ['red', 'blue', 'green', 'yellow', 'black', 'gray', 'pink', 'orange'];
for (var i = 0; i < 5000; i++) {

    //随机创建5000个元素
    var ele1 = new lion.RectElement();
    ele1.x = Math.random() * 10 * 200;
    ele1.y = Math.random() * 10 * 200;
    ele1.backgroundColor = colors[RandomNum(0, colors.length)];
    ele1.borderColor = 'rgba(125,125,125,0.5)';
    ele1.radius = 10;
    ele1.setAnimation(new lion.Animations.StepAnimation(
       {
           interval: 100,
           steps:
               [
               { from: 0, to: 10, by: 1, field: 'borderSize', endreverse: true }
               ]
       }
    ));
    stage.currentScene.addElement(ele1);


}
