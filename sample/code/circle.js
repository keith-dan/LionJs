/// <reference path="/js/angularJs-1.6.6/angular.js"/>
/// <reference path="/krender.js"/>
        
        //beginsource
        //实例化舞台
        //实例化圆形元素
        var ele = new lion.CircleElement();
        //设置参数
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 100;
        ele.y = 100;
        ele.radius = 30;
        ele.align = lion.Align.TopLeft;
        ele.borderSize = 4;
        //添加到当前场景
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 220;
        ele.y = 100;
        ele.radius = 30;
        ele.align = lion.Align.TopMiddle;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 340;
        ele.y = 100;
        ele.radius = 30;
        ele.align = lion.Align.TopRight;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 100;
        ele.y = 250;
        ele.radius = 30;
        ele.align = lion.Align.MiddleLeft;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 220;
        ele.y = 250;
        ele.radius = 30;
        ele.align = lion.Align.Center;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 340;
        ele.y = 250;
        ele.radius = 30;
        ele.align = lion.Align.MiddleRight;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 100;
        ele.y = 400;
        ele.radius = 30;
        ele.align = lion.Align.BottomLeft;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 220;
        ele.y = 400;
        ele.radius = 30;
        ele.align = lion.Align.BottomMiddle;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);

        ele = new lion.CircleElement();
        ele.canDrag = true;
        ele.backgroundColor = "#0094ff";
        ele.text = "hello";
        ele.x = 340;
        ele.y = 400;
        ele.radius = 30;
        ele.align = lion.Align.BottomRight;
        ele.borderSize = 4;
        stage.currentScene.addElement(ele);
        //endsource

