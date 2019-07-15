

var dt = new Date();
        //beginsource
        //随机算法
        function RandomNum(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.floor(Rand * Range); 
            return num;
        }


        //颜色取值数组
        var colors = ['red', 'blue', 'green', 'yellow', 'black', 'gray', 'pink', 'orange'];
        //每次循环生成2个元素和一条连线
        for (var i = 0; i < 5000; i++) {
            var ele1 = new lion.CircleElement();
            //var ele1 = stage.new( lion.CircleElement);
            ele1.x = Math.random() * 10 * 300;
            ele1.y = Math.random() * 10 * 300;
            ele1.backgroundColor = colors[RandomNum(0, colors.length)];
            ele1.radius = 10;
            stage.currentScene.addElement(ele1);

            var ele2 = new lion.CircleElement();
            ele2.x = Math.random() * 10 * 300;
            ele2.y = Math.random() * 10 * 300;
            ele2.radius = 10;
            ele2.backgroundColor = colors[RandomNum(0, colors.length)];
            stage.currentScene.addElement(ele2);


            var link = new lion.LinkElement();
            link.borderSize = 0.5;
            link.arrowSize = 0;
            //设置连线的两端
            link.setStartAndEnd(ele1, ele2);

            stage.currentScene.addElement(link);

        }

        stage.debugger.warn((new Date() - dt).toString() + "ms");

