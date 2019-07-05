

        var cabinets = [
            {
                name: "1号机柜", devices: [
                    { name: "服务器1", location:2, type: "1U", state: 1 },
                    { name: "服务器1", location:4, type: "1U", state: 1 },
                    { name: "服务器1", location: 6, type: "1U", state: 1 },
                    { name: "服务器1", location: 8, type: "1U", state: 2 },
                    { name: "服务器1", location: 10, type: "1U", state: 1 },
                ]
            },
            {
                name: "2号机柜", devices: [
                    { name: "服务器1", location: 2, type: "1U", state: 1 },
                    { name: "服务器1", location: 4, type: "2U", state: 1 },
                    { name: "服务器1", location: 7, type: "2U", state: 1 },
                    { name: "服务器1", location: 10, type: "2U", state: 1 },
                ]
            }
            ,
            {
                name: "3号机柜", devices: [
                    { name: "服务器1", location: 2, type: "1U", state: 1 },
                    { name: "服务器1", location: 4, type: "2U", state: 1 },
                    { name: "服务器1", location: 7, type: "4U", state: 1 },
                    { name: "服务器1", location: 12, type: "4U", state: 1 },
                    { name: "服务器1", location: 17, type: "4U", state: 1 },
                    { name: "服务器1", location: 23, type: "1U", state: 1 },
                    { name: "服务器1", location: 25, type: "1U", state: 1 },
                    { name: "服务器1", location: 27, type: "1U", state: 1 },
                    { name: "服务器1", location: 29, type: "1U", state: 1 },
                ]
            },
            {
                name: "4号机柜", devices: [
                    { name: "服务器1", location: 2, type: "10U", state: 1 },
                ]
            },
            {
                name: "5号机柜", devices: [
                    { name: "服务器1", location: 2, type: "1U", state: 1 },
                    { name: "服务器1", location: 4, type: "2U", state: 1 },
                    { name: "服务器1", location: 8, type: "2U", state: 1 }
                ]
            },
            {
                name: "6号机柜", devices: [
                    { name: "服务器1", location: 2, type: "1U", state: 1 },
                    { name: "服务器1", location: 4, type: "2U", state: 1 },
                    { name: "服务器1", location: 8, type: "2U", state: 1 }
                ]
            },
            {
                name: "7号机柜", devices: [
                    { name: "服务器1", location: 2, type: "1U", state: 1 },
                    { name: "服务器1", location: 4, type: "2U", state: 1 },
                    { name: "服务器1", location: 8, type: "2U", state: 1 }
                ]
            },
            {
                name: "8号机柜", devices: [
                    { name: "服务器1", location: 2, type: "1U", state: 1 },
                    { name: "服务器1", location: 4, type: "2U", state: 1 },
                    { name: "服务器1", location: 8, type: "2U", state: 1 }
                ]
            }
           
        ];


        for (var i = 0; i < cabinets.length; i++) {
            var ele = new lion.RectElement();// stage.new(lion.RectElement2);
            ele.allowMultiline = true;
            ele.canDrag = true;
            ele.backgroundColor = "blue";
            ele.shadow = 'yellow';
            ele.text = cabinets[i].name;
            ele.width = 50;//20 * Math.random()*5;
            ele.height = 50;//20 * Math.random()*5;
            ele.align = lion.Align.BottomMiddle;
            ele.data = cabinets[i];
            ele.canDrag = false;
            ele.canSelect = false;
            ele.onClick(showCabinet);
            stage.currentScene.addElement(ele);
        }

        lion.Layout.table(stage.currentScene.layers.action.elements, 6, new lion.Rect(100, 100, 600, 100));

    
        function showCabinet(ele)
        {
            stage.currentScene.clear(lion.LayerMode.Force);


            var mask = new lion.RectElement();
            mask.width = stage.width;
            mask.height = stage.height;
            mask.highlightColor = null;
            mask.backgroundColor = "rgba(125,125,125,0.5)";
            mask.onClick(function () {
                stage.currentScene.clear(lion.LayerMode.Force);
            })
            stage.currentScene.addElement(mask, lion.LayerMode.Force);

            var devices = ele.data.devices;
            var cabinet = new lion.MixElement();
            cabinet.width = 140;
            cabinet.height = 10 * 42;
            cabinet.backgroundImageUrl = "res/cabinet.png";
            cabinet.highlightColor = null;
            for (var i = 0; i < devices.length; i++) {
                var device = new lion.RectElement();
                device.width = 120;
                if (devices[i].type == "1U")
                    device.height = 10;
                else if (devices[i].type == "2U")
                    device.height = 20;
                else if (devices[i].type == "4U")
                    device.height = 40;
                else if (devices[i].type == "10U")
                    device.height = 100;
                device.backgroundImageUrl = "res/" + devices[i].type + ".png";
                device.x = 10;
                device.y = (42 - devices[i].location + 1) * 10 - device.height;

                if (devices[i].state == 2) {
                    device.borderColor = "red";
                    device.setAnimation(new lion.Animations.StepAnimation({
                        interval: 50,
                        steps:
                            [{ from: 0, to: 2, by: 2, field: 'borderSize', endreverse: true }]
                    }
                    ));
                }

                cabinet.add(device);
            }

            stage.currentScene.addElement(cabinet, lion.LayerMode.Force);
            lion.Layout.center(cabinet, stage.drawBounds);
        }


