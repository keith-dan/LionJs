

var panel = new lion.MixElement();
        panel.backgroundColor = 'gray'
        stage.currentScene.addElement(panel);


        for (var i = 0; i < 2; i++) {
            var ele = new lion.RectElement();// stage.new(lion.RectElement2);
            ele.allowMultiline = true;
            ele.canDrag = true;
            ele.backgroundColor = "blue";
            ele.text = "hello\r\nrectasassdf\r\nasdsd";

            ele.x = 100+i*120;
            ele.y = 100;
            ele.width = 100;
            ele.height = 100;
  
            ele.align = lion.Align.TopRight;
            panel.add(ele);

        }



