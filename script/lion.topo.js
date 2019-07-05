/// <reference path="/script/lion.js"/>


function Topo(div) {
    var stage = new lion.Stage(div);
    stage.enableContextMenu(false);
    var scene = stage.currentScene;

    Topo.prototype.addNode = function (node, x, y) {
        return buildElement(node, x, y);
    }

    Topo.prototype.addLink = function (ele1, ele2,color) {
        let link = new lion.LinkElement;
        link.arrowDirection = lion.ArrowDirection.Right;
        link.arrowSize = 10;
        link.setStartAndEnd(ele1, ele2, true);
        link.backgroundColor = color!=null?color:"#000000";
        scene.addElement(link);

        let ele = new lion.CircleElement();
        ele.shadow = 'rgb(0,0,0)';
        ele.backgroundColor = 'green';
        ele.radius = 3;
        ele.setAnimation(new lion.Animations.PathAnimation(link));
        scene.addElement(ele);

        return link;
    }

    Topo.prototype.updateElement = function (ele,cfg) {
        for(let i in cfg){
            ele[i] = cfg[i];
        }
    }

    Topo.prototype.center = function(){
        lion.Layout.center(scene.layers.action.elements,scene.layers.action.drawBounds);
    }

    //创建元素
    function buildElement(data, x, y) {

        var rect = new lion.RectElement();
        rect.eleid = data.eleid;
        rect.backgroundColor = null;
        rect.foreColor = "#333333";
        rect.text = data.text;
        rect.borderSize = 0;
        rect.width = 60;
        rect.height = 60;
        rect.allowMultiline = true;
        rect.data = data;
        rect.x = x;
        rect.y = y;
        rect.align = lion.Align.BottomMiddle;
        rect.text = data.text;
        rect.backgroundImageUrl = data.image;
        scene.addElement(rect, lion.LayerMode.Action);
        rect.initNodes();
        return rect;
      
        //eles[data.eleid] = rect;
    }



    scene.onMouseDown(function (e, tscene, target, layout) {
        clearMenu("contextmenu");
        if (e.button == 2) {
            //点击右键
            if (target) {
                buildMenu("contextmenu", target, topomenus[target.data.type]);
                var cm = document.getElementById("contextmenu");
                cm.style.top = e.pageY + "px";
                cm.style.left = e.pageX + "px";
                cm.style.display = '';
            }

        } else {
            //左键
            if (line.visible) {

            }
        }
    });

    scene.onMouseMove(function (e, target) {
        if (line.visible) {
            line.lineTo(e.offsetX, e.offsetY);

        }

    });

    scene.onMouseUp(function (e, ele, layer) {
        //鼠标弹起
        if (ele) {
            if (line.visible) {
                line.visible = false;
                var link = null
                if (beginRALink) {
                    link = new lion.RAngleLinkElement;
                    link.setStartAndEnd(startEle, ele,true);


                } else {
                    link = new lion.LinkElement;
                    link.arrowDirection = lion.ArrowDirection.Right;
                    link.arrowSize = 10;
                    link.setStartAndEnd(startEle, ele, true);


                }

                link.backgroundColor = "#000000";
                scene.addElement(link);
                beginRALink = false;
            }

            ele.setEditMode(lion.EditMode.Select);
            ele.hideNodes();
        }

    });

    function clearMenu(contextmenu) {
        let cm = document.getElementById(contextmenu);
        while (cm.children.length > 0)
            cm.children[0].remove();
    }
    //创建菜单
    function buildMenu(contextmenu, target, menus) {
        let cm = document.getElementById(contextmenu);
        for (let i = 0; i < menus.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("actType", menus[i].id);
            li.innerText = menus[i].name;
            li.addEventListener("click", function () {
                fireEvent(target, menus[i]);

                clearMenu(contextmenu);
            });
            cm.appendChild(li);
        }

    }

    var beginRALink = false;
    var startEle;
    var line = new lion.LineElement();
    line.backgroundColor = "#ff0000";
    line.canEvent = false;
    line.visible = false;

    function fireEvent(target, e) {
        if (e.id == "edit") {
            target.setEditMode(lion.EditMode.Scale);
        } else if (e.id == "link") {
            scene.addElement(line, lion.LayerMode.Virtual);
            line.visible = true;
            line.setPoint(target.drawBounds.center.x, target.drawBounds.center.y, 100, 100);
            startEle = target;
        } else if (e.id == "rlink") {
            beginRALink = true;
            scene.addElement(line, lion.LayerMode.Virtual);
            line.visible = true;
            line.setPoint(target.drawBounds.center.x, target.drawBounds.center.y, 100, 100);
            startEle = target;
        }
    }
};