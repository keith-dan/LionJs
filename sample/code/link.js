

var ele1 = new lion.RectElement();
ele1.backgroundColor = "blue";
ele1.x = 100;
ele1.y = 100;

stage.currentScene.addElement(ele1);
ele1.initNodes();

var ele2 = new lion.RectElement();
ele2.backgroundColor = "blue";
ele2.text = "hello";
ele2.x = 300;
ele2.y = 100;

stage.currentScene.addElement(ele2);
ele2.initNodes();

var link = new lion.RAngleLinkElement();

link.setStartAndEnd(ele1, ele2, lion.EndPointMode.MiddleRight, lion.EndPointMode.MiddleRight);
link.setTextBlock('hello link', lion.Align.Center);
link.setTextBlock('hello start link', lion.Align.Start);
link.setTextBlock('hello end link', lion.Align.End);
stage.currentScene.addElement(link);




var rect1 = new lion.RectElement();
rect1.backgroundColor = "blue";
rect1.x = 150;
rect1.y = 200;
stage.currentScene.addElement(rect1);
rect1.initNodes([lion.EndPointMode.MiddleLeft, lion.EndPointMode.MiddleRight]);
var rect2 = new lion.RectElement();

rect2.backgroundColor = "blue";
rect2.x = 420;
rect2.y = 300;
stage.currentScene.addElement(rect2);
rect2.initNodes([lion.EndPointMode.MiddleLeft, lion.EndPointMode.MiddleRight]);

var link = new lion.CurveLinkElement();
link.arrowDirection = lion.ArrowDirection.Both;
link.setStartAndEnd(rect1, rect2, lion.EndPointMode.MiddleRight, lion.EndPointMode.MiddleLeft);
link.setTextBlock('hello link', lion.Align.Center);
link.setTextBlock('hello start link', lion.Align.Start);
link.setTextBlock('hello end link', lion.Align.End);
stage.currentScene.addElement(link);




var rect3 = new lion.RectElement();
rect3.backgroundColor = "blue";
rect3.x = 150;
rect3.y = 450;
stage.currentScene.addElement(rect3);
rect3.initNodes([lion.EndPointMode.MiddleLeft, lion.EndPointMode.MiddleRight]);
var rect4 = new lion.RectElement();
rect4.backgroundColor = "blue";
rect4.x = 420;
rect4.y = 370;
stage.currentScene.addElement(rect4);
rect4.initNodes([lion.EndPointMode.MiddleLeft, lion.EndPointMode.MiddleRight]);

var link = new lion.LinkElement();
link.setStartAndEnd(rect3, rect4, lion.EndPointMode.MiddleRight, lion.EndPointMode.MiddleLeft);
link.setTextBlock('hello link', lion.Align.Center);
link.setTextBlock('hello start link', lion.Align.Start);
link.setTextBlock('hello end link', lion.Align.End);
stage.currentScene.addElement(link);



var ele5 = new lion.RectElement();
ele5.backgroundColor = "blue";
ele5.x = 400;
ele5.y = 100;

stage.currentScene.addElement(ele5);
var ele6 = stage.new(lion.CircleElement);
ele6.backgroundColor = "blue";
ele6.x = 600;
ele6.y = 150;

stage.currentScene.addElement(ele6);
var link = new lion.LinkElement();
link.arrowDirection = lion.ArrowDirection.Both;
link.arrowSize = 10;
link.text = "边缘连接";
link.setStartAndEnd(ele5, ele6,true);
stage.currentScene.addElement(link);

