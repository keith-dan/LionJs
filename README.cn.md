# LionJs

#### 介绍
LionJs是一个以拓扑展示为核心的2D绘制引擎。
其简单、快速、灵活进行开发是其核心。
系统整体未采用任何第三方库，无任何第三方依赖，方便引入而不会造成其他前端框架错误。
核心采用HTML5进行绘制，兼容各类系统及移动端

典型的应用包括：
<ul>
<li>各类型流程图展示</li>
<li>业务关系展示</li>
<li>类visio绘图</li>
<li>流程监控</li>
<li>....</li>
</ul>

<img src="pic1.png">

#### 使用说明

<div>核心引擎为独立js，不依赖于任何第三方库，因此可以自由嵌入各个网页部分</div>
<div>demo采用jquery编写，sample文件夹包含部分示例和介绍</div>
<div>API部分还未写完，不断追加完善</div>

<div>引入lion.min.js，创建第一个图形</div>
<pre>
var stage = new lion.Stage('mycanvas'); //实例化舞台
var ele = new lion.RectElement(); //实例化矩形元素
ele.backgroundColor = "blue";  //设置背景色
ele.text = "hello world!";  //设置文本
ele.shadow = 'gray'; //设置阴影
ele.x = 100;  //设置x坐标
ele.y = 100;  //设置y坐标
ele.width = 100; //设置宽度
ele.height = 100;  //设置高度
ele.align = lion.Align.TopRight;  //设置文本对齐方式
stage.currentScene.addElement(ele);  //添加到当前场景中
</pre>

#### 联系方式
作者:Keith.Dan

gitee:https://gitee.com/keith_dan/LionJs
github:https://github.com/keith-dan/LionJs

联系方式:keith-dan@live.com
