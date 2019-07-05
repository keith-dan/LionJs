/// <reference path="/js/angularJs-1.6.6/angular.js"/>
/// <reference path="/script/lion.js"/>


            var ele = new lion.RectElement();
            ele.allowMultiline = true;
            ele.canDrag = true;
            ele.backgroundColor = new lion.Gradient(lion.Gradient.Type.Linear, 50, 50, 50, 100, "red", "white");
            ele.isGraphicText = true;
            ele.fontFamliy = "FontAwesome";
            //ele.backgroundImageUrl = "res/bg.jpg"
            ele.text = "&#xf087;";
            ele.foreColor = "grey";
            ele.fontSize = 50;
            ele.shadow = 'yellow';
            ele.x = 100;
            ele.y = 100;
            ele.width = 100;
            ele.height = 100;
            ele.align = lion.Align.Center;
  ;
            stage.currentScene.addElement(ele);
          

            ele = new lion.RectElement();
            ele.allowMultiline = true;
            ele.canDrag = true;
            ele.backgroundColor = new lion.Gradient(lion.Gradient.Type.Radial, 50, 50, 50, 100, "red", "white");
            ele.isGraphicText = true;
            ele.foreColor = "black";
            ele.fontSize = 30;
            ele.shadow = 'yellow';
            ele.x = 250;
            ele.y = 100;
            ele.width = 100;
            ele.height = 100;
            ele.radius = 20;
            ele.align = lion.Align.BottomMiddle;
            ele.text = "渐变";
            stage.currentScene.addElement(ele);

            ele = new lion.RectElement();
            ele.allowMultiline = true;
            ele.canDrag = true;
            ele.backgroundImageUrl = "res/bg.jpg"
            ele.isGraphicText = true;
            ele.foreColor = "black";
            ele.fontSize = 30;
            ele.shadow = 'yellow';
            ele.x = 400;
            ele.y = 100;
            ele.width = 100;
            ele.height = 100;
            ele.radius = 20;
            ele.align = lion.Align.BottomMiddle;
            ele.text = "圆角矩形";
            stage.currentScene.addElement(ele);