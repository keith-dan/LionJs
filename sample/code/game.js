var elePlayer;
var animation = {};
//按120x150对图像进行矩阵切割
var im = new lion.ImageMatrix(120, 150);
im.load("res/pic1.png");
im.onLoaded(function (list) {
    elePlayer = new lion.RectElement();

    elePlayer.canDrag = false;
    elePlayer.backgroundColor = null;
    elePlayer.text = "请按上、下、左、右";
    elePlayer.x = 400;
    elePlayer.y = 400;
    elePlayer.width = 120;
    elePlayer.height = 150;
    elePlayer.align = lion.Align.TopLeft;
    animation.down =  elePlayer.setAnimation(new lion.Animations.FrameAnimation({
        interval: 100,
        frameList: list[0]
    }));
    animation.left = elePlayer.setAnimation(new lion.Animations.FrameAnimation({
        interval: 100,
        frameList: list[1],
        enable: false
    }));
    animation.right = elePlayer.setAnimation(new lion.Animations.FrameAnimation({
        interval: 100,
        frameList: list[2],
        enable: false
    }));
    animation.up = elePlayer.setAnimation(new lion.Animations.FrameAnimation({
        interval: 100,
        frameList: list[3],
        enable:false
    }));

    stage.currentScene.addElement(elePlayer);
});

stage.currentScene.onKeyPress(function (e) {
    //按键后对动画进行切换
    elePlayer.enableAllAnimation(false);
    if (e.keyCode == 38)//up
    {
        elePlayer.enableAnimation(animation.up, true);
        elePlayer.y-=2;
    }
    else if (e.keyCode == 37)//left
    {
        elePlayer.enableAnimation(animation.left, true);
        elePlayer.x -= 2;
    }
    else if (e.keyCode == 39)//right
    {
        elePlayer.enableAnimation(animation.right, true);
        elePlayer.x += 2;
    }
    else if (e.keyCode == 40)//down
    {
        elePlayer.enableAnimation(animation.down, true);
        elePlayer.y += 2;
    }

});