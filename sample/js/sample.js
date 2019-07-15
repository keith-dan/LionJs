/// <reference path="/sample/js/jquery-3.2.0.min.js"/>
/// <reference path="/script/lion.js"/>
/// <reference path="/script/lion.ui.js"/>
var stage;
$(window.document).ready(function () {

    lion.debug = lion.DebugMode.All;
    stage = new lion.Stage('mycanvas');
    stage.enableContextMenu(false);

    var ele = new lion.ui.Button();
    ele.x = 100;
    ele.y = 10;
    ele.text = "单选";
    ele.onClick(function () {
        stage.currentScene.mode = lion.SceneMode.SingleSelect;
    });
    stage.currentScene.addElement(ele, lion.LayerMode.Force);

    ele = new lion.ui.Button();
    ele.x = 200;
    ele.y = 10;
    ele.text = "多选";
    ele.onClick(function () {
        stage.currentScene.mode = lion.SceneMode.MultipleSelect;
    });
    stage.currentScene.addElement(ele, lion.LayerMode.Force);


    ele = new lion.ui.Button();
    ele.x = 300;
    ele.y = 10;
    ele.text = "平移";
    ele.onClick(function () {
        stage.currentScene.mode = lion.SceneMode.Move;
    });
    stage.currentScene.addElement(ele, lion.LayerMode.Force);

    var scale = 1.0;

    ele = new lion.ui.Button();
    ele.x = 400;
    ele.y = 10;
    ele.text = "放大";
    ele.onClick(function () {
        scale += 0.1;
        stage.currentScene.setScale(scale);
    });
    stage.currentScene.addElement(ele, lion.LayerMode.Force);

    ele = new lion.ui.Button();
    ele.x = 500;
    ele.y = 10;
    ele.text = "缩小";
    ele.onClick(function () {
        scale -= 0.1;
        stage.currentScene.setScale(scale);
    });
    stage.currentScene.addElement(ele, lion.LayerMode.Force);

    //ele = new lion.ui.TextArea();
    //ele.x = 500;
    //ele.y = 10;
    
    //ele.onClick(function () {
    //    scale -= 0.1;
    //    stage.currentScene.setScale(scale);
    //});
    //stage.currentScene.addElement(ele, lion.LayerMode.Force);


    $.ajax({
        url: "json/menu.json",
        type: "get",
        dataType: "json",
        success: function (data) {
            for (let i in data) {
                let li = $("<li>" + data[i].name + "</li>");
                $("#menu").append(li);
                let subul = $("<ul></ul>");
                li.append(subul);
                for (let j in data[i].children) {
                    let subli = $("<li>" + data[i].children[j].name + "</li>");
                    subli.on("click", function () {
                        if (data[i].children[j].navigate == "pop") {
                            window.open(data[i].children[j].url);
                        }
                        else {
                            changeDemo(data[i].children[j].url);
                        }
                    });
                    subul.append(subli);
                }
            }
            console.log(data);
        }
    });


    $("#btnSource").on("click", function () {
        $("#txtSource").show();
    });

    $("#btnView").on("click", function () {
        $("#txtSource").hide();
    });

});

function changeDemo(url) {
    stage.currentScene.clear(lion.LayerMode.Action);
    $.getScript(url, function (e) {
        $("#txtSource").html("<pre>"+e+"</pre>");
    });
}