/*
* copyright keith.dan
* gitee:https:
* github:https:
* email:keith-dan@live.com
*/

!(function (o) {
    

    /**
    * @name Global
    * @type class
    * @file global
    * @description 全局函数
    */
    function defineMethod(object, name, fn) {
        var old = object[name];
        object[name] = function() {
            if(fn.length === arguments.length) {
                return fn.apply(this, arguments);
            } else if(typeof old === "function") {
                return old.apply(this, arguments);
            }
        }
    }

    
    function getBeveling(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    
    function paintLine(g, start, end, style) {
        if (style == lion.LineStyle.Dotted) {
            var dashLen = 5;
            
            var beveling = getBeveling(end.x - start.x, end.y - start.y);
            
            var num = Math.floor(beveling / dashLen);

            for (var i = 0; i < num; i++) {
                g[i % 2 == 0 ? 'moveTo' : 'lineTo'](start.x + (end.x - start.x) / num * i, start.y + (end.y - start.y) / num * i);
            }
            g.stroke();
        }
        else {
            

        }
    }

    function getRectFromRects(rects) {
        
        
        var minW = rects[0].x, maxW = 0, minH = rects[0].y, maxH = 0;
        for (var i = 0; i < rects.length; i++) {

            minW = minW < rects[i].x ? minW : rects[i].x;
            maxW = maxW > rects[i].x + rects[i].width ? maxW : rects[i].x + rects[i].width;
            minH = minH < rects[i].y ? minH : rects[i].y;
            maxH = maxH > rects[i].y + rects[i].height ? maxH : rects[i].y + rects[i].height;
        }

        var rect = new Rect();
        rect.x = minW;
        rect.y = minH;
        rect.width = maxW - minW;
        rect.height = maxH - minH;

        return rect;
    }
    
    function getRect(elements) {

        var rects = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] instanceof lion.LinkElement)
                continue;
            else 
                rects.push(elements[i].getOutRect());
        }

        return getRectFromRects(rects);
    }
    
    function pathRoundRect(g, x, y, w, h, r) {
        if (w < 2 * r) { r = w / 2; }
        if (h < 2 * r) { r = h / 2; }
        g.beginPath();
        g.moveTo(x + r, y);
        g.arcTo(x + w, y, x + w, y + h, r);
        g.arcTo(x + w, y + h, x, y + h, r);
        g.arcTo(x, y + h, x, y, r);
        g.arcTo(x, y, x + w, y, r);
        g.closePath();

    }
    
    function pushArray(array1, array2) {

        for (var i = 0; i < array2.length; i++)
            array1.push(array2[i]);
    }
    function measureTextSize(g, text) {
        return { width: g.measureText(text).width, height: g.measureText("田").width };
    }

    /**
     * @name generateId(elements)
     * @description 生成一个随机的Id
     * @class Global
     * @type function
     * @param elements Element[] 在此元素数组中不重复
     */
    function generateId(elements) {
        var date = new Date();

        return date.getTime().toString() + parseInt(Math.random() * 100000);

    }
    
    /**
    * @name fromJson(jsonString, div, autoSize)
    * @description 从Json中反序列化为对象
     * @class Global
     * @type function
    * @param jsonString string true json字符串
    */
    function fromJson(jsonString, div, autoSize) {
        var json = null;
        console.log(typeof (jsonString))
        if (typeof (jsonString) == 'string') {
            jsonString = jsonString.replace(/\n/g, "\\n");
            json = window.eval(jsonString);
        } else
            json = jsonString;

        var stage = lion.Element.deserialize(json[0].stage, div);
        stage.enddeserialize();
        return stage;
    }
    /**
     * @name disposeAll()
     * @description 释放所有元素
     * @class Global
     * @type function
     */
    function disposeAll() {
        for (var i = 0; i < lion.Timer.stages.length; i++) {
            lion.Timer.stages[i].dispose();
            lion.Timer.stages[i] = null;
        }
        lion.Timer.stages = [];
    }
    function mathAngle(start, end) {
        var diff_x = end.x - start.x,
        diff_y = end.y - start.y;
        var angle = Math.atan(diff_y / diff_x);
        return angle;
    }
    
    function getArrowDirection(start, end) {

        
        if (start.y > end.y && start.x > end.x) return 0;
            
        else if (start.y > end.y && start.x < end.x) return 1;
            
        else if (start.y < end.y && start.x < end.x) return 2;
            
        else if (start.y < end.y && start.x > end.x) return 3;
    }
    function paintArrow(g, start, end, size, bgcolor) {
        var radian = mathAngle(start, end);
        var angle = lion.Util.toAngle(radian);

        var radion1 = Math.abs(radian) + lion.Util.toRadian(45);

        var y1 = size * Math.sin(radion1);
        var x1 = size * Math.cos(radion1);

        var radion2 = Math.abs(radian) - lion.Util.toRadian(45);
        var y2 = size * Math.sin(radion2);
        var x2 = size * Math.cos(radion2);
        g.fillStyle = bgcolor;
        var direction = getArrowDirection(start, end);

        if (angle == -90) {
            g.beginPath();
            g.moveTo(end.x, end.y);
            g.lineTo(end.x - x1, end.y + y1);
            g.moveTo(end.x, end.y);
            g.lineTo(end.x - x2, end.y + y2);


            g.stroke();
            return;
        }
        else if (angle == 90) {
            g.beginPath();
            g.moveTo(end.x, end.y);
            g.lineTo(end.x - x1, end.y - y1);
            g.moveTo(end.x, end.y);
            g.lineTo(end.x - x2, end.y - y2);


            g.stroke();
            return;
        }

        else if (angle == 0) {

            if (start.x > end.x) {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x1, end.y - y1);
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x2, end.y - y2);


                g.stroke();
            }
            else {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x1, end.y - y1);
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x2, end.y - y2);


                g.stroke();
            }
            return;
        }

        if (direction == 1 || direction == 2) {
            if (radian < 0) {

                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x1, end.y + y1);
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x2, end.y + y2);


                g.stroke();
            }
            else {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x1, end.y - y1);
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x2, end.y - y2);


                g.stroke();
            }
        }
        else {
            if (radian < 0) {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x1, end.y - y1);
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x2, end.y - y2);

                g.stroke();
            }
            else {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x1, end.y + y1);
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x2, end.y + y2);

                g.stroke();
            }
        }
    }
    function paintTriangle(g, start, end, size, bgcolor) {
        var radian = mathAngle(start, end);
        var angle = lion.Util.toAngle(radian);
        var radian1 = Math.abs(radian) + lion.Util.toRadian(45);

        
        var y1 = size * Math.sin(radian1);
        var x1 = size * Math.cos(radian1);

        var radian2 = Math.abs(radian) - lion.Util.toRadian(45);
        var y2 = size * Math.sin(radian2);
        var x2 = size * Math.cos(radian2);
        g.fillStyle = bgcolor;
        var direction = getArrowDirection(start, end);

        if (angle == -90) {
            g.beginPath();
            g.moveTo(end.x, end.y);
            g.lineTo(end.x - x1, end.y + y1);
            g.lineTo(end.x - x2, end.y + y2);
            g.lineTo(end.x, end.y);
            g.closePath();
            g.fill();
            return;
        }
        else if (angle == 90) {
            g.beginPath();
            g.moveTo(end.x, end.y);
            g.lineTo(end.x - x1, end.y - y1);

            g.lineTo(end.x - x2, end.y - y2);
            g.lineTo(end.x, end.y);
            g.closePath();
            g.fill();
            return;
        }

        else if (angle == 0) {

            if (start.x > end.x) {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x1, end.y - y1);

                g.lineTo(end.x + x2, end.y - y2);
                g.lineTo(end.x, end.y);
                g.closePath();
                g.fill();
            }
            else {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x1, end.y - y1);
                g.lineTo(end.x - x2, end.y - y2);
                g.lineTo(end.x, end.y);
                g.closePath();
                g.fill();
            }
            return;
        }

        if (direction == 1 || direction == 2) {
            if (radian < 0) {

                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x1, end.y + y1);
                g.lineTo(end.x - x2, end.y + y2);
                g.lineTo(end.x, end.y);
                g.closePath();
                g.fill();
            }
            else {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x - x1, end.y - y1);

                g.lineTo(end.x - x2, end.y - y2);
                g.lineTo(end.x, end.y);
                g.closePath();
                g.fill();
            }
        }
        else {
            if (radian < 0) {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x1, end.y - y1);

                g.lineTo(end.x + x2, end.y - y2);
                g.lineTo(end.x, end.y);
                g.closePath();
                g.fill();
            }
            else {
                g.beginPath();
                g.moveTo(end.x, end.y);
                g.lineTo(end.x + x1, end.y + y1);
                g.lineTo(end.x + x2, end.y + y2);
                g.lineTo(end.x, end.y);
                g.closePath();
                g.fill();
            }
        }
    }
    function paintCircle(g, x, y, size, bgcolor) {
        g.fillStyle = bgcolor;
        g.beginPath();
        g.arc(x, y, size, 0, 2 * Math.PI);
        g.fill();
    }
    function paintRect(g, x, y, size, bgcolor) {
        g.fillStyle = bgcolor;
        g.beginPath();
        g.fillRect(x - size, y - size, 2 * size, 2 * size);
    }
    
    function getBgColor(g,  backgroundColor) {
        if (backgroundColor instanceof lion.Gradient) {
            if (backgroundColor.type == lion.Gradient.Type.Linear) {
                var grd = g.createLinearGradient(backgroundColor.drawPoint1.x,
                    backgroundColor.drawPoint1.y,
                    backgroundColor.drawPoint2.x,
                    backgroundColor.drawPoint2.y);
                for (var i = 0; i < backgroundColor.colors.length; i++)
                    grd.addColorStop(backgroundColor.colors[i].step, backgroundColor.colors[i].color);

                return grd;
            } else if (backgroundColor.type == lion.Gradient.Type.Radial) {
                var r = lion.Util.getDistance(backgroundColor.drawPoint1, backgroundColor.drawPoint2);
                var grd = g.createRadialGradient(backgroundColor.drawPoint1.x,
                    backgroundColor.drawPoint1.y,
                    0,
                    backgroundColor.drawPoint1.x,
                    backgroundColor.drawPoint1.y,
                    r);
                for (var i = 0; i < backgroundColor.colors.length; i++)
                    grd.addColorStop(backgroundColor.colors[i].step, backgroundColor.colors[i].color);

                return grd;
            }


        }
        else
        {
            return backgroundColor;
        }
    }
    
    
    /**
    * @name Util
    * @type class
    * @file util
    * @description 帮助类
    */
    function Util() {
        /**
         * @name andEnum(enums, flag)
         * @description 按位与
         * @class Util
         * @type function
         * @return 返回bool
         * @param enums number 枚举值
         * @param flag number 值
         */
        this.andEnum = function (enums, flag) {
            return (enums & flag) == flag;
        }
        /**
         * @name xorEnum(enums, flag)
         * @description 按位异或
         * @class Util
         * @type function
         * @return number
         * @param enums number 枚举值
         * @param flag number 值
         */
        this.xorEnum = function (enums, flag) {
            return this.andEnum(enums, flag) ? enums ^ flag : enums;
        }
        /**
         * @name orEnum(enums, flag)
         * @description 按位或
         * @class Util
         * @type function
         * @return number
         * @param enums number 枚举值
         * @param flag number 值
         */
        this.orEnum = function (enums, flag) {
            return !this.andEnum(enums, flag) ? enums | flag : enums;
        }
        /**
         * @name isNullOrWhitespace(text)
         * @description 判断字符串是空值或空字符串
         * @class Util
         * @type function
         * @return 空值或空字符串都返回true，否则返回false
         * @param text string 字符串
         */
        this.isNullOrWhitespace = function (text) {
            return !(text != null && text != "");
        }
        /**
         * @name is(o, type)
         * @description 类型判断
         * @class Util
         * @type function
         * @return 类型相同返回true，否则返回false
         * @param o Object 对象实例
         * @param type string|Object 类型
         */
        this.is = function (o, type) {
            if (typeof type == "string") {
                var t = typeof o;

                if (t == "object") {
                    if (o.tagName) {
                        return o.tagName.toLowerCase() == type.toLowerCase();
                    }
                }

                return typeof o == type;
            }
            else {
                return o instanceof type;
            }
        }
        /**
         * @name toRadian(angle)
         * @description 角度转弧度
         * @class Util
         * @type function
         * @return 返回弧度
         * @param angle number 角度
         */
        this.toRadian = function (angle) {
            return angle * Math.PI / 180;
        }
        /**
         * @name toAngle(radian)
         * @description 弧度转角度
         * @class Util
         * @type function
         * @return 返回角度
         * @param radian number 弧度
         */
        this.toAngle = function (radian) {
            return radian * 180 / Math.PI;
        }
        /**
         * @name getDistance(startPoint, endPoint)
         * @description 获取两点间的距离
         * @class Util
         * @type function
         * @return 返回长度
         * @param startPoint Point 开始点
         * @param endPoint Point 结束点
         */
        this.getDistance = function(startPoint, endPoint) {

            var x = Math.abs(endPoint.x - startPoint.x);
            var y = Math.abs(endPoint.y - startPoint.y);
            return Math.sqrt(x * x + y * y);
        }
        /**
         * @name inRect(x, y, w, h, px, py, pw, ph)
         * @description 计算一个矩形是否在另一个矩形内
         * @class Util
         * @type function
         * @return 在矩形内返回true，否则返回false
         * @param x number 被测矩形x
         * @param y number 被测矩形y
         * @param w number 被测矩形宽度
         * @param h number 被测矩形高度
         * @param px number 测试矩形x
         * @param py number 测试矩形y
         * @param pw number 测试矩形宽度
         * @param ph number 测试矩形高度
         */
        this.inRect = function(x, y, w, h, px, py, pw, ph) {
            if (arguments.length == 8) {
                x = w < 0 ? w + x : x;
                y = h < 0 ? h + y : y;
                w = Math.abs(w);
                h = Math.abs(h);
                return (px >= x && (px + pw) <= w + x && py >= y && py + ph <= y + h);
            } else if (arguments.length == 6) {
                return (px >= x && px <= w + x && py >= y && py <= y + h);
            }
        }
        this.isNumber = function (number) {
            var re = /^[0-9]+.?[0-9]*$/; 
            return re.test(number);
        }
    }
    
    function Debugger(stage) {

        this.eleDebug = new lion.TextElement();
        this.eleDebug.x = 0;
        this.eleDebug.y = 0;
        this.eleDebug.canDrag = false;
        this.eleDebug.autoSize = true;
        stage.currentScene.addElement(this.eleDebug, lion.LayerMode.Force);
        this.write = function (text) {

            if (lion.Util.andEnum(lion.debug, lion.DebugMode.Info)) {
                console.log(text);
                this.eleDebug.foreColor = "black";
                this.eleDebug.text = text;
            }
        }

        this.warn = function (text) {

            if (lion.Util.andEnum(lion.debug, lion.DebugMode.Warn)) {
                console.warn(text);
                this.eleDebug.foreColor = "orange";
                this.eleDebug.text = text;
            }
        }

        this.err = function (text) {

            if (lion.Util.andEnum(lion.debug, lion.DebugMode.Error)) {
                console.error(text);
                this.eleDebug.foreColor = "red";
                this.eleDebug.text = text;
            }
        }
    }
    

    var _stageAnimations = {};
    var lion = o.lion || (o.lion = {
        
        Version: "1.0.2",
        /**
         * @name Position
         * @description 位置
         *   Free: 0,
         *   TopLeft: 4,
         *   TopRight: 5,
         *   BottomLeft: 7,
         *   BottomRight: 8
         * @file enum
         * @type enum
         */
        Position: {
            Free: 0,
            TopLeft: 4,
            TopRight: 5,
            BottomLeft: 7,
            BottomRight: 8
        },
        /**
         * @name ArrowDirection
         * @description 箭头方向
         * Left: 1,
         * Right: 2,
         * Both: 3,
         * None: 0
         * @file enum
         * @type enum
        */
        ArrowDirection: {
            Left: 1,
            Right: 2,
            Both: 3,
            None: 0
        },
        /**
         * @name TextStyle
         * @description 文本样式
         * None: 0,
         * UnderLine: 1,
         * DeleteLine: 2
         * @file enum
         * @type enum
        */
        TextStyle: {
            None: 0,
            UnderLine: 1,
            DeleteLine: 2
        },
        /**
         * @name ArrowStyle
         * @description 箭头样式
         *Triangle: 1,
         *Arrow: 2,
         *Circle: 3,
         *Rect: 4,
         *None: 0
         * @file enum
         * @type enum
        */
        ArrowStyle: {
            
            Triangle: 1,
            
            Arrow: 2,
            
            Circle: 3,
            
            Rect: 4,
            
            None: 0
        },
        /**
        * @name LineStyle
        * @description 直线样式
        * Solid: 0,
        * Dotted: 1
        * @file enum
        * @type enum
        */
        LineStyle: {
            Solid: 0,
            Dotted: 1
        },
        /**
        * @name Direction
        * @description 方向
        *Top: -1,
        *Right: -2,
        *Bottom: 1,
        *Left: 2
        * @file enum
        * @type enum
        */
        Direction: {
            Top: -1,
            Right: -2,
            Bottom: 1,
            Left: 2
        },
        /**
        * @name LayerMode
        * @description 层类型
        *Action: 0,
        *Force: 1,
        *Background: 2,
        *Virtual: 3
        * @file enum
        * @type enum
        */
        LayerMode: {
            Action: 0,
            Force: 1,
            Background: 2,
            Virtual: 3
        },
        /**
        * @name SceneMode
        * @description 场景模式
        * SingleSelect: 1, 单选模式，允许单元素选中
        * MultipleSelect: 2, 多选择模式，允许多元素选中
        * Drag: 4, 拖拽模式，允许拖拽元素
        * Edit: 8, 元素移动模式，允许进行元素移动
        * Move: 16, 移动模式，只允许场景整体平移缩放等
        * NonAction: 32, 无事件模式，不响应元素及场景的各种动作命令
        * NonAnimation: 64, 无动画模式
        * Normal: 1 | 2 | 4 | 8, 普通模式，默认场景模式
        * Preview: 32 | 64 预览模式
        * @file enum
        * @type enum
        */
        SceneMode: {
            SingleSelect: 1,
            MultipleSelect: 2,
            Drag: 4,
            Edit: 8,
            Move: 16,
            NonAction: 32,
            NonAnimation: 64,
            Normal: 1 | 2 | 4 | 8,
            Preview: 32 | 64
        },
        /**
        * @name Status
        * @description 元素的状态，此为元素状态枚举值，状态的叠加为按位异或
        *    None: 1,初始
        *    Selected: 2, 被选中
        *    Draging: 4, 拖拽中
        *    Editing: 8, 进行编辑状态
        *    Hover: 16, 悬停状态
        *    NodeHover: 32  端点悬停状态
        * @file enum
        * @type enum
        */
        
        Status: {
            
            None: 1,
            
            Selected: 2,
            
            Draging: 4,
            
            Editing: 8,
            
            Hover: 16,
            
            NodeHover: 32
        },
        Keys: {
            Shift: 16
        },
        /**
        * @name EditMode
        * @description 元素的编辑状态枚举
        *    Select: 0,选中
        *    Scale: 1, 缩放
        *    Rotate: 2, 旋转(未实现)
        *    Free: 3, 多边形自由调整
        *    NodeControl: 4, 节点控制
        * @file enum
        * @type enum
        */
        
        EditMode: {
            
            Select: 0,
            
            Scale: 1,
            
            Rotate: 2,
            
            Free: 3,
            
            NodeControl: 4,
            
            None: 5
        },
        /**
        * @name EndPointMode
        * @description EndPoint端点类型枚举
        *    Start: 0, 开始端点，主要应用Line中
        *    End: 1,  结束端点，主要应用Line中
        *    Middle: 2,  中间端点，主要应用Line中
        *    Center: 3, 中心端点，主要应用Rect中
        *    TopLeft: 11,  左上端点，主要应用Rect中
        *    TopRight: 12,  右上端点，主要应用Rect中
        *    BottomLeft: 13,  左下端点，主要应用Rect中
        *    BottomRight: 14,  右下端点，主要应用Rect中
        *    MiddleLeft: 15,  左中端点，主要应用Rect中
        *    MiddleRight: 16,  右中端点，主要应用Rect中
        *    MiddleTop: 17,  中上端点，主要应用Rect中
        *    MiddleBottom: 18,  中下端点，主要应用Rect中
        *    Free: 31
        * @file enum
        * @type enum
        */
        
        EndPointMode: {
            Start: 0,
            End: 1,
            Middle: 2,
            
            Center: 3,
            TopLeft: 11,
            TopRight: 12,
            BottomLeft: 13,
            BottomRight: 14,
            MiddleLeft: 15,
            MiddleRight: 16,
            MiddleTop: 17,
            MiddleBottom: 18,
            
            Landscape: 21,
            
            Vertical: 22,
            
            Free: 31
        },
        /**
        * @name Align
        * @description 对齐模式
        *    Center: 0, 居中对齐
        *    MiddleLeft: 1,  左中
        *    MiddleRight: 2,  右中
        *    TopMiddle: 3, 顶部居中
        *    TopLeft: 4,  左上
        *    TopRight: 5,  右上
        *    BottomMiddle: 6,  底部居中
        *    BottomLeft: 7,  左下
        *    BottomRight: 8,  右下
        *    Start: 10,  开始位置，应用于Line
        *    End: 11,  结束位置，应用于Line
        * @file enum
        * @type enum
        */
        Align: {
            Center: 0,
            MiddleLeft: 1,
            MiddleRight: 2,
            TopMiddle: 3,
            TopLeft: 4,
            TopRight: 5,
            BottomMiddle: 6,
            BottomLeft: 7,
            BottomRight: 8,
            Start: 10,
            End: 11
        },
        DebugMode: {
            None: 1,
            Info: 2,
            Warn: 4,
            Error: 8,
            All: 2 | 4 | 8
        }

    });

    lion.debug = lion.DebugMode.None;
    lion.fromJson = fromJson;
    lion.disposeAllStage = disposeAll;
    lion.Util = new Util();
    lion.Timer = {
        runing: 0,
        fps: 33,
        canRun: true,
        stages: [],
        init: function () {
            if (!lion.Timer.runing) {
                var then = Date.now();
                function tick() {

                    if (!lion.Timer.canRun) return;
                    var now = Date.now();
                    var delta = now - then;
                    if (delta > lion.Timer.fps) {

                        then = now - (delta % lion.Timer.fps);
                        for (var i = 0; i < lion.Timer.stages.length; i++)
                            if (lion.Timer.stages[i].canRender && lion.Timer.stages[i].isinited)
                                lion.Timer.stages[i].render();
                    }
                    window.requestAnimationFrame(tick);
                }

                tick();
                lion.Timer.runing = 1;
            }
        },
    };

    
    /**
    * @name Rect
    * @type class
    * @file rect
    * @description 矩形结构
    */
    function Rect(x, y, width, height) {

        /**
        * @name 矩形结构
        * @type constructor
        * @description 矩形结构
        * @class Rect
        * @param x number true x.
        * @param y number true y.
        * @param width number true width.
        * @param height number true height.
        */
        var rect = this;

        if (arguments.length == 0) {
            
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperties(Rect.prototype, {
        x: {
            get: function () {
                return this.__x__;
            },
            set: function(value) {
                lion.Util.isNumber( value ) ? this.__x__ = value : 0;

            },
            enumerable: false
        },
        y: {
            get: function () {
                return this.__y__;
            },
            set: function(value) {
                lion.Util.isNumber(value) ? this.__y__ = value : 0;

            },
            enumerable: false
        },
        width: {
            get: function () {
                return this.__width__;
            },
            set: function(value) {
                lion.Util.isNumber(value) ? this.__width__ = value : 0;

            },
            enumerable: false
        },
        height: {
            get: function () {
                return this.__height__;
            },
            set: function (value) {
                lion.Util.isNumber(value) ? this.__height__ = value : 0;

            },
            enumerable: false
        },
        empty: {
            get: function () {
                if (this.x == null || this.y == null || this.width == null || this.height == null) return true;
                if (this.x == NaN || this.y == NaN || this.width == NaN || this.height == NaN) return true;
                if (this.x == 0 && this.y == 0 && this.width == 0 && this.height == 0) return true;

                return false;
            },
            enumerable: false
        },
        /**
        * @name bounds
        * @type field
        * @datatype number
        * @description 矩形的范围
        * @class Rect
        */
        bounds: {
            get: function () {
                return {
                    leftTop: new Point(this.x, this.y),
                    rightTop: new Point(this.x + this.width, this.y),
                    leftBottom: new Point(this.x, this.y + this.height),
                    rightBottom: new Point(this.x + this.width, this.y + this.height)
                };
            },

            enumerable: true
        },
        /**
        * @name center
        * @type field
        * @datatype Point
        * @description 矩形的中心点
        * @class Rect
        */
        center: {
            get: function () {
                return new Point(this.x + this.width / 2, this.y + this.height / 2);
            },

            enumerable: true
        }
    });
    /**
    * @name intersect
    * @type function
    * @description 是否与另一个矩形相交
    * @class Rect
    * @param x Rect true 相交测试的矩形
    */
    Rect.prototype.intersect = function (rect) {
        if ((this.x + this.width > rect.x) && (this.x < rect.x + rect.width) && (this.y + this.height > rect.y) && (this.y < rect.y + rect.height)) {
            if ((this.x < rect.x) && (this.width > rect.width) && (this.y < rect.y) && (this.height > rect.height)) return 1;
            else return 0;

        }
        else {
            return -1;
        }
    }
    Rect.prototype.calc = function () {
        this.bounds.leftTop.x = this.x;
        this.bounds.leftTop.y = this.y;
        this.bounds.rightTop.x = this.x + this.width;
        this.bounds.rightTop.y = this.y;
        this.bounds.leftBottom.x = this.x;
        this.bounds.leftBottom.y = this.y + this.height;
        this.bounds.rightBottom.x = this.x + this.width;
        this.bounds.rightBottom.y = this.y + this.height;
        this.center.x = this.x + this.width / 2;
        this.center.y = this.y + this.height / 2;
    }
    lion.Rect = Rect;
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    
    
    
    !(function (namespace) {
        namespace.Animations = {};

        /**
        * @name Animation
        * @type class
        * @file animation
        * @description 动画基础类
        */
        function Animation() {
            
            this.enable = true;
            this.interval = 33;
            this.element = null;
            this.finished = false;
            
            this.endreverse = false;
            
            this.loop = true;

            var animate = this;
            
            var _invalid = true;
            
            Object.defineProperties(this, {
                invalid: {
                    get: function () {
                        return _invalid;
                    },
                    set: function (val) {
                        _invalid = val;
                        if (val) {
                            animate.element.invalidLayout();
                        }
                    },
                    enumerable: false,
                }
            });
            var _lastTime = new Date();
            this.doAnimation = function () {
                if (this.enable) {
                    var cuTime = new Date();
                    var time = cuTime - _lastTime;

                    if (time >= animate.interval) {
                        if (this.doAnimationCore() && (!animate.loop))
                            this.finished = true;
                        _lastTime = cuTime;
                    }
                }
            }

            this.doAnimationCore = function () {
            }



            this.preAnimation = function () {
            }
        }

        /**
        * @name setElement
        * @type function
        * @description 为一个元素设置动画
        * @class Animation
        * @param ele Element true 元素
        */
        Animation.prototype.setElement = function (ele) {
            this.element = ele;
        }
        namespace.Animation = Animation;
        /*
        {
            interval:100,
            endreverse:false,
            steps:[{from:0,to:100,step:1,field:'borderSize',reverse:false}]
        }
        */
        /**
        * @name StepAnimation
        * @type class
        * @file stepanimation
        * @description from-to-by单步动画
        *
        */
        function StepAnimation(json) {
            Animation.call(this);
            this.steps = [];

            var animate = this;
            this.doAnimationCore = function () {
                for (var i = 0; i < animate.steps.length; i++) {
                    if (animate.steps[i].direct == 1) {
                        

                        if (animate.element[animate.steps[i].field] >= animate.steps[i].to) {
                            if (!this.loop) return true;

                            if (animate.steps[i].endreverse) {
                                animate.steps[i].reverse();
                            }
                            animate.element[animate.steps[i].field] = animate.steps[i].from;


                        }
                        else {
                            animate.element[animate.steps[i].field] += animate.steps[i].by;
                        }
                    }
                    else {
                        

                        if (animate.element[animate.steps[i].field] <= animate.steps[i].to) {
                            if (!this.loop) return true;
                            if (animate.steps[i].endreverse) {
                                animate.steps[i].reverse();
                            }
                            animate.element[animate.steps[i].field] = animate.steps[i].from;
                        }
                        else {
                            animate.element[animate.steps[i].field] -= animate.steps[i].by;
                        }
                    }

                }

                return false;

            }

            if (json) {
                if (json.interval) this.interval = json.interval;
                for (var i = 0; i < json.steps.length; i++) {
                    if (json.steps[i] instanceof StepArgs) {
                        this.steps.push(json.steps[i]);
                    }
                    else if (json.steps[i] instanceof Object) {
                        this.steps.push(new StepArgs(json.steps[i].field, json.steps[i].from, json.steps[i].to, json.steps[i].by, json.steps[i].endreverse));
                    }

                }
            }

        }
        StepAnimation.prototype = new Animation();


        namespace.Animations.StepAnimation = StepAnimation;

        function StepArgs(field, from, to, by, endreverse) {
            this.field = field;
            this.from = from;
            this.to = to;
            var _by = by;
            this.by = (by ? by : to);
            this.endreverse = (endreverse ? endreverse : false);
            this.direct = 1;
            this.reverse = function () {

                this.direct = 0 - this.direct;
                var t = this.from;
                this.from = this.to;
                this.to = t;
                if (!_by)
                    this.by = this.to;
            }
        }
        /**
        * @name FrameAnimation
        * @type class
        * @file frameanimation
        * @description 帧动画
        *
        */
        function FrameAnimation(jsonObj) {
            Animation.call(this);
            var animate = this;
            var _index = 0;

            this.frameList = [];


            this.addFrame = function (frame) {
                if (lion.Util.is(frame, 'string')) {
                    var img = new Image();
                    img.src = frame;
                    animate.frameList.push(img);
                }

                else if (lion.Util.is(frame, Image)) {
                    animate.frameList.push(frame);
                }

            }

            this.doAnimationCore = function () {

                animate.element.backgroundImage = animate.frameList[_index];
                if (_index < animate.frameList.length - 1)
                    _index++;
                else {
                    if (!this.loop) return true;
                    _index = 0;

                }
                return false;
            }

            if (jsonObj) {
                if (jsonObj.interval) animate.interval = jsonObj.interval;
                if (jsonObj.frameList) {
                    for (var i = 0; i < jsonObj.frameList.length; i++)
                        animate.addFrame(jsonObj.frameList[i]);

                }
                if (jsonObj.enable != undefined) {
                    animate.enable = jsonObj.enable;
                }

            }

        }

        FrameAnimation.prototype = new Animation();
        namespace.Animations.FrameAnimation = FrameAnimation;
        FrameAnimation.prototype.setElement = function (ele) {
            Animation.prototype.setElement.call(this, ele);
            this.doAnimationCore();
        }

        /**
        * @name PathAnimation
        * @type class
        * @file pathanimation
        * @description 路径动画，允许将某个元素绑定至某条Line对象上
        *
        */
        function PathAnimation(obj) {
            Animation.call(this);
            
            this.stepLength = 10;
            this.path = [];
            this.speed = 3;
            var animate = this;
            var _index = 0;
            var _points = [];
            var _calcing = false;
            this.addPath = function (line) {
          
                animate.path.push(line);
                getPoints(line);


                
            }
            this.doAnimationCore = function () {
                if (_points.length > 0) {
                    animate.element.x = _points[_index].x - animate.element.drawBounds.width / 2;
                    animate.element.y = _points[_index].y - animate.element.drawBounds.height / 2;
                    if (_index < _points.length - 1)
                        _index++;
                    else {
                        _calcing = false;
                        if (!this.loop) return true;
                        _index = 0;
                    }
                }
                return false;
            }

            function getPoints(line) {
                var steplen = animate.speed;
                var step = 0;
                if (line.x1 == line.x2) {
                    
                    
                    step = Math.abs(Math.abs(line.y2) - Math.abs(line.y1)) / steplen;

                    for (var i = 0; i < step; i++) {
                        var y = line.y2 > line.y1 ? line.y1 + i * steplen : line.y1 - i * steplen;
                        _points.push({
                            x: line.x1, y: y
                        });
                    }
                }
                else if (line.y1 == line.y2) {
                    
                    
                    step = Math.abs(Math.abs(line.x2) - Math.abs(line.x1)) / steplen;
                    for (var i = 0; i < step; i++) {
                        var x = line.x2 > line.x1 ? line.x1 + i * steplen : line.x1 - i * steplen;
                        _points.push({
                            x: x, y: line.y1
                        });
                    }
                }
                else {

                    
                    var k = ((line.y1 - line.y2)) / (line.x1 - line.x2);

                    step = Math.abs(Math.abs(line.x2) - Math.abs(line.x1)) / steplen;
                    
                    for (var i = 0; i < step; i++) {

                        
                        if (k > 0) {
                            var y = line.y1 > line.y2 > 0 ? line.y1 - k * (i * steplen) : k * (i * steplen) + line.y1;
                            var x = line.x1 > line.x2 > 0 ? line.x1 - i * steplen : line.x1 + i * steplen;
                            _points.push({
                                x: x, y: y
                            });
                        }
                        else {
                            var y = line.y1 < line.y2 > 0 ? line.y1 - k * (i * steplen) : k * (i * steplen) + line.y1;
                            var x = line.x1 > line.x2 > 0 ? line.x1 - i * steplen : line.x1 + i * steplen;
                            _points.push({
                                x: x, y: y
                            });
                        }

                    }
                }
            }


            var line;
            this.preAnimation = function () {
                if (animate.invalid ) {
                    if (line && line.points.length > 0) {
                        _index = 0;
                        animate.path = [];
                        _points = [];
                        for (var i = 1; i < line.points.length; i++) {
                            animate.addPath({
                                x1: line.points[i - 1].x / line.scale,
                                y1: line.points[i - 1].y / line.scale,
                                x2: line.points[i].x / line.scale,
                                y2: line.points[i].y / line.scale
                            });

                        }

       
                    }

                    animate.invalid = false;
                }
      

            }

            if (obj) {
                if (obj instanceof lion.LineElement) {
                    line = obj;
                    line.bindPathAnimations.push(animate);

                }
                else if (obj instanceof Object) {
                    if (obj.interval) animate.interval = obj.interval;
                    if (obj.path) {
                        for (var i = 0; i < obj.path.length; i++)
                            animate.addPath(obj.path[i]);
                    }
                }
                else {
                    throw 'datatype must be json or LineElement';
                }
            }
        }

        PathAnimation.prototype = new Animation();
        namespace.Animations.PathAnimation = PathAnimation;
    })(lion);

    

    
    !(function (namespace) {
        function Gradient(type, x1, y1, x2, y2, color1, color2) {
        this.type = type;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.colors = [];
        if (color1 && color2) {
            this.addColorStop(0, color1);
            this.addColorStop(1, color2);
        }
    }
        namespace.Gradient = Gradient;
    Gradient.Type = {
        Linear: 1,
        Radial: 2
    }
    Object.defineProperties(Gradient.prototype, {

        drawPoint1: {
            get: function () {
                    return new Point(this.owner.drawBounds.x + this.x1 * this.owner.scale,
                        this.owner.drawBounds.y + this.y1 * this.owner.scale);
            },

                enumerable: true
            },
            drawPoint2: {
                get: function () {
                    return new Point(this.owner.drawBounds.x + this.x2 * this.owner.scale,
                        this.owner.drawBounds.y + this.y2 * this.owner.scale);
                },

                enumerable: true
            }
        });
        Gradient.prototype.addColorStop = function (step, color) {
            this.colors.push({
                step: step,
                color: color
        });
    }
    Gradient.prototype.setOwner = function (owner) {
        this.owner = owner;
    }
    })(lion);

  

    

    !(function (namespace) {
        function ImageList() {
            this.list = [];
            this.callback;
            var il = this;
        }
        ImageList.prototype.load = function (arr) {

            var loadedCount = 0;
            function loaded() {
                loadedCount++;
                if (loadedCount == il.list.length && il.callback) {
                    il.callback(il.list);
                }
            }

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] instanceof Image) {
                    this.list.push(arr[i]);
                }
                else if (lion.Util.is(arr[i], 'string')) {
                    var img = new Image();
                    img.onload = loaded;
                    img.src = arr[i];
                    this.list.push(img);
                }
                
                this.list[i].onloadedmetadata = loaded;
            }
        }
        ImageList.prototype.onLoaded = function (fn) {
            this.callback = fn;
        }
        ImageList.prototype.getImage = function (i) {
            return this.list[i];
        }
        namespace.ImageList = ImageList;
    })(lion);

    !(function (namespace) {
        function ImageMatrix(bWidth, bHeight,matrix) {
            namespace.ImageList.call(this);
            this.blockWidth = bWidth;
            this.blockHeight = bHeight;
            this.matrixCut = (matrix == undefined) ? true : matrix;
        }
        ImageMatrix.prototype = new namespace.ImageList();
        ImageMatrix.prototype.load = function (data) {
            var im = this;
            var width = this.blockWidth;
            var height = this.blockHeight;

            var img = new Image();
            img.onload = function () {
                var srcwc = parseInt(img.width / width);
                var srchc = parseInt(img.height / height);

                var tcan = document.createElement("canvas");
                tcan.setAttribute("width", width + "px");
                tcan.setAttribute("height", height + "px");
                var g = tcan.getContext('2d');
                g.save();
                
                if (im.matrixCut) {
                    for (var y = 0; y < srchc; y++) {
                        im.list[y] = [];
                        for (var x = 0; x < srcwc; x++) {
                            transparent(g, width, height);
                            g.drawImage(img, x * width, y * height, width, height, 0, 0, width, height);
                            var thumbnail = tcan.toDataURL();
                            im.list[y][x] = thumbnail;
                        }
                    }
                }
                else {
                    var index = 0;
                    for (var y = 0; y < srchc; y++) {
                        for (var x = 0; x < srcwc; x++) {
                            transparent(g, width, height);
                            g.drawImage(img, x * width, y * height, width, height, 0, 0, width, height);
                            var thumbnail = tcan.toDataURL();
                            im.list[index] = thumbnail;
                            index++;
                        }
                    }
                }

                if (im.callback)
                    im.callback(im.list);
            }
            img.src = data;

            
            function transparent(ctx, width, height) {
                var imgData = ctx.getImageData(0, 0, width, height);
                for (var i = 0, len = imgData.data.length ; i < len ; i += 4) {
                    
                    imgData.data[i + 3] = imgData.data[i + 3] * 0;
                }
                 
                ctx.putImageData(imgData, 0, 0);
            }
        }
        namespace.ImageMatrix = ImageMatrix;
    })(lion);

    

    
    !(function (namespace) {
        /**
        * @name Element
        * @type class
        * @file element
        * @description 元素基类,所有元素都将继承至此
        */
        function Element() {

            this.type = "lion.Element";

            this.__data__ = {};
            var data = this.__data__;

            data.id = -1;
            data.parent = null;
            data.stage = null;
            data.events = {};
            data.invalid = true;
            data.isdisposed = false;


        };
        Element.prototype.setValue = function (key, val) {
            this.__data__[key] = val;
        }
        Element.prototype.getValue = function (key) {
            return this.__data__[key];
        }

        Object.defineProperties(Element.prototype, {
            /**
            * @name id
            * @type field
            * @datatype number
            * @description 获取元素的唯一ID，该id为系统自动生成
            * @class Element
            */
            id: {
                get: function () {
                    return this.getValue('id');
                },
                enumerable: true
            },
            /**
            * @name id
            * @type field
            * @datatype number
            * @description 获取当前元素是否无效，从而导致重新渲染
            * @class Element
            */
            invalid: {
                get: function () {
                    return this.getValue('invalid');
                },
                enumerable: false
            },
            /**
            * @name parent
            * @type field
            * @datatype Element
            * @description 获取父元素
            * @class Element
            */
            parent: {
                get: function () {
                    return this.getValue('parent');
                },
                set: function (value) {
                    this.setValue('parent', value);
                },
                enumerable: false
            },
            /**
            * @name stage
            * @type field
            * @datatype Stage
            * @description 获取元素所属的舞台
            * @class Element
            */
            stage: {
                get: function () {
                    return this.getValue('stage');
                },
                set: function (value) {
                    this.setValue('stage', value);
                },
                enumerable: false
            },
            /**
            * @name events
            * @type field
            * @datatype Object
            * @description 元素所绑定的事件
            * @class Element
            */
            events: {
                get: function () {
                    return this.getValue('events');
                },
                enumerable: false
            },
            /**
            * @name isdisposed
            * @type field
            * @datatype bool
            * @description 获取该元素是否已清理释放
            * @class Element
            */
            isdisposed: {
                get: function () {
                    return this.getValue('isdisposed');
                },
                set: function (value) {
                    this.setValue('isdisposed', value);
                },
                enumerable: false
            }
        });

        /**
        * @name invalidLayout
        * @type function
        * @description 使当前布局无效,并导致重新布局
        * @class Element
        */
        Element.prototype.invalidLayout = function (mode) {
            
            
            
            this.setValue('invalid', true);
        }
        /**
        * @name clone
        * @type function
        * @description 克隆当前元素
        * @return Element
        * @class Element
        */
        Element.prototype.clone = function () {

            var type = eval(this.type);
            var obj = new type();
            for (var i in this) {
                if (i == "id") continue;
                if (namespace.Util.is(this[i], "function")) continue;
                if (namespace.Util.is(this[i], "object")) continue;
                obj[i] = this[i];
            }

            if (obj instanceof namespace.LineElement) {
                obj.setPoint(this.startNode.x + 10, this.startNode.y + 10, this.endNode.x + 10, this.endNode.y + 10);
            } else {
                obj.x += 10;
                obj.y += 10;
            }

            return obj;
        }
        /**
        * @name setParent
        * @type function
        * @description 设置父级元素
        * @class parentEle
        */
        Element.prototype.setParent = function (parentEle) {
            this.parent = parentEle;
        }
        /**
        * @name serialize
        * @type function
        * @description 序列化元素
        * @class Element
        */
        Element.prototype.serialize = function (ele) {
            
            var obj = ele ? ele : this;
            var json = "{";


            for (var i in obj) {
                if (i.indexOf('$') == 0) continue;
                if (obj[i] == null && obj[i] == undefined) {
                    json += '"' + i + '"' + ":null,";
                    continue;
                }

                if (namespace.Util.is(obj[i], "number"))
                    json += '"' + i + '"' + ":" + obj[i] + ",";
                else if (namespace.Util.is(obj[i], "string"))
                    json += '"' + i + '"' + ':"' + obj[i] + '",';
                else if (namespace.Util.is(obj[i], "object")) {
                    var s = obj.onserialize(i, obj[i]);
                    if (s)
                        json += s + ",";
                } else if (namespace.Util.is(obj[i], "boolean")) {
                    json += '"' + i + '"' + ":" + (obj[i] ? "true" : "false") + ",";
                } else if (namespace.Util.is(obj[i], "function")) {
                } else {
                    
                }
            }

            if (json[json.length - 1] == ",")
                json = json.substr(0, json.length - 1);

            json += "}";

            return json;
        }

        /**
        * @name getOutRect
        * @type function
        * @description 获取几何元素外框形成的矩形区域，包含边框及文本区域
        * @class Element
        */
        Element.prototype.getOutRect = function () {

            if (this.drawBounds.empty) {
                return new Rect(this.x, this.y, this.width, this.height);
            }
            else {
                var rect = this.drawBounds;
                var r = new Rect(rect.x, rect.y, rect.width, rect.height);
                if (this.isTextElement) {
                    var drawRect = this.getTextRect();
                    if (drawRect)
                        r = getRectFromRects([rect, drawRect]);
                }


                if (this.borderSize > 0) {
                    r.x -= this.borderSize;
                    r.y -= this.borderSize;
                    r.width += this.borderSize * 2;
                    r.height += this.borderSize * 2;
                }

                return r;
            }
        }

        /**
        * @name equals
        * @type function
        * @description 两个元素是否相同
        * @class Element
        * @param ele Element true 比较的元素
        */
        Element.prototype.equals = function (ele) {

            if (ele != null) {
                return this.id == ele.id;
            }
            return false;
        }
Element.prototype.onserialize = function (key, value) {
            return null;
            }
        Element.prototype.ondeserialize = function (key, value) {
            return false;
        }

        Element.prototype.enddeserialize = function () {

        }
            /**
            * @name dispose
            * @type function
            * @description 释放该元素调用的所有资源
            * @class Element
            */
        Element.prototype.dispose = function () {
            if (!this.isdisposed) {
                this.isdisposed = true;
        }
        }


        Element.deserialize = function (json, param) {
            
            
            var type = eval(json.type);
            var obj = null;
            if (json.type == 'lion.Stage')
                obj = new type(param, true);
            else
                obj = new type(param);
            for (var i in json) {
                if (i == 'type') continue;
                if (i == 'id') obj.setValue(i, json[i]);
                else if(!obj.ondeserialize(i, json[i])) {
                    obj[i]= json[i];
        }
            }

            return obj;
            }
        namespace.Element = Element;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name Stage
        * @type class
        * @file stage
        * @inherit Element
        * @description 舞台
        */
        function Stage(div) {
            /**
             * @name  Stage(div)
             * @type constructor
             * @description 实例化一个舞台
             * @class Stage
             * @param div string|dom true 需要填充的div的id或者dom实例.

             */

            namespace.Element.call(this);
            this.type = "lion.Stage";
            this.scenes = [];
            this.currentScene = null;
            this.backgroundColor = null;

            var ostage = this;

            var _div = null;
            if (namespace.Util.is(div, "string")) _div = document.getElementById(div);
            else _div = div;
            var _autoSize = null;
            var _isinited = null;
            var _canRender = true;
            var _debugger = null;

            Object.defineProperties(this, {
                /**
                * @name autoSize
                * @type field
                * @datatype bool
                * @description 获取或设置舞台是否自动大小
                * @class Stage
                */
                autoSize: {
                    get: function () {
                        return _autoSize;
                    },
                    set: function (val) {
                        _autoSize = val;
                    },
                    enumerable: false
                },
                /**
                * @name debugger
                * @type field
                * @datatype Debugger
                * @description 获取调试器
                * @class Stage
                */
                debugger: {
                    get: function () {
                        return _debugger;
                    },
                    enumerable: false
                },
                /**
                * @name isinited
                * @type field
                * @datatype bool
                * @description 是否初始化完毕
                * @class Stage
                */
                isinited: {
                    get: function () {
                        return _isinited;
                    },
                    set: function (val) {
                        _isinited = val;
                    },
                    enumerable: false
                },
                /**
                * @name canRender
                * @type field
                * @datatype bool
                * @description 是否允许渲染该舞台
                * @class Stage
                */
                canRender: {
                    get: function () {
                        return _canRender;
                    },
                    set: function (val) {
                        _canRender = val;
                    },
                    enumerable: false
                },
                /**
                * @name cursor
                * @type field
                * @datatype string
                * @description 获取或设置当前的鼠标样式
                * @class Stage
                */
                cursor: {
                    get: function () {
                        return _div.style.cursor;
                    },
                    set: function (val) {
                        _div.style.cursor = val;
                    },
                    enumerable: false
                }
            });
            /**
            * @name createImage(callback, w, h)
            * @type function
            * @description 按尺寸生成png图片
            * @class Stage
            * @param callback function true 生成图片的回调函数
            * @param w number false 生成图片宽度
            * @param h number false 生成图片宽度
            */
            this.createImage = function (callback, w, h) {
                if (w && h) {
                    var imgdata = ostage.canvas.toDataURL();

                    var tcan = $("<canvas width='" + w + "px' height='" + h + "px' ></canvas>");
                    var g = tcan[0].getContext('2d');
                    var img = new Image(w, h);
                    img.src = imgdata;
                    img.set
                    var thumbnail = null;
                    img.onload = function () {
                        g.drawImage(img, 0, 0, w, h);
                        thumbnail = tcan[0].toDataURL();

                        callback(thumbnail);
                    }

                }
                else {
                    callback(ostage.canvas.toDataURL());
                }
            }
            /**
            * @name stopRender()
            * @type function
            * @description 停止渲染
            * @class Stage
            */
            this.stopRender = function () {
                this.canRender = false;
            }
            /**
            * @name stopRender()
            * @type function
            * @description 开始渲染
            * @class Stage
            */
            this.startRender = function () {
                this.canRender = true;
            }
            /**
            * @name addScene(scene)
            * @type function
            * @description 添加一个场景
            * @class Stage
            * @param scene Sence true 需要添加的场景
            */
            this.addScene = function (scene) {
                if (scene.id == -1) scene.setValue('id', generateId());
                ostage.scenes.push(scene);
                scene.setParent(ostage);

                if (scene.width < ostage.width) scene.width = ostage.width;
                if (scene.height < ostage.height) scene.height = ostage.height;
            }
            /**
            * @name changeScene(i)
            * @type function
            * @description 切换场景
            * @class Stage
            * @param i Sence true 场景索引
            */
            this.changeScene = function (i) {
                ostage.currentScene = this.scenes[i];
            }

            function doAnimation() {

                for (var i in _stageAnimations) {
                    if (_stageAnimations[i] instanceof namespace.Animation) {
                        _stageAnimations[i].doAnimation();
                        if (_stageAnimations[i].finished) {
                            delete _stageAnimations[i];
                        }
                    }
                }

            }

            this.renderBackground = function (g) {
                if (ostage.backgroundColor) {
                    g.fillStyle = ostage.backgroundColor;
                    g.fillRect(0, 0, ostage.width, ostage.height);
                }
            }

            this.render = function () {

                var g = ostage.canvas.getContext('2d');
                g.msImageSmoothingEnabled = true;
                if (ostage.currentScene) {
                    doAnimation();
                    ostage.renderBackground(g);
                    ostage.currentScene.preRender(g);

                    ostage.currentScene.renderBackground(g);
                    ostage.currentScene.render(g);

                }

            }
            /**
            * @name resetSize(w, h, resetscene)
            * @type function
            * @description 重置舞台大小
            * @class Stage
            * @param w number true 重置的舞台宽度
            * @param h number true 重置的舞台高度
            * @param resetscene bool true 是否对场景进行重置
            */
            this.resetSize = function (w, h, resetscene) {
                ostage.width = w;
                ostage.height = h;
                if (resetscene) {
                    for (var i = 0; i < ostage.scenes.length; i++) {
                        if (ostage.scenes[i].width < ostage.width)
                            ostage.scenes[i].width = ostage.width;
                        if (ostage.scenes[i].height < ostage.height)
                            ostage.scenes[i].height = ostage.height;
                    }
                }
            }
            /**
            * @name fill()
            * @type function
            * @description 将舞台下元素以舞台大小进行填充
            * @class Stage
            */
            this.fill = function () {

                var s = ostage.width / ostage.currentScene.width;
                var s2 = ostage.height / ostage.currentScene.height;
                ostage.currentScene.setScale(s);
            }
            /**
            * @name fillCenter()
            * @type function
            * @description 将舞台下元素以舞台大小进行填充并居中
            * @class Stage
            */
            this.fillCenter = function () {
                function ansyc() {
                    window.requestAnimationFrame(function () {
                        var rect = getRect(ostage.currentScene.layers.action.elements);
                        if (rect.width && rect.height) {
                            var s1 = ostage.width / rect.width;
                            var s2 = ostage.height / rect.height;
                            var scale = s1 < s2 ? s1 : s2;
                            ostage.currentScene.x -= rect.x;
                            ostage.currentScene.y -= rect.y;
                            ostage.currentScene.setScale(scale);
                        }
                        else {
                            ansyc();
                        }
                    });
                }
                ansyc();
            }



            this.new = function (type, param) {
                return this.create(type, param);
            }
            this.create = function (type, param) {

                var objtype = type;
                if (namespace.Util.is(type, 'string')) {
                    objtype = eval(type);
                }
                
                obj = new objtype(param);
                if (arguments.length == 3) {
                    obj.setValue('id', arguments[2]);
                }
                else {
                    obj.setValue('id', generateId());
                }
                return obj;

            }

            /**
      * @name dispose()
      * @type function
      * @description 释放该舞台调用的所有资源
      * @class Stage
      */
            this.dispose = function () {
                
                
                
                if (!this.isdisposed) {
                    var i = -1;
                    for (i = 0; i < namespace.Timer.stages.length; i++) {
                        if (namespace.Timer.stages[i]) {
                            if (this.equals(namespace.Timer.stages[i]))
                                break;
                        }
                    }

                    if (i > -1) {

                        this.canvas.remove();

                        for (var n = 0; n < this.scenes.length; n++) {
                            this.scenes[n].dispose();
                            this.scenes[n] = null;
                            this.scenes = [];
                        }

                        _stageAnimations = {};

                        namespace.Timer.stages.splice(i, 1);
                    }
                    this.isdisposed = true;
                }
                else {
                    console.log('object was disposed');
                }
            }


            !(function (o) {

                ostage.autoSize = false;
                var width = _div.clientWidth;
                var height = _div.clientHeight;
                var can = document.createElement('canvas');
                can.setAttribute('width', width + 'px');
                can.setAttribute('height', height + 'px');
                
                _div.style.overflow = "hidden";
                _div.appendChild(can);
                ostage.canvas = can;
                ostage.width = width;
                ostage.height = height;
                ostage.drawBounds = new Rect(0, 0, width, height);
                ostage.canvas.onmousedown = function (e) {
                    if (ostage.currentScene)
                        ostage.currentScene.__onmousedown(e);
                };
                ostage.canvas.onmousemove = function (e) {
                    if (e.button == 0) {
                        if (ostage.currentScene)
                            ostage.currentScene.__onmousemove(e);
                    }
                };
                ostage.canvas.onmouseup = function (e) {
                    
                        if (ostage.currentScene)
                            ostage.currentScene.__onmouseup(e);
                    
                };
                ostage.canvas.ondblclick = function (e) {
                    if (ostage.currentScene)
                        ostage.currentScene.__ondblclick(e);
                };

                window.addEventListener("keydown", function (e) {
                    if (ostage.currentScene)
                        ostage.currentScene.__onkeypress(e);
                });

                if (!o[1]) {
                    ostage.setValue('id', generateId());
                    var scene = ostage.create(namespace.Scene);
                    ostage.addScene(scene);
                    ostage.changeScene(0);
                    ostage.isinited = true;
                }
                else {
                    
                    ostage.isinited = false;
                }

       
                _debugger = new Debugger(ostage);
                ostage.debugger.write("Stage Inited");

            })(arguments);

            this.notifyCmd = function (cmd, args) {
                if (cmd == "updateGraphicText") {
                    buildGraphicTextDom(args)
                }
                else if (cmd == "getGraphicText") {
                    return getGraphicText(args);
                }
                else if (cmd == "removeGraphicText") {
                    removeGraphicTextDom(args);
                }

            }

            
            var graphicTexts = {};
            function getGraphicText(args) {

                return graphicTexts[args.id] != null ? graphicTexts[args.id].textContent : null;
            }

            function removeGraphicTextDom(args) {
                if (graphicTexts[args.id] != null) {
                    graphicTexts[args.id].remove();
                    delete graphicTexts[args.id];
                }
            }
            function buildGraphicTextDom(args) {
                if (graphicTexts[args.id] == null) {
                    var span = document.createElement("span");
                    span.id = args.id;
                    span.style.fontFamily = args.font;
                    
                    span.style.display = "none";
                    span.innerHTML = args.text;
                    _div.appendChild(span);
                    graphicTexts[args.id] = span;
                }
                else {
                    graphicTexts[args.id].innerHTML = args.text;
                }
            }
            

            /**
               * @name enableContextMenu(isenbale)
               * @type function
               * @description 是否启用系统菜单，默认启用
               * @class Stage
               * @param isenbale bool true true为启用，false为禁用
               */
            this.enableContextMenu = function (isenbale) {
                if (!isenbale) {
                    _div.oncontextmenu = function () {
                        self.event.returnValue = false
                    }
                }

            }
            namespace.Timer.stages.push(ostage);
        }
        Stage.prototype = new namespace.Element();
        Stage.prototype.serialize = function () {

            var json = "[{";
            json += '"engine":"lion",';
            json += '"copyright":"keith dan",';
            json += '"version":"' + namespace.Version + '",';
            json += '"stage":';
            json += namespace.Element.prototype.serialize.call(this, this);
            json += '}]';
            return json;

        }
        Stage.prototype.setParent = function (parentEle) {

        }
        Stage.prototype.onserialize = function (key, value) {
            var json = "";
            if (key == "scenes") {
                json += '"' + key + '"' + ":[";
                for (var i = 0; i < value.length; i++)
                    json += value[i].serialize() + ",";

                if (json[json.length - 1] == ",")
                    json = json.substr(0, json.length - 1);
                json += "]";
            }

            return json;
        }

        Stage.prototype.ondeserialize = function (key, value) {

            if (key == "scenes") {

                for (var i = 0; i < value.length; i++) {
                    this.addScene(Element.deserialize(value[i]));
                }

                return true;
            }
            if (this.autoSize) {
                if (key == "width") return true;
                if (key == "height") return true;
            }

            return false;
        }

        Stage.prototype.enddeserialize = function () {
            for (var i = 0; i < this.scenes.length; i++)
                this.scenes[i].enddeserialize();
            this.changeScene(0);
            this.isinited = true;
        }

        namespace.Stage = Stage;
    })(lion);

    

    
    !(function (namespace) {
        /**
        * @name Layer
        * @type class
        * @file layer
        * @inherit Element
        * @description 层
        */
        function Layer(layermode) {
            namespace.Element.call(this);
            
            this.type = "lion.Layer";
            this.elements = [];
            /**
            * @name mode
            * @type field
            * @datatype number
            * @description 层的类型，其类型为枚举值LayerMode
            * Force: 1,前景层，其坐标固定为0，大小固定为舞台大小，不随场景大小变化，第一响应事件
            * Action 0,动作层，其坐标大小为随场景变化，第二优先响应事件
            * Background: 2,背景层，其坐标大小为随场景变化，无事件响应
            * Virtual: 3，虚拟层，其坐标固定为0，大小固定为舞台大小,所有元素均为一次性，动作完成元素即被清除
            * @class Layer
            */
            this.mode = layermode;
            
            var layer = this;

            
            var _scale = 1.0;
            var _rangleMove = false;
            var _stepMove = false;
            var _stepOffset = new Point();
            var _scene = null;
            var _displayBounds;
            var _mousePoint;
            
            
            Object.defineProperties(this, {
                scene: {
                    get: function () {
                        return _scene;
                    },
                    set: function (val) {
                        _scene = val;
                    },
                    enumerable: false
                },
                width: {
                    get: function () {
                        if (layer.mode == namespace.LayerMode.Force)
                            return layer.scene.stage.width;
                        else
                            return layer.scene.width;
                    },
                    enumerable: false
                },
                height: {
                    get: function () {
                        if (layer.mode == namespace.LayerMode.Force)
                            return layer.scene.stage.height;
                        else
                            return layer.scene.height;
                    },
                    enumerable: false
                },
                x: {
                    get: function () {
                        if (layer.mode == namespace.LayerMode.Force || layer.mode == namespace.LayerMode.Virtual)
                            return 0;
                        else
                            return layer.scene.x;
                    },
                    enumerable: false
                },
                y: {
                    get: function () {
                        if (layer.mode == namespace.LayerMode.Force || layer.mode == namespace.LayerMode.Virtual)
                            return 0;
                        else
                            return layer.scene.y;
                    },
                    enumerable: false
                },
                drawBounds: {
                    get: function () {
                        
                        _displayBounds = new Rect(layer.x, layer.y, layer.scene.stage.width, layer.scene.stage.height);
                        return _displayBounds;
                    },
                    enumerable: false
                }
            });


            
            /**
            * @name toFront(ele)
            * @type function
            * @description 将元素放置于最顶层
            * @class Layer
            * @param ele Element true 操作额元素
            */
            this.toFront = function (ele) {
                var index = -1;
                for (var i = 0; i < _allElements.length; i++) {
                    if (ele.equals(_allElements[i])) {
                        index = i;
                        break;
                    }
                }

                _allElements.splice(i, 1);
                _allElements.push(ele);

                if (ele instanceof namespace.Group) {
                    this.__toFrontGroup(ele);
                }
            }



            this.__toFrontGroup = function (group) {
                for (var i = 0; i < group.elements.length; i++) {
                    this.toFront(group.elements[i]);
                }
            }
            this.getMousePoint = function () {
                return _mousePoint;
            }

            /**
            * @name toBack(ele)
            * @type function
            * @description 将元素放置于最底层
            * @class Layer
            * @param ele Element true 操作额元素
            */
            this.toBack = function (ele) {
                var index = -1;
                for (var i = 0; i < _allElements.length; i++) {

                    if (ele.equals(_allElements[i])) {
                        index = i;
                        break;
                    }

                }
                _allElements.splice(i, 1);
                _allElements.splice(0, 0, ele);

                if (ele instanceof namespace.Group) {
                    this.__toBackGroup(ele);
                }
            }

            this.__toBackGroup = function (group) {
                for (var i = 0; i < group.elements.length; i++) {
                    this.toBack(group.elements[i]);
                }
            }

            this.moveOnRAngle = function (bool) {
                _rangleMove = bool;
            }

            this.moveOnGrid = function (bool) {
                _stepMove = bool;
            }
            /**
            * @name refresh()
            * @type function
            * @description 立即刷新层
            * @class Layer
            */
            this.refresh = function () {
                for (var i = 0; i < layer.elements.length; i++) {
                    layer.elements[i].invalidLayout();
                }
            }

            this.setScale = function (scale) {
                _scale = scale;
                for (var i = 0; i < layer.elements.length; i++) {
                    layer.elements[i].setScale(scale);
                }
                layer.refresh();
            }
            /**
            * @name remove(ele)
            * @type function
            * @description 移除某个元素
            * @class Layer
            * @param ele Element true 操作的元素
            */
            this.remove = function (ele) {

                if (ele instanceof namespace.Group) {
                    for (var i = 0; i < ele.elements.length; i++) {
                        removeCore(_allElements, ele.elements[i]);
                        removeCore(layer.elements, ele.elements[i]);
                    }
                }
                removeCore(layer.elements, ele);
                if (ele instanceof namespace.LinkElement) {
                    removeCore(_alllinks, ele);
                }
                else if (ele instanceof namespace.Tooltip) {
                    removeCore(_allTooltips, ele);
                }
                else {
                    removeCore(_allElements, ele);
                }
            }

            function removeCore(eles, ele) {
                var n = -1;
                for (var i = 0; i < eles.length; i++)
                    if (eles[i].equals(ele)) {
                        n = parseInt(i);
                        break;
                    }

                if (n > -1) {
                    eles.splice(n, 1);
                }
            }

            /**
                        * @name clear()
                        * @type function
                        * @description 清除所有元素
                        * @class Layer
                        */
            this.clear = function () {
                for (var i = 0; i < layer.elements.length; i++) {
                    layer.elements[i].dispose();
                }
                layer.elements.splice(0);
                _allElements.splice(0);
                _alllinks.splice(0);
                _allTooltips.splice(0);
            }
            /*
            将层内元素分为连线和其他元素，分别渲染
            在鼠标事件中，首先触发元素，其次为连线，保证了在大量连线的情况下无法选中元素的问题
            */
            var _alllinks = [];
            var _allElements = [];
            var _allTooltips = [];
            /**
            * @name add(ele)
            * @type function
            * @description 添加某个元素
            * @class Layer
            * @param ele Element true 操作的元素
            */
            this.add = function (ele) {
                if (ele.id == -1) {
                    ele.setValue('id', generateId());
                }
                layer.elements.push(ele);
                if (ele instanceof namespace.LinkElement) {
                    _alllinks.push(ele);
                }
                else if (ele instanceof namespace.Tooltip) {
                    _allTooltips.push(ele);
                }
                else {
                    _allElements.push(ele);
                }
                ele.setParent(layer);
            }


            this.setTooltip = function (ele) {
                _allTooltips.push(ele);
            }

            
            var _offset = {
            };
            
            var _selectedElement = [];
            
            var _actionElement = null;
            
            var _hoverElement = null;
            
            var _waitDragElement = null;
            var _beginDrag = false;
            /**
            * @name getHoverElement()
            * @type function
            * @description 获取当前悬停的元素
            * @class Layer
            * @return 操作的元素
            */
            this.getHoverElement = function () {
                return _hoverElement;
            }
            /**
            * @name getHoverElement()
            * @type function
            * @description 获取当前悬停的元素
            * @class Layer
            * @return Element元素
            */
            this.getActionElement = function () {
                return _actionElement;
            }
            /**
            * @name getSelectedElement()
            * @type function
            * @description 获取选中的元素
            * @class Layer
            * @return Element选中的元素
            */
            this.getSelectedElement = function () {
                return _selectedElement;
            }
            /**
            * @name cancelSelected()
            * @type function
            * @description 取消本次选中
            * @class Layer
            */
            this.cancelSelected = function () {
                for (var i = 0; i < _selectedElement.length; i++)
                    _selectedElement[i].status = namespace.Status.None;
                _selectedElement.splice(0);
            }

            this.cancelAction = function () {
                _actionElement = null;
                _hoverElement = null;
            }
            /**
            * @name selectAll()
            * @type function
            * @description 选中所有元素
            * @class Layer
            * @return Element选中的元素
            */
            this.selectAll = function () {

                
                for (var i = 0; i < _allElements.length; i++) {
                    _allElements[i].status = namespace.Status.Selected;
                    _selectedElement.push(_allElements[i]);
                }

                return _selectedElement;
            }



            


            
            var _mousedown = false;
            
            var _mousedownPoint = new Point();
            this.onmousedown = function (e) {
                if (_mousedownPoint.x - e.offsetX == 0 && _mousedownPoint.y - e.offsetY == 0) {
                    hoverElements(this.elements, e, _hoverElement);
                }

                if (e.button == 0) {
                    _mousedown = true;
                    _mousedownPoint.x = e.offsetX;
                    _mousedownPoint.y = e.offsetY;

                    
                    if (_hoverElement) {
                        var ele = _hoverElement;
                        
                        if (_selectedElement.length > 0) {
                            var canmove = false;
                            for (var i = 0; i < _selectedElement.length; i++) {
                                if (_selectedElement[i].equals(ele)) {
                                    
                                    _actionElement = _selectedElement[i];
                                    canmove = true;
                                    break;
                                }
                            }

                            if (canmove) {
                                _offset.x = e.offsetX;
                                _offset.y = e.offsetY;
                                return _actionElement;
                            } else {
                                layer.cancelAction();
                                layer.cancelSelected();
                            }
                        }
                        else if (ele.canEvent && (ele.canDrag || ele.canSelect)) {

                            
                            if (ele.editMode == namespace.EditMode.Select) {
                                _selectedElement.push(ele);
                                _actionElement = ele;
                                ele.status = namespace.Status.Selected;
                                _offset.x = e.offsetX;
                                _offset.y = e.offsetY;

                                return ele;
                            }
                                
                            else if (ele.editMode > namespace.EditMode.Select) {
                                _actionElement = ele;
                                _selectedElement.push(ele);
                                var actionnode = ele.testNode(e.offsetX, e.offsetY);
                                if (actionnode) {
                                    _offset.x = e.offsetX;
                                    _offset.y = e.offsetY;
                                    ele.controlNode = actionnode;
                                    return ele;
                                }
                            }
                        }
                        else if (ele.canEvent) {
                            if (ele.editMode == namespace.EditMode.Select) {
                                _actionElement = ele;


                                return ele;
                            }
                        }
                    }
                    else {
                        
                        layer.cancelSelected();
                    }
                }
                else {
                    if (_actionElement)
                        return _actionElement;
                    if (_hoverElement)
                        return _hoverElement;
                }

            }
            this.onmousemove = function (e) {
                this.stage.debugger.write('x:' + e.offsetX + ",y:" + e.offsetY);
                _mousePoint = { x: e.offsetX, y: e.offsetY };
                var offsetX = 0, offsetY = 0;

                if (_mousedown && (Math.abs(_mousedownPoint.x - e.offsetX) > 1 || Math.abs(_mousedownPoint.y - e.offsetY) > 1)) {
                    
                    _beginDrag = true;

                    layer.stage.cursor = 'move';
                }


                if (_beginDrag && _selectedElement.length > 0) {


                    for (var i = 0; i < _selectedElement.length; i++) {
                        
                        
                        if (_selectedElement[i].editMode > namespace.EditMode.Select) {
                            offsetX = e.offsetX / _scale;
                            offsetY = e.offsetY / _scale;

                            
                            if (_selectedElement[i].controlNode) {
                                
                                if (!_selectedElement[i].canEdit) return;
                                
                                if (_selectedElement[i] instanceof namespace.LineElement) {
                                    if (_selectedElement[i].controlNode.controlMode == namespace.EndPointMode.Start) {
                                        
                                        if (_rangleMove) {
                                            if (Math.abs(e.offsetX - _selectedElement[i].endNode.x) > Math.abs(e.offsetY - _selectedElement[i].endNode.y)) {
                                                _selectedElement[i].controlNode.move(e.offsetX, _selectedElement[i].endNode.y);
                                            } else {
                                                _selectedElement[i].controlNode.move(_selectedElement[i].endNode.x, e.offsetY);
                                            }
                                        } else {
                                            _selectedElement[i].controlNode.move(e.offsetX / _scale, e.offsetY / _scale);
                                        }
                                    }
                                    else if (_selectedElement[i].controlNode.controlMode == namespace.EndPointMode.End) {
                                        if (_rangleMove) {
                                            if (Math.abs(e.offsetX - _selectedElement[i].startNode.x) > Math.abs(e.offsetY - _selectedElement[i].startNode.y)) {
                                                _selectedElement[i].controlNode.move(e.offsetX, _selectedElement[i].startNode.y);
                                            } else {
                                                _selectedElement[i].controlNode.move(_selectedElement[i].startNode.x, e.offsetY);
                                            }
                                        } else {
                                            _selectedElement[i].controlNode.move(e.offsetX / _scale, e.offsetY / _scale);
                                        }
                                    }
                                } else {
                                    _selectedElement[i].controlNode.move(e.offsetX - _offset.x, e.offsetY - _offset.y);
                                }
                            }
                        }
                            
                        else {

                            var dragEle = _selectedElement[i];

                            if (!_selectedElement[i].canDrag) {
                                dragEle = null;
                                continue;
                            }
                            if (_selectedElement[i] instanceof namespace.LinkElement) {
                                dragEle = null;
                                continue;
                            }
                            if (_selectedElement[i].group) {
                                dragEle = _selectedElement[i].group;
                                
                            }
                            
                            if (dragEle && _stepMove) {

                                if (Math.abs(e.offsetX - _offset.x) > Math.abs(e.offsetY - _offset.y)) {
                                    if (e.offsetX - _stepOffset.x > 10 * _scale) {
                                        offsetX = 10;
                                        _stepOffset.x = e.offsetX;
                                    }

                                    else if (e.offsetX - _stepOffset.x < -10 * _scale) {
                                        offsetX = -10;
                                        _stepOffset.x = e.offsetX;
                                    }


                                } else {
                                    if (e.offsetY - _stepOffset.y > 10 * _scale) {
                                        offsetY = 10;
                                        _stepOffset.y = e.offsetY;
                                    } else if (e.offsetY - _stepOffset.y < -10 * _scale) {

                                        offsetY = -10;
                                        _stepOffset.y = e.offsetY;
                                    }


                                }
                            }
                            else {

                                offsetX = parseFloat(e.offsetX - _offset.x) / _scale;
                                offsetY = parseFloat(e.offsetY - _offset.y) / _scale;

                                if (_rangleMove) {
                                    if (Math.abs(e.offsetX - _offset.x) > Math.abs(e.offsetY - _offset.y)) {
                                        offsetY = 0;
                                    } else {
                                        offsetX = 0;
                                    }
                                }
                            }


                            if (dragEle instanceof namespace.LineElement) {
                                _dragEle.offset(e.offsetX - _offset.x, e.offsetY - _offset.y);
                            } else if (dragEle instanceof namespace.Group) {
                                dragEle.offset(offsetX, offsetY);

                            } else {
                                if (_stepMove) {
                                    dragEle.x = Math.ceil(dragEle.x / 10) * 10;
                                    dragEle.y = Math.ceil(dragEle.y / 10) * 10;
                                }


                                dragEle.x += offsetX;
                                dragEle.y += offsetY;


                                dragEle.status = namespace.Status.Draging;

                            }



                        }
                    }




                    _offset.x = e.offsetX;
                    _offset.y = e.offsetY;
                    
                }


                
                var oldHover = _hoverElement;
                

                if (_hoverElement != null) {
                    _hoverElement.status = namespace.Util.xorEnum(_hoverElement.status, namespace.Status.Hover);
                    if (_hoverElement.group) {
                        _hoverElement.group.status = namespace.Util.xorEnum(_hoverElement.group.status, namespace.Status.Hover);
                    }
                    if (layer.mode == namespace.LayerMode.Action || layer.mode == namespace.LayerMode.Force) {
                        _hoverElement = null;
                    }
                }

      
                if (_actionElement) {
                    return;
                }




                if (!hoverElements(_allElements, e, oldHover)) {
                    hoverElements(_alllinks, e, oldHover)
                }


                if (oldHover && (!_hoverElement || (_hoverElement && !_hoverElement.equals(oldHover)))) {
                    oldHover.fireLeave();
                    
                    
                    
                }

                if (_hoverElement && (!oldHover || !_hoverElement.equals(oldHover))) {
                    _hoverElement.fireHover();
                    
                    
                    
                }

                if (_hoverElement) {
                    layer.stage.cursor = 'pointer';
                }
                else {
                    layer.stage.cursor = 'default';
                }
               
            }

            function hoverElements(eles, e, oldHover) {
                for (var i = eles.length - 1; i >= 0; i--) {
                    var ele = eles[i];

                    
                    if (ele.canEvent && ele instanceof namespace.NodeElement && ele.displayNodes.length > 0) {
                        
                        
                        var hnode = ele.testNode(e.offsetX, e.offsetY);
                        if (hnode) {
                            for (var n = 0; n < ele.displayNodes.length; n++) {
                                if (ele.displayNodes[n].equals(hnode)) {
                                    if (_hoverElement)
                                        _hoverElement.status = namespace.Util.xorEnum(ele.status, namespace.Status.NodeHover);

                                    ele.status = namespace.Util.orEnum(ele.status, namespace.Status.NodeHover);
                                    _hoverElement = ele;

                                    return true;

                                }
                            }
                        }


                    }

                    if (ele.testPoint(e.offsetX, e.offsetY)) {
                        if (ele instanceof namespace.Group) {
                            if (_selectedElement.length == 0) {
                                ele.status = namespace.Util.orEnum(ele.status, namespace.Status.Hover);
                                continue;
                            }
                        }
                        if (_hoverElement) {
                            if (_hoverElement.group) {
                                _hoverElement.group.status = namespace.Util.xorEnum(_hoverElement.group.status, namespace.Status.Hover);
                            }
                            _hoverElement.status = namespace.Util.xorEnum(_hoverElement.status, namespace.Status.Hover);
                            _hoverElement.status = namespace.Util.xorEnum(_hoverElement.status, namespace.Status.NodeHover);

                        }

                        _hoverElement = ele;
                        ele.status = namespace.Util.orEnum(ele.status, namespace.Status.Hover);
                        if (_hoverElement.group) {
                            _hoverElement.group.status = namespace.Util.orEnum(_hoverElement.group.status, namespace.Status.Hover);
                        }

                        
                        
                        
                        

                        return true;
                    }

                }

                return false;
            }

            
            this.onmouseup = function (e, rect) {
                _mousedown = false;
                _selectedElement = [];
                
                var result = 0;
                if (_beginDrag) {
                    if (_actionElement) {
                        result = 1;
                        _actionElement.status = namespace.Status.None;
                        _actionElement.controlNode = null;
                    }
                    _beginDrag = false;

                }
                else {
                    if (_actionElement == null) _actionElement = _hoverElement;
                    if (_actionElement) {
                        result = 2;
                        _actionElement.status = namespace.Status.None;
                        _actionElement.controlNode = null;

                        
                        if (e.button==0 && _actionElement.canSelect && (
                             namespace.Util.orEnum(layer.scene.mode, namespace.SceneMode.SingleSelect) ||
                             namespace.Util.orEnum(layer.scene.mode, namespace.SceneMode.MultipleSelect))) {
                            _actionElement.status = namespace.Status.Selected;
                            _selectedElement.push(_actionElement);
                        }

                        _actionElement.fireClick(e);


                        if (_actionElement.events.hits) {
                            _actionElement.fireHit({
                                x: e.offsetX, y: e.offsetY
                            });
                        }



                    }

                }

                if (layer.mode == namespace.LayerMode.Action && rect) {

                    for (var i = 0; i < layer.elements.length; i++) {
                        var ele = layer.elements[i];
                        if (ele.group == null && ele.inRect(rect.x, rect.y, rect.width, rect.height)) {
     
                            ele.status = namespace.Status.Selected;
                            _selectedElement.push(ele);
                        }
                        else {
                            ele.status = namespace.Status.None;
                        }

                    }
                }

                return result;
            }

            

            this.preRender = function (g) {
                preRenderCore(_allElements, g);
                preRenderCore(_alllinks, g);
                
            }

            function preRenderCore(eles, g) {

                for (var i = 0; i < eles.length; i++) {
                    var ele = eles[i];
                    if (ele.invalid) {
                        if (ele.nodes) {
                            ele.buildNodes();
                        }
                        ele.updateBounds(g);
                        
                        
                        if (ele instanceof namespace.BaseTextElement) {
                            if (!(ele instanceof namespace.TextElement && ele.autoSize)) {
                                ele.measureText(g);
                            }
                        }

                        if (ele.tooltip) ele.tooltip.measureText(g);

                        for (var n = 0; n < ele.animations.length; n++) {
                            if (ele.animations[n].invalid) {
                                ele.animations[n].preAnimation();
                                ele.animations[n].invalid = false;
                            }
                        }


                        ele.setValue('invalid', false);
                    }

                }
            }

            this.render = function (g) {

                for (var i = 0; i < _alllinks.length; i++) {
                    if (isVisiable(_alllinks[i])) {
                        renderElement(_alllinks[i], g);
                    }
                }

                for (var i = 0; i < _allElements.length; i++) {
                    if (isVisiable(_allElements[i])) {
                        renderElement(_allElements[i], g);
                    }
                }

                for (var i = 0; i < _allTooltips.length; i++) {
                    if (isVisiable(_allTooltips[i])) {
                        renderElement(_allTooltips[i], g);
                    }
                }
            }

            function isVisiable(ele) {
                if (!ele.visible) return false;
                
                if (!(ele instanceof namespace.LinkElement)) {
                    if (layer.stage.drawBounds.intersect(ele.drawBounds) == -1)
                        return false;
                }
                return true;

            }

            function renderElement(ele, g) {
                g.save();

                ele.preRender(g);
                
                ele.renderBackground(g);
                
                ele.render(g);

                
                if (ele instanceof namespace.BaseTextElement)
                    ele.renderText(g, ele.text, ele.textRect, ele.forceColor);

                
                if (namespace.Util.andEnum(ele.status, namespace.Status.Hover))
                    ele.renderHighLight(g);
                
                if (namespace.Util.andEnum(ele.status, namespace.Status.Selected))
                    ele.renderHighLight(g);
                
                if (ele instanceof namespace.NodeElement) {
                    if (ele.editMode > namespace.EditMode.Select || ele.displayNodes.length > 0) {
                        ele.renderNodes(g);
                        ele.renderHoverNode(g);
                    }
                }


                g.restore();
            }



            this.dispose = function () {
                if (!this.isdisposed) {
                    for (var i = 0; i < this.elements.length; i++) {
                        this.elements[i].dispose();
                        this.elements[i] = null;
                        this.elements = [];
                    }

                    this.isdisposed = true;
                }
                else {
                    console.log('object was disposed');
                }
            }


        }
        Layer.prototype = new namespace.Element(true);
        Layer.prototype.setParent = function (parentEle) {
            namespace.Element.prototype.setParent.call(this, parentEle);
            this.stage = parentEle.stage;
            this.scene = parentEle;
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].setParent(this);
        }
        /**
        * @name findElementById(id)
        * @type function
        * @description 按id查找元素
        * @class Layer
        */
        Layer.prototype.findElementById = function (id) {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].id == id) return this.elements[i];
            }
        }
        Layer.prototype.onserialize = function (key, value) {
            var json = "";
            if (key == "elements") {
                json += '"' + key + '"' + ":[";
                for (var q = 0; q < value.length; q++)
                    json += value[q].serialize() + ",";

                if (json[json.length - 1] == ",")
                    json = json.substr(0, json.length - 1);

                json += "]";

            }

            return json;
        }

        Layer.prototype.ondeserialize = function (key, value) {
            if (key == "elements") {
                this._elements_ = [];
                for (var i = 0; i < value.length; i++) {
                    this._elements_.push(value[i]);
                }

                return true;
            }
        }
        Layer.prototype.enddeserialize = function () {
            if (this._elements_) {

                for (var i = 0; i < this._elements_.length; i++) {
                    var ele = namespace.Element.deserialize(this._elements_[i]);
                    this.add(ele);
                    ele.enddeserialize();
                }
            }

            delete this._elements_;
        }
        namespace.Layer = Layer;


        function BackgroundLayer() {
            Layer.call(this);
            this.type = "lion.BackgroundLayer";
            var data = this.__data__;
            data.backgroundColor = '#eeeeee';
            var layer = this;
            var _graphData;
            this.renderBackground = function (g) {
                if (!_graphData) {
                    g.fillStyle = layer.backgroundColor;
                    g.fillRect(layer.x, layer.y, layer.width, layer.height);
                    _graphData = g.getImageData(0, 0, layer.width, layer.height);
                }
                else {
                    g.putImageData(_graphData, 0, 0);
                }
            }
        }
        BackgroundLayer.prototype = new Layer(true);

        Object.defineProperties(BackgroundLayer.prototype, {
            backgroundColor: {
                get: function () {
                    return this.getValue('backgroundColor');
                },
                set: function (value) {
                    this.setValue('backgroundColor', value);
                    this.invalidLayout();
                },
                enumerable: true
            }

        });
        namespace.BackgroundLayer = BackgroundLayer;
        
        function VirtualLayer() {
            Layer.call(this, namespace.LayerMode.Virtual);
            this.type = "lion.VirtualLayer";
            var layer = this;
            
            var _selectVirtualEle = null;
            var _mode = namespace.LayerMode.Virtual;
            this.getVirtualRect = function () {
                if (_selectVirtualEle)
                    return _selectVirtualEle.drawBounds;
            }
            this.onmousedown = function (e) {
                if (e.button == 0) {
                    if (namespace.Util.andEnum(layer.scene.mode, namespace.SceneMode.MultipleSelect)) {
                        if (!_selectVirtualEle) {
                            _selectVirtualEle = new namespace.RectElement();
                            layer.add(_selectVirtualEle, namespace.LayerMode.Virtual);
                        }
                        _selectVirtualEle.x = e.offsetX;
                        _selectVirtualEle.y = e.offsetY;
                        _selectVirtualEle.setParent(layer);
                        _selectVirtualEle.backgroundColor = "rgba(175,175,175,0.2)";
                        _selectVirtualEle.width = 0;
                        _selectVirtualEle.height = 0;
                        _selectVirtualEle.borderColor = "#333333";
                        _selectVirtualEle.borderSize = 1;
                    }
                }

            }
            this.onmousemove = function (e) {
                if (_mode == namespace.LayerMode.Virtual) {
                    if (_selectVirtualEle) {
                        _selectVirtualEle.width = e.offsetX - _selectVirtualEle.x;
                        _selectVirtualEle.height = e.offsetY - _selectVirtualEle.y;
                        
                    }
                }
            }
            this.onmouseup = function (e, rect) {
                if (_selectVirtualEle) {

                    layer.remove(_selectVirtualEle);
                    _selectVirtualEle = null;
                }

                layer.clear();
            }
        }
        VirtualLayer.prototype = new Layer(true);
        namespace.VirtualLayer = VirtualLayer;
    })(lion);



    
    
    !(function (namespace) {
        /**
        * @name Scene
        * @type class
        * @file scene
        * @inherit Element
        * @description 场景
        */
        function Scene() {
            namespace.Element.call(this);

            this.type = "lion.Scene";
            this.layers = {}
            var data = this.__data__;
            data.x = 0;
            data.y = 0;
            data.mode = namespace.SceneMode.Normal;
            
            
            
            var _eye;
            /**
            * @name showBirdsEye()
            * @type function
            * @description 呈现鸟瞰视图
            * @class Scene
            */
            this.showBirdsEye = function () {
                
                
                
                _eye = new namespace.BirdsEye();
                _eye.canDrag = false;
                add(_eye, namespace.LayerMode.Force);
            }
            
            var _dragElement;
            var scene = this
            /**
            * @name setScale(scale, layermode)
            * @type function
            * @description 设置一个层
            * @class Scene
            * @param layer Layer true 层
            * @param layermode number true 层类型
            */
            this.setLayer = function (layermode, layer) {
                var olayer;
                if (layermode == namespace.LayerMode.Virtual) {
                    olayer = layer ? layer : new namespace.VirtualLayer();
                    scene.layers.virtual = olayer;
                }
                else {

                    if (layermode == namespace.LayerMode.Force) {
                        olayer = layer ? layer : new namespace.Layer(layermode);
                        scene.layers.force = olayer;
                    }
                    else if (layermode == namespace.LayerMode.Action) {
                        olayer = layer ? layer : new namespace.Layer(layermode);
                        scene.layers.action = olayer;
                    }
                    else if (layermode == namespace.LayerMode.Background) {
                        olayer = layer ? layer : new namespace.BackgroundLayer();
                        scene.layers.background = olayer;
                    }
                }
                olayer.setValue('id', generateId());
                olayer.setParent(scene);
            }
            /**
            * @name setScale(scale, layermode)
            * @type function
            * @description 设置某层缩放比例
            * @class Scene
            * @param scale number true 缩放比例
            * @param layermode number true 层类型
            */
            this.setScale = function (scale, layermode) {
                
                
                
                
                
                if (!layermode) {
                    scene.layers.action.setScale(scale);
                    scene.layers.background.setScale(scale);
                }
                else {
                    if (layermode == namespace.LayerMode.Action)
                        scene.layers.action.setScale(scale);
                    else if (layermode == namespace.LayerMode.Background)
                        scene.layers.background.setScale(scale);
                }
            }
            /**
            * @name addElement(ele, layermode)
            * @type function
            * @description 在某层下添加一个元素
            * @class Scene
            * @param ele Element true 待添加的元素
            * @param layermode number true 层类型
            */
            this.addElement = function (ele, layoutMode) {

                add(ele, layoutMode);
            }
            /**
            * @name foreach( layermode,callback)
            * @type function
            * @description 遍历某层的所有元素
            * @class Scene
            * @param layermode number true 层类型
            * @param callback function true 遍历时回调函数fn(ele)
            */
            this.foreach = function (layerMode, callback) {
                
                
                
                
                
                var layer = getLayer(layerMode);
                for (var i = 0; i < layer.elements.length; i++)
                    callback(layer.elements[i]);

            }

            /**
            * @name find( layermode,callback)
            * @type function
            * @description 查找某层的元素
            * @class Scene
            * @param layermode number true 层类型
            * @param callback function true 遍历时回调函数，如果符合条件返回true
            * @return 找到的元素Element
            */
            this.find = function (layerMode, callback) {
                
                
                
                
                
                
                var layer = getLayer(layerMode);
                for (var i = 0; i < layer.elements.length; i++)
                    if (callback(layer.elements[i])) return layer.elements[i];

                return null;
            }

            function getLayer(layerMode) {
                
                
                
                
                
                if (layerMode == namespace.LayerMode.Virtual) return scene.layers.virtual;
                else if (layerMode == namespace.LayerMode.Force) return scene.layers.force;
                else if (layerMode == namespace.LayerMode.Background) return scene.layers.background;
                else return scene.layers.action;
            }

            function add(ele, layoutMode) {



                
                
                if (layoutMode == namespace.LayerMode.Force) {
                    scene.layers.force.add(ele);
                } else if (layoutMode == namespace.LayerMode.Background) {
                    scene.layers.background.add(ele);
                } else if (layoutMode == namespace.LayerMode.Virtual) {
                    scene.layers.virtual.add(ele);
                } else {
                    scene.layers.action.add(ele);
                }

                if (_eye && !(ele instanceof namespace.BirdsEye)) {
                    ele.onLayout(_eye.invalidLayout, _eye);
                }
            }
            /**
            * @name clear( layermode)
            * @type function
            * @description 指定清除某个层下所有元素
            * @class Scene
            * @param layermode number false 层类型，默认为action层
            */
            this.clear = function (layerMode) {
                
                
                
                
                if (layerMode == namespace.LayerMode.Force) {
                    scene.layers.force.clear();
                } else if (layerMode == namespace.LayerMode.Background) {
                    scene.layers.background.clear();
                } else {
                    scene.layers.action.clear();
                }
            }
            /**
            * @name remove(ele, layermode)
            * @type function
            * @description 移除某层的指定元素
            * @class Scene
            * @param ele Element true 需要移除的元素
            * @param layermode number true 层类型
            */
            this.remove = function (ele, layoutMode) {

                if (layoutMode == namespace.LayerMode.Force) {
                    scene.layers.force.remove(ele);
                } else if (layoutMode == namespace.LayerMode.Background) {
                    scene.layers.background.remove(ele);
                } else {
                    scene.layers.action.remove(ele);
                }
            }

            this.preRender = function (g) {
                scene.layers.background.preRender(g);
                scene.layers.action.preRender(g);
                scene.layers.virtual.preRender(g);
                scene.layers.force.preRender(g);
            }

            this.render = function (g) {
                scene.layers.background.render(g);
                scene.layers.action.render(g);
                scene.layers.virtual.render(g);
                scene.layers.force.render(g);
            }

            this.renderBackground = function (g) {
                scene.layers.background.renderBackground(g);
            }

            var _startPos = {
            };
            var _clickEle;
            this.__onmousedown = function (e) {

                if (scene.mode == namespace.SceneMode.Move) {
                    _sceneOffset.mouseDown = true;
                    _sceneOffset.beginDrag = false;
                    _sceneOffset.x = e.clientX;
                    _sceneOffset.y = e.clientY;
                }

                var ele = scene.layers.force.onmousedown(e);
                var layer = null;
                if (ele) {
                    layer = scene.layers.force;
                } else {
                    ele = scene.layers.action.onmousedown(e);
                    if (ele)
                        layer = scene.layers.action;
                    else {
                        scene.layers.virtual.onmousedown(e);
                    }
                }

                if (_fnclick) {
                    _startPos.x = e.clientX;
                    _startPos.y = e.clientY;
                    _clickEle = ele;
                }


                for (var i = 0; i < scene.events.mousedown.length; i++)
                    scene.events.mousedown[i](e, scene, ele, (layer ? layer.mode : null));
            }

            var _sceneOffset = {
                mouseDown: false, beginDrag: false, x: 0, y: 0
            };

            this.__onmousemove = function (e) {

                if (scene.mode == namespace.SceneMode.Move) {
                    if (_sceneOffset.mouseDown && Math.abs(_sceneOffset.x - e.offsetX) > 3 && Math.abs(_sceneOffset.y - e.offsetY) > 3) {
                        _sceneOffset.beginDrag = true;
                    }

                    if (_sceneOffset.beginDrag) {
                        scene.x += e.clientX - _sceneOffset.x;
                        scene.y += e.clientY - _sceneOffset.y;

                        _sceneOffset.x = e.clientX;
                        _sceneOffset.y = e.clientY;
                        
                        scene.layers.action.refresh();
                        scene.layers.background.refresh();
                        return;
                    }
                }

                scene.layers.force.onmousemove(e);
                scene.layers.virtual.onmousemove(e);
                scene.layers.action.onmousemove(e);
                if (_fnmousemove || _fnclick) {
                    var ele = scene.layers.force.getHoverElement();
                    if (!ele)
                        ele = scene.layers.action.getHoverElement();
                    for (var i = 0; i < scene.events.mousemove.length; i++)
                        scene.events.mousemove[i](e, ele);

                }

            }

            this.__onmouseup = function (e) {



                var rect = scene.layers.virtual.getVirtualRect();
                scene.layers.virtual.onmouseup(e);
                scene.layers.force.onmouseup(e);
                var result = scene.layers.action.onmouseup(e, rect);
                if (_fnmouseup || _fnclick) {
                    var ele = scene.layers.force.getActionElement();
                    if (!ele)
                        ele = scene.layers.action.getActionElement();

                    for (var i = 0; i < scene.events.mouseup.length; i++)
                        scene.events.mouseup[i](e, ele);


                    if (result != 1 && !_sceneOffset.beginDrag) {
                        for (var i = 0; i < scene.events.click.length; i++) {

                            scene.events.click[i](e, ele);
                        }

                    }

                }
                _sceneOffset.beginDrag = false
                _sceneOffset.mouseDown = false

                var eles = scene.layers.action.getSelectedElement();
                if (eles && eles.length > 0) {
                    for (var i = 0; i < scene.events.selected.length; i++) {
                        scene.events.selected[i](scene.layers.action, eles);
                    }
                }

                scene.layers.virtual.cancelAction();
                scene.layers.force.cancelAction();
                scene.layers.action.cancelAction();

            }
            this.__ondblclick = function (e) {

            }

            this.__onkeypress = function (e) {
                for (var i = 0; i < scene.events.keypress.length; i++) {
                    scene.events.keypress[i](e);
                }
            }

            scene.events.selected = [];
            scene.events.mousedown = [];
            scene.events.mousemove = [];
            scene.events.mouseup = [];
            scene.events.click = [];
            scene.events.keypress = [];

            var _fnmousedown, _fnmousemove, _fnmouseup, _fnclick;
            this.onClick = function (fn) {
                _fnclick = fn;
                scene.events.click.push(fn);
            }
            this.onMouseDown = function (fn) {
                _fnmousedown = fn;
                scene.events.mousedown.push(fn);
            }
            this.onMouseMove = function (fn) {
                _fnmousemove = fn;
                scene.events.mousemove.push(fn);
            }
            this.onMouseUp = function (fn) {
                _fnmouseup = fn;
                scene.events.mouseup.push(fn);

            }
            this.onKeyPress = function (fn) {

                scene.events.keypress.push(fn);

            }
            this.onSelectedElements = function (fn) {
                scene.events.selected.push(fn);

            }
            this.getSelectedElements = function (layermode) {
                var eles = getLayer(layermode).getSelectedElement();
                var arr = [];
                for (var i = 0; i < eles.length; i++)
                    arr[i] = eles[i];
                return arr;
            }

            this.onserialize = function (key, value) {
                var json = "";
                if (key == "layers") {
                    json += '"' + key + '"' + ":{";

                    json += '"background":' + scene.layers.background.serialize() + ",";
                    json += '"action":' + scene.layers.action.serialize() + ",";
                    json += '"force":' + scene.layers.force.serialize();
                    json += "}";
                }

                return json;
            }


            this.ondeserialize = function (key, value) {
                if (key == "layers") {
                    this.setLayer(namespace.LayerMode.Force, namespace.Element.deserialize(value.force));
                    this.setLayer(namespace.LayerMode.Action, namespace.Element.deserialize(value.action));
                    this.setLayer(namespace.LayerMode.Background, namespace.Element.deserialize(value.background));
                    this.setLayer(namespace.LayerMode.Virtual);
                    return true;
                }

                return false;
            }

            this.enddeserialize = function () {
                scene.layers.background.enddeserialize();
                scene.layers.action.enddeserialize();
                scene.layers.force.enddeserialize();
            }

            this.dispose = function () {
                if (!this.isdisposed) {
                    this.layers.virtual.dispose();
                    this.layers.force.dispose();
                    this.layers.action.dispose();
                    this.layers.background.dispose();
                    this.isdisposed = true;
                }
                else {
                    console.warn('object was disposed');
                }
            }


            
            
            
            
            
            
            
            
            if (!arguments[0]) {
                this.setLayer(namespace.LayerMode.Force);
                this.setLayer(namespace.LayerMode.Action);
                this.setLayer(namespace.LayerMode.Background);
                this.setLayer(namespace.LayerMode.Virtual);
            }
        }
        Scene.prototype = new namespace.Element(true);
        Object.defineProperties(Scene.prototype, {
            /**
                * @name width
                * @type field
                * @datatype number
                * @description 获取或设置场景的宽度
                * @class Scene
                */
            width: {
                get: function () {
                    if (!this.getValue('width')) return this.stage.width;
                    return this.getValue('width');;
                },
                set: function (val) {
                    this.setValue('width', val);
                    this.invalidLayout("bounds");
                },
                enumerable: true,
            },
            /**
            * @name height
            * @type field
            * @datatype number
            * @description 获取或设置场景的高度
            * @class Scene
            */
            height: {
                get: function () {
                    if (!this.getValue('height')) return this.stage.height;
                    return this.getValue('height');
                },
                set: function (val) {
                    this.setValue('height', val);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name mode
            * @type field
            * @datatype Mode
            * @description 获取或设置场景的模式
            * @class Scene
            */
            mode: {
                get: function () {
                    return this.getValue('mode');
                },
                set: function (value) {
                    this.setValue('mode', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name x
            * @type field
            * @datatype Mode
            * @description 获取或设置场景的x坐标
            * @class Scene
            */
            x: {
                get: function () {
                    return this.getValue('x');
                },
                set: function (value) {
                    this.setValue('x', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name y
            * @type field
            * @datatype Mode
            * @description 获取或设置场景的y坐标
            * @class Scene
            */
            y: {
                get: function () {
                    return this.getValue('y');
                },
                set: function (value) {
                    this.setValue('y', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            }

        });
        Scene.prototype.setParent = function (parentEle) {
            namespace.Element.prototype.setParent.call(this, parentEle);
            this.stage = parentEle;
            this.layers.virtual.setParent(this);
            this.layers.force.setParent(this);
            this.layers.action.setParent(this);
            this.layers.background.setParent(this);
        }

        namespace.Scene = Scene;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name GeoElement
        * @type class
        * @file geoelement
        * @inherit Element
        * @description 基础几何元素，可见的元素的基类
        */
        function GeoElement() {


            namespace.Element.call(this, arguments[0]);
            this.type = 'lion.GeoElement';
            var data = this.__data__;


            data.x = 0;
            data.y = 0;
            data.borderColor = "#333333";
            data.borderSize = 0;
            data.backgroundColor = "#dddddd";
            data.scale = 1.0;
            data.shadow = null;
            data.backgroundImageUrl = null;
            data.visible = true;
            
            data.highlightColor = "rgba(255,255,255,0.7)";
            data.status = namespace.Status.None;
            data.canDrag = true;
            data.canEdit = true;
            data.canSelect = true;
            data.canEvent = true;
            data.backgroundImage = null;
            data.scene = null;
            data.layer = null;
            data.drawBounds = new Rect();
            
            data.tooltip = null;
            data.lines = [];
            
            this.animations = [];
            this.events.hover = [];
            this.events.leave = [];
            this.events.layout = [];
            this.events.click = [];
            this.events.rclick = [];
            this.events.hits = [];

        }

        GeoElement.prototype = new namespace.Element(true);
        GeoElement.prototype.initialize = function () {
            namespace.Element.prototype.initialize.call(this);
        }

        Object.defineProperties(GeoElement.prototype, {
            /**
            * @name width
            * @type field
            * @datatype number
            * @description 矩形的宽度
            * @class RectElement
            */
            width: {
                get: function () {
                    return this.getValue('width');
                },
                set: function (value) {
                    this.setValue('width', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name height
            * @type field
            * @datatype number
            * @description 矩形的高度
            * @class RectElement
            */
            height: {
                get: function () {
                    return this.getValue('height');
                },
                set: function (value) {
                    this.setValue('height', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name x
            * @type field
            * @datatype number
            * @description 元素的x坐标
            * @class GeoElement
            */
            x: {
                get: function () {
                    return this.getValue('x');
                },
                set: function (value) {
                    this.setValue('x', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name y
            * @type field
            * @datatype number
            * @description 元素的y坐标
            * @class GeoElement
            */
            y: {
                get: function () {
                    return this.getValue('y');
                },
                set: function (value) {
                    this.setValue('y', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name center
            * @type field
            * @datatype number
            * @description 获取元素的中心位置
            * @class GeoElement
            */
            center: {
                get: function () {
                    return {
                        x: this.getValue('x') + this.getValue('width') / 2,
                        y: this.getValue('y') + this.getValue('height') / 2
                    };
                },
                enumerable: false
            },
            /**
            * @name backgroundColor
            * @type field
            * @datatype string
            * @description 获取或设置背景色,red,rgb(123,123,125),#efefef
            * @class GeoElement
            */
            backgroundColor: {
                get: function () {
                    return this.getValue('backgroundColor');
                },
                set: function (value) {
                    this.setValue('backgroundColor', value);
                    if (value instanceof namespace.Gradient) {
                        value.setOwner(this);
                    }
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name borderColor
            * @type field
            * @datatype string
            * @description 获取或设置边框颜色
            * @class GeoElement
            */
            borderColor: {
                get: function () {
                    return this.getValue('borderColor');
                },
                set: function (value) {
                    this.setValue('borderColor', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name borderSize
            * @type field
            * @datatype number
            * @description 获取或设置边框大小
            * @class GeoElement
            */
            borderSize: {
                get: function () {
                    return this.getValue('borderSize');
                },
                set: function (value) {
                    this.setValue('borderSize', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name scale
            * @type field
            * @datatype number
            * @description 获取或设置缩放比例
            * @class GeoElement
            */
            scale: {
                get: function () {
                    return this.getValue('scale');
                },
                set: function (value) {
                    this.setValue('scale', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name shadow
            * @type field
            * @datatype number
            * @description 获取或设置阴影大小
            * @class GeoElement
            */
            shadow: {
                get: function () {
                    return this.getValue('shadow');
                },
                set: function (value) {
                    this.setValue('shadow', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name visible
            * @type field
            * @datatype bool
            * @description 获取或设置该元素是否显示
            * @class GeoElement
            */
            visible: {
                get: function () {
                    return this.getValue('visible');
                },
                set: function (value) {
                    this.setValue('visible', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name backgroundImage
            * @type field
            * @datatype Image
            * @description 背景图
            * @class GeoElement
            */
            backgroundImage: {
                get: function () {

                    return this.getValue('backgroundImage');
                },
                set: function (value) {
                    this.setValue('backgroundImage', value);
                    this.invalidLayout();
                }
            },
            /**
            * @name backgroundImageUrl
            * @type field
            * @datatype string
            * @description 背景图Url,当设置此参数后，backgroundImage将被自动赋值
            * @class GeoElement
            */
            backgroundImageUrl: {
                get: function () {

                    return this.getValue('backgroundImageUrl');
                },
                set: function (value) {
                        this.setValue('backgroundImageUrl', value);
                    if (value) {
                        var backgroundImage = new Image();
                        backgroundImage.src = this.backgroundImageUrl;
                        this.setValue('backgroundImage', backgroundImage);
                    }
                    else {
                        this.setValue('backgroundImage', null);
                    }
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name highlightColor
            * @type field
            * @datatype string
            * @description 获取或设置元素的高亮颜色
            * @class GeoElement
            */
            highlightColor: {
                get: function () {

                    return this.getValue('highlightColor');
                },
                set: function (value) {
                    this.setValue('highlightColor', value);
                },
                enumerable: true
            },
            /**
            * @name scene
            * @type field
            * @datatype Scene
            * @description 获取元素所属的场景
            * @class GeoElement
            */
            scene: {
                get: function () {
                    return this.getValue('scene');
                },
                set: function (value) {
                    this.setValue('scene', value);
                },
                enumerable: false
            },
            /**
            * @name layer
            * @type field
            * @datatype Layer
            * @description 元素所在的层
            * @class GeoElement
            */
            layer: {
                get: function () {
                    return this.getValue('layer');
                },
                set: function (value) {
                    this.setValue('layer', value);
                },
                enumerable: false
            },
            /**
            * @name drawBounds
            * @type field
            * @datatype Rect
            * @description 获取元素所呈现的真实矩形大小
            * @class GeoElement
            */
            drawBounds: {
                get: function () {
                    return this.getValue('drawBounds');
                },
                enumerable: false
            },
            /**
            * @name status
            * @type field
            * @datatype number
            * @description 获取元素的当前状态，
            * 此值为Status的枚举值，当状态为叠加时为按位与计算
            * 例如：选中状态下悬停,值为 (2|16)=18
            * @class GeoElement
            */
            status: {
                get: function () {
                    return this.getValue('status');
                },
                set: function (value) {
                    this.setValue('status', value);
                },
                enumerable: false
            },
            /**
            * @name canDrag
            * @type field
            * @datatype bool
            * @description 是否允许拖拽
            * @class GeoElement
            */
            canDrag: {
                get: function () {
                    return this.getValue('canDrag');
                },
                set: function (value) {
                    this.setValue('canDrag', value);
                },
                enumerable: true
            },
            /**
            * @name canEdit
            * @type field
            * @datatype bool
            * @description 是否允许编辑
            * @class GeoElement
            */
            canEdit: {
                get: function () {
                    return this.getValue('canEdit');
                },
                set: function (value) {
                    this.setValue('canEdit', value);
                },
                enumerable: true
            },
            /**
            * @name canSelect
            * @type field
            * @datatype bool
            * @description 是否允许选中
            * @class GeoElement
            */
            canSelect: {
                get: function () {
                    return this.getValue('canSelect');
                },
                set: function (value) {
                    this.setValue('canSelect', value);
                },
                enumerable: true
            },
            /**
            * @name canEvent
            * @type field
            * @datatype bool
            * @description 是否允许触发事件
            * @class GeoElement
            */
            canEvent: {
                get: function () {
                    return this.getValue('canEvent');
                },
                set: function (value) {
                    this.setValue('canEvent', value);
                },
                enumerable: true
            },
            /**
            * @name tooltip
            * @type field
            * @datatype Tooltip
            * @description 与此元素所关联的Tooltip
            * @class GeoElement
            */
            tooltip: {
                get: function () {
                    return this.getValue('tooltip');
                },
                set: function (value) {
                    this.setValue('tooltip', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name lines
            * @type field
            * @datatype Line[]
            * @description 与此元素所关联的连线对象
            * @class GeoElement
            */
            lines: {
                get: function () {
                    return this.getValue('lines');
                },
                set: function (value) {
                    this.setValue('lines', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
        });
        /**
        * @name invalidLayout()
        * @type function
        * @description 使该元素的布局无效，并导致更新布局
        * @class GeoElement
        */
        GeoElement.prototype.invalidLayout = function (mode) {
            namespace.Element.prototype.invalidLayout.call(this,mode);
            for (var i = 0; i < this.lines.length; i++)
                this.lines[i].invalidLayout(mode);
        }
        /**
        * @name onClick(callback)
        * @type function
        * @description 当点击元素时发生回调
        * @class GeoElement
        */
        GeoElement.prototype.onClick = function (callback) {
            this.events.click.push(callback);
        }
        GeoElement.prototype.onRightClick = function (callback) {
            this.events.rclick.push(callback);
        }
        /**
        * @name onHover(callback)
        * @type function
        * @description 当鼠标悬停元素时发生回调
        * @class GeoElement
        */
        GeoElement.prototype.onHover = function (callback) {
            this.events.hover.push(callback);
        }
        /**
        * @name onLeave(callback)
        * @type function
        * @description 当鼠标离开元素时发生回调
        * @class GeoElement
        */
        GeoElement.prototype.onLeave = function (callback) {
            this.events.leave.push(callback);
        }
        /**
        * @name onLayout(callback)
        * @type function
        * @description 当元素布局发送变化时发生回调
        * @class GeoElement
        */
        GeoElement.prototype.onLayout = function (callback, obj) {
            this.events.layout.push({
                object: obj, func: callback
            });
        }
        GeoElement.prototype.fireHover = function (e) {
            for (var n = 0; n < this.events.hover.length; n++) {
                this.events.hover[n](this);
            }
        }
        GeoElement.prototype.fireLeave = function (e) {
            for (var n = 0; n < this.events.leave.length; n++) {
                this.events.leave[n](this);
        }
        }
        GeoElement.prototype.fireClick = function (e) {
            var next = true;
            if (e.button == 0) {
                
                for (var i = 0; i < this.events.click.length; i++) {
                var rtv = this.events.click[i].call(this, this, this.layer);
                if (rtv != undefined && rtv == false)
                    next = false;
            }
            }
            else if (e.button == 2) {
                for (var i = 0; i < this.events.rclick.length; i++) {
                    var rtv = this.events.rclick[i].call(this, this, this.layer);
                    if (rtv != undefined && rtv == false)
                        next = false;
            }
        }

            return next;
        }

        GeoElement.prototype.fireLayout = function () {
            
            for (var i = 0; i < this.events.layout.length; i++) {
                if (namespace.Util.is(this.events.layout[i], 'object')) {
                    this.events.layout[i].func.call(this.events.layout[i].object);
            }
        }
        }
        GeoElement.prototype.onHit = function (fn) {
            this.events.hits.push(fn);
        }

        GeoElement.prototype.fireHit = function (location) {
            for (var i = 0; i < this.events.hits.length; i++)
                this.events.hits[i]({
                        x: location.x - this.drawBounds.x, y: location.y - this.drawBounds.y
                });
        }

        GeoElement.prototype.inRect = function (x, y, w, h) {

            return namespace.Util.inRect(x, y, w, h, this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);
        }
        GeoElement.prototype.setParent = function (parentEle) {
            namespace.Element.prototype.setParent.call(this, parentEle);
            this.layer = (parentEle instanceof namespace.Layer ? parentEle : parentEle.layer);
            this.scene = (parentEle instanceof namespace.Scene ? parentEle : parentEle.scene);
            this.stage = parentEle.stage;
            if (this.tooltip)
                this.tooltip.setParent(this);
        }
            /**
            * @name onLayout(callback)
            * @type function
            * @description 设置该元素的标注
            * @param text string true 显示的文本
            * @return Tooltip
            * @class GeoElement
            */
        GeoElement.prototype.setTooltip = function (text) {
            
            
            
            
            
            if (!this.tooltip) {
                this.tooltip = new namespace.Tooltip;
                this.tooltip.setParent(this);
                
        }

            if (namespace.Util.isNullOrWhitespace(text)) {
                this.tooltip.visible = false;
                this.tooltip.text = '';
            }
            else {
                this.tooltip.visible = true;
                this.tooltip.text = text;
        }
            this.layer.setTooltip(this.tooltip);
            
            return this.tooltip;
        }
            /**
            * @name setScale(scale)
            * @type function
            * @description 设置该元素的缩放比例
            * @param scale number true 缩放比例
            * @class GeoElement
            */
        GeoElement.prototype.setScale = function (scale) {
            this.scale = scale;
        }
            /**
            * @name updateBounds(g)
            * @type function
            * @description 在绘制前更新元素的几何区域，并引发onLayout事件
            * @class GeoElement
            */
        GeoElement.prototype.updateBounds = function (g) {
            

            var px = this.parent ? this.parent.drawBounds.x : 0;
            var py = this.parent ? this.parent.drawBounds.y : 0;

            this.drawBounds.x = (this.x + px) * this.scale;
            this.drawBounds.y = (this.y + py) * this.scale;
            this.drawBounds.width = this.width * this.scale;
            this.drawBounds.height = this.height * this.scale;
            this.drawBounds.calc();
            this.fireLayout();
        }
            /**
            * @name testPoint(x,y)
            * @type function
            * @description 测试点是否在元素区域内
            * @class GeoElement
            * @return 在范围内返回true，否则为false
            */
        GeoElement.prototype.testPoint = function (x, y) {
            
            return namespace.Util.inRect(this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height, x, y);
        }

        GeoElement.prototype.preRender = function (g) {
            var drawrect = this.drawBounds;
            
            this.points = [];
            this.points.push({
                    x: drawrect.x, y: drawrect.y
            });
            this.points.push({
                    x: drawrect.x + drawrect.width, y: drawrect.y
            });
            this.points.push({
                    x: drawrect.x + drawrect.width, y: drawrect.y + drawrect.height
            });
            this.points.push({
                    x: drawrect.x, y: drawrect.y + drawrect.height
            });


        }
        GeoElement.prototype.renderBackground = function (g) {
            g.fillStyle = this.backgroundColor;
            g.beginPath();

        }
        GeoElement.prototype.render = function (g) {

            g.moveTo(this.points[0].x, this.points[0].y);

            for (var i = 1; i < this.points.length; i++) {
                g.lineTo(this.points[i].x, this.points[i].y);
        }
            g.closePath();
            if (this.backgroundColor) {
                g.fill();
        }

            if (this.backgroundImage) {

                g.drawImage(this.backgroundImage, this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);

        }

            if (this.borderSize > 0) {
                g.strokeStyle = this.borderColor;
                g.lineWidth = this.borderSize;
                g.stroke();
        }

            if (namespace.Util.andEnum(this.status, namespace.Status.Selected)) {
                g.fillStyle = "rgba(255,255,255,0.7)";
                g.fill();
        }
        }
        GeoElement.prototype.renderHighLight = function (g) {
            if (this.highlightColor) {
                g.fillStyle = this.highlightColor;

                g.beginPath();
                g.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 1; i < this.points.length; i++) {
                    g.lineTo(this.points[i].x, this.points[i].y);
            }
                g.closePath();

                g.fill();
        }
        }
        GeoElement.prototype.renderTooltip = function (g) {
            if (this.tooltip.visible)
                this.tooltip.render(g);
        }
        GeoElement.prototype.renderLine = function (g, start, end, style) {
            paintLine(g, start, end, style);
        }
            /**
            * @name setAnimation(ani)
            * @type function
            * @description 为元素添加一个动画
            * @class GeoElement
            * @param ani Animation true 需要添加的动画实例
            * @return 返回动画id
            */
        GeoElement.prototype.setAnimation = function (ani) {
            ani.setElement(this);
            ani.animationId = parseInt(Math.random() * 100000);
            _stageAnimations[ani.animationId] = ani;
            this.animations.push(ani);
            return ani.animationId;
        }
            /**
            * @name removeAnimation(id)
            * @type function
            * @description 移除该元素所绑定的动画
            * @class GeoElement
            * @param id number true 动画id
            */
        GeoElement.prototype.removeAnimation = function (id) {
            _stageAnimations[id].enable = false;
            delete _stageAnimations[id];
        }
        GeoElement.prototype.enableAnimation = function (id, enable) {
            _stageAnimations[id].enable = enable;
        }
        GeoElement.prototype.enableAllAnimation = function (enable) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].enable = enable;
        }
        }
            /**
            * @name clearAnimation()
            * @type function
            * @description 清除该元素所绑定的所有动画
            * @class GeoElement
            */
        GeoElement.prototype.clearAnimation = function () {

            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].enable = false;
                delete _stageAnimations[this.animations[i].animationId];
        }
            this.animations = [];

        }
            /**
            * @name dispose()
            * @type function
            * @description 释放该元素所占用的所有资源
            * @class GeoElement
            */
        GeoElement.prototype.dispose = function () {
            if (!this.isdisposed) {
                this.events.click.splice(0);
                this.events.hits.splice(0);
                this.events.hover.splice(0);
                this.events.layout.splice(0);
                
                this.clearAnimation();
                this.isdisposed = true;
        }
        }
        namespace.GeoElement = GeoElement;

    })(lion);


    
    
    !(function (namespace) {
        /**
        * @name BaseTextElement
        * @type class
        * @file basetextelement
        * @inherit GeoElement
        * @description 基础文字处理
        */
        function BaseTextElement() {
            if (!arguments[0]) {
                namespace.GeoElement.call(this, arguments[0]);
                this.type = 'lion.BaseTextElement';
                var data = this.__data__;
                
                data.allowMultiline = false;
                
                data.allowWrap = true;
                
                data.foreColor = "#000000";
                
                data.fontSize = 15;
                data.isGraphicText = false;
                
                data.fontFamliy = "Arial";
                data.textStyle = namespace.TextStyle.None;
                
                data.align = namespace.Align.Center;
                data.text = '';
                
                data.textRect = null;
                data.textlines = [];
                data.pointLines = [];
                data.lineHeight = 0;
            }
        }
        BaseTextElement.prototype = new namespace.GeoElement();

        Object.defineProperties(BaseTextElement.prototype, {
            /**
            * @name allowMultiline
            * @type field
            * @datatype bool
            * @description 获取或设置是否允许多行
            * @class BaseTextElement
            */
            allowMultiline: {
                get: function () {
                    return this.getValue('allowMultiline');
                },
                set: function (value) {
                    this.setValue('allowMultiline', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name allowWrap
            * @type field
            * @datatype bool
            * @description 获取或设置是否允许自动换行
            * @class BaseTextElement
            */
            allowWrap: {
                get: function () {
                    return this.getValue('allowWrap');
                },
                set: function (value) {
                    this.setValue('allowWrap', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name foreColor
            * @type field
            * @datatype string
            * @description 获取或设置文本颜色
            * @class BaseTextElement
            */
            foreColor: {
                get: function () {
                    return this.getValue('foreColor');
                },
                set: function (value) {
                    this.setValue('foreColor', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name fontSize
            * @type field
            * @datatype number
            * @description 获取或设置文字大小
            * @class BaseTextElement
            */
            fontSize: {
                get: function () {
                    return this.getValue('fontSize');
                },
                set: function (value) {
                    this.setValue('fontSize', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name isGraphicText
            * @type field
            * @datatype bool
            * @description 获取或设置文本是否为图形文字，Unicode编码文字，默认为false
            * @class BaseTextElement
            */
            isGraphicText: {
                get: function () {
                    return this.getValue('isGraphicText');
                },
                set: function (value) {
                    this.setValue('isGraphicText', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name fontFamliy
            * @type field
            * @datatype string
            * @description 获取或设置文本字体
            * @class BaseTextElement
            */
            fontFamliy: {
                get: function () {
                    return this.getValue('fontFamliy');
                },
                set: function (value) {
                    this.setValue('fontFamliy', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name align
            * @type field
            * @datatype number
            * @description 获取或设置对齐方式
            * @class BaseTextElement
            */
            align: {
                get: function () {
                    return this.getValue('align');
                },
                set: function (value) {
                    this.setValue('align', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name text
            * @type field
            * @datatype string
            * @description 获取或设置文本
            * @class BaseTextElement
            */
            text: {
                get: function () {
                    return this.getValue('text');
                },
                set: function (value) {
                    this.setValue('text', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name drawText
            * @type field
            * @datatype string
            * @description 获取真实绘制的文本
            * @class BaseTextElement
            */
            drawText: {
                get: function () {
                    return this.isGraphicText ? this.stage.notifyCmd("getGraphicText", {
                        id: this.id
                    }) : this.text;
                },
                enumerable: false

            },
            /**
            * @name textStyle
            * @type field
            * @datatype number
            * @description 获取或设置文本的样式
            * @class BaseTextElement
            */
            textStyle: {
                get: function () {
                    return this.getValue('textStyle');
                },
                set: function (value) {
                    this.setValue('textStyle', value);
                    this.invalidLayout();
                },
                enumerable: true

            },
            /**
            * @name textlines
            * @type field
            * @datatype Array
            * @description 获取文本的行集合
            * @class BaseTextElement
            */
            textlines: {
                get: function () {
                    return this.getValue('textlines');
                },
                enumerable: false
            },
            /**
            * @name textRect
            * @type field
            * @datatype Rect
            * @description 获取或设置文本所形成的矩形区域
            * @class BaseTextElement
            */
            textRect: {
                get: function () {
                    return this.getValue('textRect');
                },
                set: function (value) {
                    this.setValue('textRect', value);
                },
                enumerable: false
            },
            /**
            * @name pointLines
            * @type field
            * @datatype Point
            * @description 获取文本的行位置坐标定位
            * @class BaseTextElement
            */
            pointLines: {
                get: function () {
                    return this.getValue('pointLines');
                },
                enumerable: false
            },
            /**
            * @name lineHeight
            * @type field
            * @datatype Point
            * @description 获取或设置行高
            * @class BaseTextElement
            */
            lineHeight: {
                get: function () {
                    return this.getValue('lineHeight');
                },
                set: function (value) {
                    this.setValue('lineHeight', value);
                },
                enumerable: false
            },

        });
        /**
        * @name appendLine(text)
        * @type function
        * @description 追加一行文本
        * @class BaseTextElement
        * @param text string true 追加的文本
        */
        BaseTextElement.prototype.appendLine = function (text) {

            if (this.text && this.text != "")
                this.text += "\r\n" + text;
            else
                this.text = text;
        }
        /**
        * @name getTextRect()
        * @type function
        * @description 获取文本所形成的矩形区域
        * @class BaseTextElement
        * @return Rect文本所形成的矩形区域
        */
        BaseTextElement.prototype.getTextRect = function () {

            return this.textRect;
        }
        /**
        * @name getLineHeight()
        * @type function
        * @description 获取文本的行高
        * @class BaseTextElement
        * @return number行高
        */
        BaseTextElement.prototype.getLineHeight = function () {
            return this.lineHeight;
        }

        /**
        * @name measureLines(g, lines)
        * @type function
        * @description 计算文本行的位置
        * @class BaseTextElement
        * @param g Graphic true 绘制对象
        * @param lines string[] true 文本行
        * @return Rect 文本的矩形位置
        */
        BaseTextElement.prototype.measureLines = function (g, lines) {

            var linew = 0;
            var lineh = 0;

            function getMultilineTextRect(lines, w, h) {
                if (linew < w) linew = w;
                lineh = lines.length * h;
            }

            function measureTextPostion(element, lines, index, w, h) {
                
                
                
                
                
                
                
                
                
                var pos = {
                };
                linew = w;
                lineh = h;
                if (element.allowMultiline) getMultilineTextRect(lines, w, h);
                if (element.drawBounds.width == 0 && element.drawBounds.height == 0) {
                    
                    
                    
                    pos.x = element.drawBounds.x + 3;
                    pos.y = element.drawBounds.y + index * h + h + 3;
                }
                else {

                    if (element.align == namespace.Align.Center) {

                        pos.x = element.drawBounds.x + (element.drawBounds.width - linew) / 2;
                        pos.y = element.drawBounds.y + (element.drawBounds.height - lineh) / 2 + index * h + h - 5;

                    }
                    else if (element.align == namespace.Align.TopLeft) {

                        pos.x = element.drawBounds.x;
                        pos.y = element.drawBounds.y - ((lines.length - 1) - index) * h - 5;

                    }
                    else if (element.align == namespace.Align.TopMiddle) {

                        pos.x = element.drawBounds.x + (element.drawBounds.width - linew) / 2;
                        pos.y = element.drawBounds.y - ((lines.length - 1) - index) * h - 5;

                    }
                    else if (element.align == namespace.Align.TopRight) {

                        pos.x = element.drawBounds.x + (element.drawBounds.width - linew);
                        pos.y = element.drawBounds.y - ((lines.length - 1) - index) * h - 5;

                    }
                    else if (element.align == namespace.Align.MiddleLeft) {
                        pos.x = element.drawBounds.x + 2;
                        pos.y = element.drawBounds.y + (element.drawBounds.height - lineh) / 2 + index * h + h - 5;

                    }
                    else if (element.align == namespace.Align.MiddleRight) {
                        pos.x = element.drawBounds.x + (element.drawBounds.width - linew) - 2;
                        pos.y = element.drawBounds.y + (element.drawBounds.height - lineh) / 2 + index * h + h - 5;

                    }
                    else if (element.align == namespace.Align.BottomLeft) {
                        pos.x = element.drawBounds.x;
                        pos.y = element.drawBounds.y + element.drawBounds.height + ((index + 1) * h);

                    }
                    else if (element.align == namespace.Align.BottomMiddle) {

                        pos.x = element.drawBounds.x + (element.drawBounds.width - linew) / 2;
                        pos.y = element.drawBounds.y + element.drawBounds.height + ((index + 1) * h);

                    }
                    else if (element.align == namespace.Align.BottomRight) {
                        pos.x = element.drawBounds.x + (element.drawBounds.width - linew) - 2;
                        pos.y = element.drawBounds.y + element.drawBounds.height + ((index + 1) * h);

                    }
                    else {
                        pos.x = element.drawBounds.x;
                        pos.y = element.drawBounds.y;
                    }
                }
                return pos;
            }

            function getTextPos(element, g, lines, index) {
                
                var size = measureTextSize(g, lines[index]);

                
                
                element.lineHeight = size.height;
                var rect = new Rect();
                if (element.drawBounds != null) {
                    var pos = measureTextPostion(element, lines, index, size.width, size.height);
                    rect.x = pos.x;
                    rect.y = pos.y;
                    rect.width = size.width;
                    rect.height = size.height;
                }
                else {
                    rect.x = element.x;
                    rect.y = element.y - size.height;
                    rect.width = size.width;
                    rect.height = size.height;
                }
                return rect;

            }



            
            if (this.allowMultiline) {

                var rs = [];

                for (var i = 0; i < lines.length; i++) {
                    var rect = getTextPos(this, g, lines, i);
                    rs.push(rect);
                    this.pointLines.push({
                        x: rect.x, y: rect.y 
                    });
                }

                return getRectFromRects(rs);
            }
            else {
                return getTextPos(this, g, lines, 0);
            }
        }

        BaseTextElement.prototype.updateBounds = function (g) {
            if (this.isGraphicText) {
                this.stage.notifyCmd("updateGraphicText", {
                    font: this.fontFamliy,
                    id: this.id,
                    text: this.text,
                    size: this.fontSize
                });
            }
            namespace.GeoElement.prototype.updateBounds.call(this, g);
        }
        /**
        * @name measureText(g)
        * @type function
        * @description 计算文本的矩形范围
        * @class BaseTextElement
        * @param g Graphic true 绘制对象
        * @return Rect 文本的矩形位置
        */
        BaseTextElement.prototype.measureText = function (g) {


            
            function getLines(element, lines) {
                lines.splice(0);
                if (element.allowMultiline) {
                    pushArray(lines, element.drawText.split("\r\n"));
                }
                else {
                    pushArray(lines, [element.drawText]);
                }
            }

            if (!namespace.Util.isNullOrWhitespace(this.drawText)) {
                this.pointLines.splice(0);
                g.font = parseInt(this.fontSize * this.scale) + "px " + this.fontFamliy;
                getLines(this, this.textlines);

                this.textRect = this.measureLines(g, this.textlines);
            }

            return this.textRect;
        }

        BaseTextElement.prototype.renderText = function (g, text, rect, color) {
            var otext = text != undefined ? text : this.drawText;
            var orect = rect != undefined ? rect : this.drawBounds;
            var ocolor = color != undefined ? color : this.foreColor;
            g.shadowBlur = 0;
            if (!namespace.Util.isNullOrWhitespace(otext)) {
                g.font = parseInt(this.fontSize * this.scale) + "px " + this.fontFamliy;
                g.fillStyle = ocolor;

                
                
                
                
                

                
                if (this.allowMultiline) {
                    for (var i = 0; i < this.textlines.length; i++) {
                        g.fillText(this.textlines[i], this.pointLines[i].x, this.pointLines[i].y);
                    }
                }
                else {
                    try {


                        g.fillText(otext, orect.x, orect.y);

                    }
                    catch (e) {
                        console.log(e);
                    }

                }
                
            }

        }

        namespace.BaseTextElement = BaseTextElement;

    })(lion);


    
    
    !(function (namespace) {
        /**
        * @name Group
        * @type class
        * @file group
        * @inherit GeoElement
        * @description 群组元素
        * 该元素将根据内容元素大小，位置形成几何形体
        * 该元素与关联的元素均以独立元素形式呈现
        */
        function Group() {
            namespace.GeoElement.call(this);
            
            this.type = "lion.Group";
            var data = this.__data__;
            data.editMode = namespace.EditMode.Select;
            data.elements = [];

        }
        Group.prototype = new namespace.GeoElement();
        Object.defineProperties(Group.prototype, {
            /**
            * @name elements
            * @type field
            * @datatype Element[]
            * @description 获取子元素
            * @class Group
            */
            elements: {
                get: function () {
                    return this.getValue('elements');
                },
                enumerable: true
            },
            /**
            * @name editMode
            * @type field
            * @datatype Element[]
            * @description 获取组的编辑模式
            * @class Group
            */
            editMode: {
                get: function () {
                    return this.getValue('editMode');
                },
                enumerable: false
            }
        });
        /**
        * @name offset(x,y)
        * @type function
        * @description 组以相对位置进行偏移
        * @class Group
        */
        Group.prototype.offset = function (x, y) {
            if (this.points.length > 0) {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i] instanceof namespace.LineElement) {

                        this.elements[i].offset(x, y);

                    } else {
                        this.elements[i].x += x;
                        this.elements[i].y += y;
                    }
                }
            }

        }
        /**
        * @name move(x,y)
        * @type function
        * @description 组以位置进行移动
        * @class Group
        */
        Group.prototype.move = function (x, y) {
            var offsetX = x - this.drawBounds.x;
            var offsetY = y - this.drawBounds.y;
            this.offset(offsetX, offsetY);
        }
        /**
        * @name add(ele)
        * @type function
        * @description 添加一个元素
        * @class Group
        */
        Group.prototype.add = function (ele) {
            ele.group = this;
            this.elements.push(ele);
        }
        /**
        * @name updateBounds(g)
        * @type function
        * @description 更新几何布局
        * @class Group
        */
        Group.prototype.updateBounds = function (g) {
            

            var rect = getRect(this.elements);

            this.drawBounds.x = rect.x;
            this.drawBounds.y = rect.y;
            this.drawBounds.width = rect.width;
            this.drawBounds.height = rect.height;

        }
        Group.prototype.renderBackground = function (g) {
        }
        Group.prototype.renderHighLight = function (g) {

            g.lineWidth = 1;
            g.strokeStyle = "red";
            for (var i = 0; i < this.points.length - 1; i++) {
                g.beginPath();
                this.renderLine(g, this.points[i], this.points[i + 1], namespace.LineStyle.Dotted);
                
            }
            g.beginPath();
            this.renderLine(g, this.points[this.points.length - 1], this.points[0], namespace.LineStyle.Dotted);
        }
        
        
        Group.prototype.render = function (g) {
        }
        Group.prototype.onserialize = function (key, value) {

            if (key == "elements") {
                var json = '"elements":[';
                for (var i = 0; i < this.elements.length; i++) {
                    json += this.elements[i].id + ",";
                }

                if (json[json.length - 1] == ",")
                    json = json.substr(0, json.length - 1);

                json += "]";

                return json;
            }

        }
        Group.prototype.ondeserialize = function (key, value) {
            if (key == "elements") {
                this._elements_ = [];
                
                
                
                
                
                for (var i = 0; i < value.length; i++) {
                    this._elements_[i] = value[i];
                }
                return true;

            }
        }
        Group.prototype.enddeserialize = function () {
            for (var i = 0; i < this._elements_.length; i++) {
                var ele = this.layer.findElementById(this._elements_[i]);
                if (ele)
                    this.add(ele);
            }
            delete this._elements_;
        }
        namespace.Group = Group;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name NodeElement
        * @type class
        * @file nodeelement
        * @inherit BaseTextElement
        * @description 基础节点元素
        */
        function NodeElement() {

            namespace.BaseTextElement.call(this, arguments[0]);
            this.type = "lion.Node";

            var data = this.__data__;
            
            data.shownodes = null;
            data.displayNodes = [];
            
            data.controlNode = null;
            
            data.nodes = [];
            data.hoverNode = null;

            data.editMode = namespace.EditMode.Select;

        }
        NodeElement.prototype = new namespace.BaseTextElement(true);

        Object.defineProperties(NodeElement.prototype, {
            /**
            * @name displayNodes
            * @type field
            * @datatype Array[]
            * @description 获取展示的端点的数组
            * @class NodeElement
            */
            displayNodes: {
                get: function () {
                    return this.getValue('displayNodes');
                },
                enumerable: false
            },
            /**
            * @name controlNode
            * @type field
            * @datatype EndPoint
            * @description 获取当前的调节端点
            * @class NodeElement
            */
            controlNode: {
                get: function () {
                    return this.getValue('controlNode');
                },
                set: function (val) {
                    this.setValue('controlNode', val);
                },
                enumerable: false
            },
            shownodes: {
                get: function () {
                    return this.getValue('shownodes');
                },
                set: function (val) {
                    this.setValue('shownodes', val);
                },
                enumerable: false
            },
            /**
            * @name nodes
            * @type field
            * @datatype EndPoint[]
            * @description 获取所拥有的所有端点
            * @class NodeElement
            */
            nodes: {
                get: function () {
                    return this.getValue('nodes');
                },
                enumerable: true
            },
            /**
            * @name hoverNode
            * @type field
            * @datatype EndPoint
            * @description 获取当前悬停的端点
            * @class NodeElement
            */
            hoverNode: {
                get: function () {
                    return this.getValue('hoverNode');
                },
                set: function (val) {
                    this.setValue('hoverNode', val);
                },
                enumerable: false
            },
            /**
            * @name editMode
            * @type field
            * @datatype EditMode
            * @description 获取元素当前进入的编辑状态
            * @class NodeElement
            */
            editMode: {
                get: function () {
                    return this.getValue('editMode');
                },
                enumerable: false
            },
        });
        NodeElement.prototype.setParent = function (parentEle) {
            namespace.BaseTextElement.prototype.setParent.call(this, parentEle);
        }
        /**
        * @name testNode(x, y)
        * @type function
        * @description 测试坐标是否能命中端点
        * @class NodeElement
        * @param x number true x坐标
        * @param y number true y坐标
        * @return 返回命中的端点EndPoint
        */
        NodeElement.prototype.testNode = function (x, y) {
            

            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].testPoint(x, y)) {
                    this.hoverNode = this.nodes[i];
                    return this.hoverNode;
                }
            }

            this.hoverNode = null;

        }
        NodeElement.prototype.setScale = function (scale) {
            namespace.BaseTextElement.prototype.setScale.call(this, scale);
            if (this.nodes) {
                for (var i = 0; i < this.nodes.length; i++)
                    this.nodes[i].setScale(scale);
            }
        }
        NodeElement.prototype.updateBounds = function (g) {
            namespace.BaseTextElement.prototype.updateBounds.call(this);
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].updateBounds(g);
            }

        }
        NodeElement.prototype.invalidLayout = function (mode) {
            namespace.BaseTextElement.prototype.invalidLayout.call(this,mode);
            for (var i = 0; i < this.nodes.length; i++)
                this.nodes[i].invalidLayout(mode);

            if (this.group)
                this.group.invalidLayout(mode);
        }
        /**
        * @name setEditMode(mode)
        * @type function
        * @description 设置元素的编辑模式
        * @class NodeElement
        * @param mode number true 编辑模式，为EditMode枚举
        */
        NodeElement.prototype.setEditMode = function (mode) {
            
            
            if (this.canEdit && this.canEvent) {
                this.setValue('editMode', mode);
                if (this.editMode > namespace.EditMode.Select) {
                    this.shownodes = 1;
                    this.invalidLayout();
                }
            }
        }
        NodeElement.prototype.buildNodes = function () {

            if (this.shownodes) {
                this.initNodes();
                if (this.displayNodes.length == 0) {


                    if (this.shownodes == 1) {
                        pushArray(this.displayNodes, this.nodes);
                    } else {
                        this.displayNodes = [];
                        for (var i = 0; i < this.shownodes.length; i++) {
                            this.displayNodes.push(this.getNode(this.shownodes[i]));
                        }
                    }
                }

            }
        }
        /**
        * @name showNodes(disnodes)
        * @type function
        * @description 指定显示某些端点
        * @class NodeElement
        * @param disnodes Array true 端点类型数组,缺省则显示所有端点
        */
        NodeElement.prototype.showNodes = function (disnodes) {
            
            

            if (!disnodes) {
                this.shownodes = 1;
            }
            else {
                this.shownodes = disnodes;
            }

            this.invalidLayout();
        }
        /**
        * @name showNodes(disnodes)
        * @type function
        * @description 按端点类型获取一个调节端点
        * @class NodeElement
        * @param endpointMode EndPointMode true 端点类型
        * @return 返回端点EndPoint
        */
        NodeElement.prototype.getNode = function (endpointMode) {
            if (this.nodes.length == 0) {
                this.initNodes();
            }
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].controlMode == endpointMode) return this.nodes[i];
            }
        }
        /**
        * @name resetNodeLocation()
        * @type function
        * @description 重置所有端点位置
        * @class NodeElement
        */
        NodeElement.prototype.resetNodeLocation = function (ele) {
            if (ele.controlMode == namespace.EndPointMode.TopLeft) {
                ele.x = -4;
                ele.y = -4;
            }
            else if (ele.controlMode == namespace.EndPointMode.TopRight) {
                ele.x = this.width - 4;
                ele.y = -4;
            }
            else if (ele.controlMode == namespace.EndPointMode.BottomLeft) {
                ele.x = -4;
                ele.y = this.height - 4;
            }
            else if (ele.controlMode == namespace.EndPointMode.BottomRight) {
                ele.x = this.width - 4;
                ele.y = this.height - 4;
            }
            else if (ele.controlMode == namespace.EndPointMode.MiddleTop) {
                ele.x = this.width / 2 - 4;
                ele.y = -4;
            }
            else if (ele.controlMode == namespace.EndPointMode.MiddleLeft) {
                ele.x = -4;
                ele.y = this.height / 2 - 4;
            }
            else if (ele.controlMode == namespace.EndPointMode.MiddleRight) {
                ele.x = this.width - 4;
                ele.y = this.height / 2 - 4;
            }
            else if (ele.controlMode == namespace.EndPointMode.MiddleBottom) {
                ele.x = this.width / 2 - 4;
                ele.y = this.height - 4;
            }
            else if (ele.controlMode == namespace.EndPointMode.Center) {
                ele.x = this.width / 2 - 4;
                ele.y = this.height / 2 - 4;
            }
        }
        /**
        * @name hideNodes()
        * @type function
        * @description 隐藏所有端点
        * @class NodeElement
        */
        NodeElement.prototype.hideNodes = function (nodes) {
            this.displayNodes.splice(0);
            this.shownodes = 0;
            this.invalidLayout();
        }
        NodeElement.prototype.renderNodes = function (g) {
            for (var i = 0; i < this.displayNodes.length; i++) {
                this.displayNodes[i].renderBackground(g);
                this.displayNodes[i].render(g);
            }
        }
        NodeElement.prototype.renderHoverNode = function (g) {
            if (this.hoverNode) {
                this.hoverNode.renderHighLight(g);
            }

        }
        NodeElement.prototype.initNodes = function (nodeTypes) {
            
            
            
            
            if (this.nodes.length == 0) {

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.TopLeft) > -1)) {
                    var node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.TopLeft;
                    node.x = -4;
                    node.y = -4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.TopRight) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.TopRight;
                    node.x = this.width - 4;
                    node.y = -4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.BottomLeft) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.BottomLeft;
                    node.x = -4;
                    node.y = this.height - 4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.BottomRight) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.BottomRight;
                    node.x = this.width - 4;
                    node.y = this.height - 4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.MiddleTop) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.MiddleTop;
                    node.x = this.width / 2 - 4;
                    node.y = -4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.MiddleLeft) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.MiddleLeft;
                    node.x = -4;
                    node.y = this.height / 2 - 4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.MiddleRight) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.MiddleRight;
                    node.x = this.width - 4;
                    node.y = this.height / 2 - 4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.MiddleBottom) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.MiddleBottom;
                    node.x = this.width / 2 - 4;
                    node.y = this.height - 4;
                    this.nodes.push(node);
                }

                if (!nodeTypes || (nodeTypes && nodeTypes.indexOf(namespace.EndPointMode.Center) > -1)) {
                    node = new namespace.EndPoint(this);
                    node.scale = this.scale;
                    node.controlMode = namespace.EndPointMode.Center;
                    node.x = this.width / 2 - 4;
                    node.y = this.height / 2 - 4;
                    this.nodes.push(node);
                }

                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].setValue("id", generateId(this.nodes));
                    this.nodes[i].setParent(this);
                }
            }
        }
        NodeElement.prototype.dispose = function () {
            if (!this.isdisposed) {
                for (var i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].dispose();
                    this.nodes[i] = null;
                }
                this.nodes.splice(0);
                namespace.BaseTextElement.prototype.dispose.call(this);
                this.isdisposed = true;
            }
        }
        namespace.NodeElement = NodeElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name PolygonElement
        * @type class
        * @file polygonelement
        * @inherit NodeElement
        * @description 多边形元素
        */
        function PolygonElement() {

            namespace.NodeElement.call(this);
            this.type = "lion.PolygonElement";
            var data = this.__data__;
            data.width = 0;
            data.height = 0;
            data.points = [];
            data.pathPoints = [];
            
            
            

        }

        PolygonElement.prototype = new namespace.NodeElement(true);
        Object.defineProperties(PolygonElement.prototype, {
            /**
            * @name pathPoints
            * @type field
            * @datatype Point[][]
            * @description 获取由路线形成的二维点数组
            * @class PolygonElement
            */
            pathPoints: {
                get: function () {
                    return this.getValue('pathPoints');
                },
                enumerable: false
            },
            /**
            * @name points
            * @type field
            * @datatype Point[]
            * @description 获取所有的点坐标
            * @class PolygonElement
            */
            points: {
                get: function () {
                    return this.getValue('points');
                },
                enumerable: false
            },
            /**
           * @name path
           * @type field
           * @datatype number
           * @description 获取或设置路径,路径以空格分开，例如：0,10 50,10 50,0 80,25 50,50 50,40 0,40
           * @class PolygonElement
           */
            path: {
                get: function () {
                    return this.getValue('path');
                },
                set: function (val) {
                    this.setValue('path', val);
                    this.invalidLayout("bounds");
                    
                },
                enumerable: true
            },
            /**
           * @name rotate
           * @type field
           * @datatype number
           * @description 获取或设置旋转角度
           * @class PolygonElement
           */
            rotate: {
                get: function () {
                    return this.getValue('rotate');
                },
                set: function (val) {
                    this.setValue('rotate', val);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            }
        });

        PolygonElement.prototype.updateBounds = function (g) {

            this.buildPath(this.path);

            var px = this.parent ? this.parent.drawBounds.x : 0;
            var py = this.parent ? this.parent.drawBounds.y : 0;

            var maxW = 0;
            var maxH = 0;
            for (var i = 0; i < this.pathPoints.length; i++) {

                for (var j = 0; j < this.pathPoints.length; j++) {
                    if (i != j) {
                        var w = this.pathPoints[j].x - this.pathPoints[i].x;
                        var h = this.pathPoints[j].y - this.pathPoints[i].y;
                        if (w > maxW) maxW = w;
                        if (h > maxH) maxH = h;
                    }
                }
            }

            this.drawBounds.x = (this.x + px) * this.scale;
            this.drawBounds.y = (this.y + py) * this.scale;
            this.drawBounds.width = (this.width > 0 ? this.width * this.scale : maxW * this.scale);
            this.drawBounds.height = (this.height > 0 ? this.height * this.scale : maxH * this.scale);
            this.drawBounds.calc();

            this.points.splice(0);
            for (var i = 0; i < this.pathPoints.length; i++) {
                this.points[i] = {};
                if (this.width > 0) {
                    var xscale = this.width / maxW * this.scale;
                    this.points[i].x = this.drawBounds.x + this.pathPoints[i].x * xscale;
                }
                else {
                    this.points[i].x = this.drawBounds.x + this.pathPoints[i].x * this.scale;
                }

                if (this.height > 0) {
                    var yscale = this.height / maxH * this.scale;
                    this.points[i].y = this.drawBounds.y + this.pathPoints[i].y * yscale;
                }
                else {
                    this.points[i].y = this.drawBounds.y + this.pathPoints[i].y * this.scale;
                }

                
                

                

                
            }

            this.fireLayout();
        }

        PolygonElement.prototype.buildPath = function (s) {
            var arr = s.split(' ');
            this.pathPoints.splice(0);
            var firstPos = null;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    var pos = arr[i].split(',');
                    var x = parseInt(pos[0]);
                    var y = parseInt(pos[1]);
                    if (this.rotate > 0) {
                        var len = Math.sqrt(x * x + y * y);
                        var oldangle = namespace.Util.toAngle(Math.atan(y / x));
                        var radian = namespace.Util.toRadian(this.rotate + oldangle);
                        var newpos = { x: Math.cos(radian) * len, y: Math.sin(radian) * len };
                        this.pathPoints.push(newpos);
                    }
                    else {
                        this.pathPoints.push({ x: x, y: y });
                    }
                }
            }

            if (this.rotate > 0) {
                
                var minX = this.pathPoints[0].x;
                var minY = this.pathPoints[0].y;
                for (var i = 1; i < this.pathPoints.length; i++) {

                    if (this.pathPoints[i].x < minX) minX = this.pathPoints[i].x;
                    if (this.pathPoints[i].y < minY) minY = this.pathPoints[i].y;
                }
                for (var i = 0; i < this.pathPoints.length; i++) {
                    this.pathPoints[i].x += (0 - minX);
                    this.pathPoints[i].y += (0 - minY);
                }
            }
        }

        PolygonElement.prototype.renderHighLight = function (g) {
            namespace.NodeElement.prototype.renderHighLight.call(this, g);

            g.strokeStyle = "#333333";
            g.lineWidth = 0.5;
            g.strokeRect(this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);


        }

        PolygonElement.prototype.render = function (g) {
            g.save();
            
            
            g.moveTo(this.points[0].x, this.points[0].y);

            for (var i = 1; i < this.points.length; i++) {
                g.lineTo(this.points[i].x, this.points[i].y);
            }
            g.closePath();
            if (this.backgroundColor) {
                g.fill();
            }

            if (this.backgroundImage) {
                g.drawImage(this.backgroundImage, this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);

            }

            if (this.borderSize > 0) {
                g.strokeStyle = this.borderColor;
                g.lineWidth = this.borderSize;
                g.stroke();
            }

            if (namespace.Util.andEnum(this.status, namespace.Status.Selected)) {
                g.fillStyle = "rgba(255,255,255,0.7)";
                g.fill();
            }


            g.restore();
        }

        PolygonElement.prototype.preRender = function (g) {
        }
        PolygonElement.prototype.setEditMode = function (mode) {
            
            
            if (this.canEdit && this.canEvent) {
                this.setValue('editMode', mode);
                if (this.editMode > namespace.EditMode.Select) {
                    this.invalidLayout();
                }
            }
        }
        namespace.PolygonElement = PolygonElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name BirdsEye
        * @type class
        * @file birdseye
        * @description 鸟瞰视图
        * 在舞台指定位置以缩略图形式展示整个场景信息
        * 在鸟瞰图上不显示Line及其子类对象，其他元素将忽略其特性，均以相应缩放的矩形代表呈现
        */
        function BirdsEye() {
            namespace.NodeElement.call(this);

            this.type = "lion.BirdsEye";
            var element = this;

            this.width = 100;
            this.height = 100;
            this.position = namespace.Position.BottomRight;
            var _rect = new Rect();
            /**
            * @name rect
            * @type field
            * @datatype Rect
            * @description 获取鸟瞰图呈现的矩形区域
            * @class BirdsEye
            */
            Object.defineProperties(this, {
                rect: {
                    get: function () {
                        return _rect;
                    },
                    enumerable: false
                }
            });

            var _rectChildren = [];
            /**
            * @name rectChildren
            * @type field
            * @datatype Rect[]
            * @description 获取鸟瞰图下显示的元素（元素均以矩形描述）
            * @class BirdsEye
            */
            Object.defineProperties(this, {
                rectChildren: {
                    get: function () {
                        return _rectChildren;
                    },
                    enumerable: false
                }
            });



            this.onHit(function (location) {
                var scaleSceneX = element.width / element.scene.width;
                var scaleSceneY = element.height / element.scene.height;


                element.rect.x = element.drawBounds.x + location.x;
                element.rect.y = element.drawBounds.y + location.y;
                element.rect.width = element.scene.stage.width * scaleSceneX;
                element.rect.height = element.scene.stage.height * scaleSceneY;

                var posineye = new Point(location.x, location.y);
                if (posineye.x + element.rect.width > element.width) {
                    posineye.x = element.width - element.rect.width;
                }
                if (posineye.y + element.rect.height > element.height) {
                    posineye.y = element.height - element.rect.height;
                }

                element.rect.x = element.drawBounds.x + posineye.x;
                element.rect.y = element.drawBounds.y + posineye.y;

                element.scene.x = 0 - posineye.x / scaleSceneX;
                element.scene.y = 0 - posineye.y / scaleSceneY;

                element.scene.layers.action.refresh();

                element.invalidLayout();
            });


        }
        BirdsEye.prototype = new namespace.NodeElement();
        BirdsEye.prototype.updateBounds = function (g) {

            if (this.position == namespace.Position.TopLeft) {
                this.drawBounds.x = 0;
                this.drawBounds.y = 0;
            }
            else if (this.position == namespace.Position.TopRight) {
                this.drawBounds.x = this.stage.width - this.width;
                this.drawBounds.y = 0;
            }
            else if (this.position == namespace.Position.BottomLeft) {
                this.drawBounds.x = 0;
                this.drawBounds.y = this.stage.height - this.height;
            }
            else if (this.position == namespace.Position.BottomRight) {
                this.drawBounds.x = this.stage.width - this.width;
                this.drawBounds.y = this.stage.height - this.height;
            }
            this.drawBounds.width = this.width;
            this.drawBounds.height = this.height;



            this.rectChildren.splice(0);
            var scaleX = this.width / this.scene.width;
            var scaleY = this.height / this.scene.height;
            var eles = this.scene.layers.action.elements;
            for (var i = 0; i < eles.length; i++) {
                
                if (eles[i] instanceof namespace.LinkElement) continue;
                if (eles[i] instanceof namespace.LineElement) {

                }
                else {
                    this.rectChildren.push(new Rect(
                         this.drawBounds.x + (eles[i].x) * scaleX,
                         this.drawBounds.y + (eles[i].y) * scaleY,
                        eles[i].width * scaleX,
                        eles[i].height * scaleY));

                }
            }
        }
        BirdsEye.prototype.render = function (g) {
            
            
            

            g.fillStyle = this.backgroundColor;
            g.fillRect(this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);

            g.strokeStyle = "rgb(255,255,255)";
            g.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            g.fillStyle = "rgb(100,100,100)";

            for (var i = 0; i < this.rectChildren.length; i++)
                g.fillRect(this.rectChildren[i].x, this.rectChildren[i].y, this.rectChildren[i].width, this.rectChildren[i].height);
        }
        BirdsEye.prototype.renderHighLight = function (g) { }
        namespace.BirdsEye = BirdsEye;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name EndPoint
        * @type class
        * @file endpoint
        * @inherit GeoElement
        * @description 端点元素
        * 该元素为所有节点元素（NodeElement）的调节端点，一般无需设置
        */
        function EndPoint(args) {
            namespace.GeoElement.call(this);

            this.width = 8;
            this.height = 8;
            this.type = "EndPoint";
            this.backgroundColor = "rgb(0,162,200)";
            var data = this.__data__;
            data.controlMode = namespace.EndPointMode.TopLeft;
            data.controlElement = args;

            this.setParent(args);
        }

        EndPoint.prototype = new namespace.GeoElement();
        Object.defineProperties(EndPoint.prototype, {
            controlMode: {
                get: function () {
                    return this.getValue('controlMode');
                },
                set: function (val) {
                    this.setValue('controlMode', val);
                },
                enumerable: true
            },
            controlElement: {
                get: function () {
                    return this.getValue('controlElement');
                },
                set: function (val) {
                    this.setValue('controlElement', val);
                },
                enumerable: false
            },
            scenePosition: {
                get: function () {
                    return this.getValue('scenePosition');
                },
                enumerable: false
            }

        });
        EndPoint.prototype.invalidLayout = function (mode) {
            namespace.GeoElement.prototype.invalidLayout.call(this,mode);
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].invalidLayout(mode);
            }
        }

        EndPoint.prototype.updateBounds = function (g) {

            
            var px = 0, py = 0;
            if (this.parent instanceof namespace.LineElement) {

                px = this.scene.x;
                py = this.scene.y;
                this.drawBounds.x = (this.x + px) * this.scale; 
                this.drawBounds.y = (this.y + py) * this.scale;

            }
            else {
                px = this.parent ? this.parent.drawBounds.x : 0;
                py = this.parent ? this.parent.drawBounds.y : 0;
                this.drawBounds.x = (this.x * this.scale + px); 
                this.drawBounds.y = (this.y * this.scale + py);
            }

            
            
            
            


            this.drawBounds.width = this.width;
            this.drawBounds.height = this.height;
            this.drawBounds.calc();

        }
        EndPoint.prototype.move = function (x, y) {
            
            
            
            
            
            if (this.controlMode == namespace.EndPointMode.TopLeft) {

                if (this.controlElement.editMode == namespace.EditMode.Free ||
                    this.controlElement.editMode == namespace.EditMode.NodeControl) {
                    this.x = x;
                    this.y = y;
                }
                else if (this.controlElement.editMode == namespace.EditMode.Scale) {

                    var max = x > y ? x : y;
                    this.controlElement.x += max;
                    this.controlElement.y += max;
                    this.controlElement.width -= max;
                    this.controlElement.height -= max;
                }


            }
            else if (this.controlMode == namespace.EndPointMode.TopRight) {
                if (this.controlElement.editMode == namespace.EditMode.Free ||
                    this.controlElement.editMode == namespace.EditMode.NodeControl) {
                    this.x = x;
                    this.y = y;
                }
                else if (this.controlElement.editMode == namespace.EditMode.Scale) {
                    this.controlElement.y += y;
                    this.controlElement.width -= y;
                    this.controlElement.height -= y;
                }
            }
            else if (this.controlMode == namespace.EndPointMode.BottomLeft) {
                if (this.controlElement.editMode == namespace.EditMode.Free ||
                    this.controlElement.editMode == namespace.EditMode.NodeControl) {
                    this.x = x;
                    this.y = y;

                }
                else if (this.controlElement.editMode == namespace.EditMode.Scale) {
                    this.controlElement.x += x;
                    this.controlElement.width -= x;
                    this.controlElement.height -= x;
                }

            }
            else if (this.controlMode == namespace.EndPointMode.BottomRight) {
                if (this.controlElement.editMode == namespace.EditMode.Free ||
                    this.controlElement.editMode == namespace.EditMode.NodeControl) {
                    this.x = x;
                    this.y = y;
                }
                else if (this.controlElement.editMode == namespace.EditMode.Scale) {

                    this.controlElement.width += y;
                    this.controlElement.height += y;

                }

            }
            else if (this.controlMode == namespace.EndPointMode.MiddleTop) {
                this.controlElement.y += y;
                this.controlElement.height -= y;
            }
            else if (this.controlMode == namespace.EndPointMode.MiddleBottom) {
                this.controlElement.height += y;
                
            }
            else if (this.controlMode == namespace.EndPointMode.MiddleLeft) {
                this.controlElement.x += x;
                this.controlElement.width -= x;
            }
            else if (this.controlMode == namespace.EndPointMode.MiddleRight) {
                this.controlElement.width += x;
                
            }

            else if (this.controlMode == namespace.EndPointMode.Landscape) {
                this.x = x;
            }
            else if (this.controlMode == namespace.EndPointMode.Vertical) {
                this.y = y;
            }
            else if (this.controlMode == namespace.EndPointMode.Start || this.controlMode == namespace.EndPointMode.End) {

                if (this.controlElement.editMode == namespace.EditMode.Free ||
                    this.controlElement.editMode == namespace.EditMode.NodeControl) {
                    this.x = x;
                    this.y = y;
                    this.controlElement.invalidLayout();
                }
            }

            
            for (var n = 0; n < this.controlElement.nodes.length; n++) {
                if (!(this.controlElement instanceof namespace.LineElement)) {
                    this.controlElement.resetNodeLocation(this.controlElement.nodes[n]);
                }
            }
        }
        EndPoint.prototype.renderHighLight = function (g) {
            g.fillStyle = this.highlightColor;
            g.beginPath();
            g.arc(this.drawBounds.center.x, this.drawBounds.center.y, this.width / 2, 0, 2 * Math.PI);
            g.closePath();
            g.fill();
        }
        EndPoint.prototype.render = function (g) {
            g.fillStyle = this.backgroundColor;
            g.beginPath();
            g.arc(this.drawBounds.center.x, this.drawBounds.center.y, this.width / 2, 0, 2 * Math.PI);
            g.fill();

            if (this.borderSize > 0) {
                g.strokeStyle = this.borderColor;
                g.lineWidth = this.borderSize;
                g.stroke();
            }
        }
        EndPoint.prototype.dispose = function () {
            this.controlElement = null;
        }
        namespace.EndPoint = EndPoint;
    })(lion);


    
    
    !(function (namespace) {
        /**
        * @name RectElement
        * @type class
        * @file rectelement
        * @inherit NodeElement
        * @description 矩形元素
        */
        function RectElement() {


            namespace.NodeElement.call(this, arguments[0]);
            this.type = "lion.RectElement";
            var data = this.__data__;

            data.width = 50;
            data.height = 50;
            data.radius = 0;

        }
        RectElement.prototype = new namespace.NodeElement();

        Object.defineProperties(RectElement.prototype, {
            /**
            * @name width
            * @type field
            * @datatype number
            * @description 矩形的宽度
            * @class RectElement
            */
            
            
            
            
            
            
            
            
            
            
            /**
            * @name height
            * @type field
            * @datatype number
            * @description 矩形的高度
            * @class RectElement
            */
            
            
            
            
            
            
            
            
            
            
            /**
            * @name radius
            * @type field
            * @datatype number
            * @description 矩形的圆角半径
            * @class RectElement
            */
            radius: {
                get: function () {
                    return this.getValue('radius');
                },
                set: function (value) {
                    this.setValue('radius', value);
                    this.invalidLayout();
                },
                enumerable: true
            }

        });
        RectElement.prototype.updateBounds = function (g) {
            namespace.NodeElement.prototype.updateBounds.call(this, g);
        }
        RectElement.prototype.preRender = function (g) {
            if (this.radius > 0) {
                pathRoundRect(g,
                this.drawBounds.x,
                this.drawBounds.y,
                this.drawBounds.width,
                this.drawBounds.height,
                this.radius
                );
            }
        }
        RectElement.prototype.renderHighLight = function (g) {
            if (this.highlightColor) {
                if (this.radius > 0) {
                    g.fillStyle = this.highlightColor;
                    g.fill();
                }
                else {
                    g.fillStyle = this.highlightColor;
                    g.fillRect(this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);
                }
            }
        }
        RectElement.prototype.renderBackground = function (g) {

            g.shadowBlur = 8;
            g.shadowColor = this.shadow;
            if (this.backgroundColor) {
                if (this.radius > 0) {
                    g.fillStyle = getBgColor(g, this.backgroundColor);
                    g.fill();
                }
                else {        
                    g.fillStyle = getBgColor(g, this.backgroundColor);
                    g.fillRect(this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);

                }
            }
            
            if (this.backgroundImage) {
                g.save();
                if (this.radius > 0) g.clip();
                g.drawImage(this.backgroundImage, this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);
                g.restore();
            }

        }
        RectElement.prototype.render = function (g) {
         

            if (this.radius > 0) {

                if (this.borderSize > 0) {
                    g.strokeStyle = this.borderColor;
                    g.lineWidth = this.borderSize;
                    g.stroke();
                }
            } else {
                if (this.borderSize > 0 && !namespace.Util.isNullOrWhitespace(this.borderColor)) {
                    g.strokeStyle = this.borderColor;
                    g.lineWidth = this.borderSize;
                    g.strokeRect(this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);
                }
            }

        }
        namespace.RectElement = RectElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
            * @name MixElement
            * @type class
            * @file MixElement
            * @inherit RectElement
            * @description 面板容器元素
            * MixElement具备真实大小的及位置信息，子元素形成包含关系
            */
        function MixElement() {

            namespace.RectElement.call(this, arguments[0]);
            this.type = 'lion.MixElement';
            var data = this.__data__;
            data.elements = [];
            data.events.click = [];
            data.width = 400;
            data.height = 400;
            data.eventRoute = true;
            this.__hoverElement__;
        }



        MixElement.prototype = new namespace.RectElement();
        Object.defineProperties(MixElement.prototype, {
            /**
            * @name elements
            * @type field
            * @datatype Element[]
            * @description 获取子元素
            * @class MixElement
            */
            elements: {
                get: function () {
                    return this.getValue('elements');
                },
                enumerable: true
            },
            /**
            * @name eventRoute
            * @type field
            * @datatype boolean
            * @description 获取或设置事件是否路由至子元素，默认为true
            如果为true，事件触发顺序按从上至下依次执行
            * @class MixElement
            */
            eventRoute: {
                get: function () {
                    return this.getValue('eventRoute');
                },
                set: function (value) {
                    this.setValue('eventRoute',value);
                },
                enumerable: true
            }
            
        });
        /**
        * @name onClick(callback)
        * @type function
        * @description 添加面板的点击事件
        * @class MixElement
        * @param callback function true 回调函数
        */
        MixElement.prototype.onClick = function (callback) {
            this.events.click.push(callback);
        }
        
        
        
        
        
        
        
        
        
        
        
        

        
        
        
        MixElement.prototype.fireClick = function (e) {
            var next = true;
            if (this.eventRoute) {
                for (var i = 0; i < this.elements.length; i++) {
                    var mp = this.layer.getMousePoint();
                    if (this.elements[i].testPoint(mp.x, mp.y)) {
                        var rtv = this.elements[i].fireClick(e);
                        if (rtv != undefined && rtv == false)
                            next = false;
                    }
                }
            }

            if (next)
                namespace.RectElement.prototype.fireClick.call(this,e);
        }
        /**
        * @name add(ele)
        * @type function
        * @description 添加一个元素
        * @class MixElement
        * @param ele Element true 被添加的元素
        */
        MixElement.prototype.add = function (ele) {
            this.elements.push(ele);
            ele.setParent(this);
            if (ele.id == -1) {
                ele.setValue('id', generateId());
            }
        }
        MixElement.prototype.preRender = function (g) {
            var ishover = false;
            if (this.eventRoute) {
                for (var i = 0; i < this.elements.length; i++) {
                    var mp = this.layer.getMousePoint();
                    if (mp != null) {
                        if (this.elements[i].testPoint(mp.x, mp.y)) {
                            ishover = true;
                            if (!this.elements[i].equals(this.__hoverElement__)) {
                                this.__hoverElement__ = this.elements[i];
                                var rtv = this.__hoverElement__.fireHover();

                                break;
                            }
                        }
                        else {
                            if (this.elements[i].equals(this.__hoverElement__)) {
                                this.__hoverElement__.fireLeave();
                                break;
                            }
                        }
                    }
                }
            }

            if (!ishover) {
                this.__hoverElement__ = null;
            }
            
            namespace.RectElement.prototype.preRender.call(this, g);

        }
        MixElement.prototype.updateBounds = function (g) {
            namespace.RectElement.prototype.updateBounds.call(this, g);
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].updateBounds(g);
        }
        MixElement.prototype.renderHighLight = function (g) {
            for (var i = 0; i < this.elements.length; i++) {
                var mp = this.layer.getMousePoint();
                if (this.elements[i].testPoint(mp.x, mp.y)) {
                    this.elements[i].renderHighLight(g);
                }
            }
        }

        MixElement.prototype.invalidLayout = function (mode) {
            namespace.RectElement.prototype.invalidLayout.call(this,mode);
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].invalidLayout(mode);
        }
        MixElement.prototype.render = function (g) {
            namespace.RectElement.prototype.render.call(this, g);
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].render(g);
        }
        MixElement.prototype.renderBackground = function (g) {
            namespace.RectElement.prototype.renderBackground.call(this, g);
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].renderBackground(g);
        }
        MixElement.prototype.dispose = function () {
            if (!this.isdisposed) {
                for (var i = 0; i < this.elements.length; i++) {
                    this.elements[i].dispose();
                }
                this.elements.splice(0);
                namespace.RectElement.prototype.dispose.call(this);
                this.isdisposed = true;
            }
        }
        namespace.MixElement = MixElement;
    })(lion);

    
    
    !(function (namespace) {
        function TextElement() {
            /**
            * @name TextElement
            * @type class
            * @file textelement
            * @inherit RectElement
            * @description 文本标签元素
            */
            namespace.RectElement.call(this, arguments[0]);
            this.type = "lion.TextElement";
            var data = this.__data__;
            data.backgroundColor = null;
            data.width = 200;
            data.height = 50;
            data.align = namespace.Align.Center;
            data.autoSize = true;

        }
        TextElement.prototype = new namespace.RectElement();
        Object.defineProperties(TextElement.prototype, {
            /**
            * @name autoSize
            * @type field
            * @datatype bool
            * @description 是否根据文本自动控制大小
            * @class TextElement
            */
            autoSize: {
                get: function () {
                    return this.getValue('autoSize');
                },
                set: function (value) {
                    this.setValue('autoSize', value);
                    this.invalidLayout();
                },
                enumerable: true
            }

        });
        TextElement.prototype.updateBounds = function (g) {


            if (this.parent instanceof namespace.Layer) {
                var px = this.parent ? this.parent.x : 0;
                var py = this.parent ? this.parent.y : 0;
            }
            else {
                var px = this.parent ? this.parent.drawBounds.x : 0;
                var py = this.parent ? this.parent.drawBounds.y : 0;
            }
            if (this.autoSize) {
                this.drawBounds.x = (this.x + px) * this.scale;
                this.drawBounds.y = (this.y + py) * this.scale;
                this.drawBounds.width = 0;
                this.drawBounds.height = 0;

                var rect = this.measureText(g);
                if (rect) {
                    this.drawBounds.width = rect.width + 6;
                    this.drawBounds.height = rect.height + 6;
                }

                this.fireLayout();
            }
            else {
                return namespace.RectElement.prototype.updateBounds.call(this, g);
            }

            

        }
        TextElement.prototype.renderHighLight = function (g) {
            
        }
        namespace.TextElement = TextElement;
    })(lion);


    
    
    !(function (namespace) {
        /**
        * @name TooltipElement
        * @type class
        * @file tooltip
        * @inherit BaseTextElement
        * @description Tooltip提示元素
        */
        function TooltipElement() {
            namespace.BaseTextElement.call(this);
            this.type = "lion.Tooltip";
            var data = this.__data__;
            
            data.position = namespace.Align.TopRight;
            data.autoSize = true;
            this.align = namespace.Align.TopLeft;
            this.width = 50;
            this.height = 30;
            this.borderSize = 1;
            this.borderColor = "#333333";
            this.backgroundColor = "#eeeeee";
            this.canDrag = false;
            this.allowMultiline = true;
            var element = this;

            this.preRender = function (g) {
            }

            this.renderHighLight = function (g) {
            }

            this.render = function (g) {
                g.shadowBlur = 0;
                g.shadowColor = "";
                if (element.autoSize) {
                    var rect = this.getTextRect();
                    if (rect) {
                        g.fillStyle = element.backgroundColor;
                        pathRoundRect(g, rect.x - 5, rect.y - 3, rect.width + 10, rect.height + 10, 5);
                        g.fill();

                        if (element.borderSize > 0) {
                            g.strokeStyle = element.borderColor;
                            g.lineWidth = element.borderSize;
                            g.stroke();
                        }
                    }
                }
                else {
                    g.fillStyle = element.backgroundColor;
                    pathRoundRect(g, element.drawBounds.x, element.drawBounds.y, element.drawBounds.width, element.drawBounds.height, 5);
                    g.fill();

                    if (element.borderSize > 0) {
                        g.strokeStyle = element.borderColor;
                        g.lineWidth = element.borderSize;
                        g.stroke();
                    }
                }

                element.renderText(g);
            }
        }
        TooltipElement.prototype = new namespace.BaseTextElement(true);
        TooltipElement.prototype.updateBounds = function (g) {
            var px = this.parent ? this.parent.drawBounds.bounds.rightTop.x - 10 : 0;
            var py = this.parent ? this.parent.drawBounds.bounds.rightTop.y - 10 : 0;

            this.drawBounds.x = (this.x + px) * this.scale;
            this.drawBounds.y = (this.y + py) * this.scale;
            this.drawBounds.width = this.width * this.scale;
            this.drawBounds.height = this.height * this.scale;
        }
        namespace.Tooltip = TooltipElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name CircleElement
        * @type class
        * @file circleelement
        * @inherit NodeElement
        * @description 圆形元素
        */
        function CircleElement() {

            namespace.NodeElement.call(this);
            var data = this.__data__;
            
            this.radius = 20;
            this.type = "lion.CircleElement";

        }
        CircleElement.prototype = new namespace.NodeElement();
        Object.defineProperties(CircleElement.prototype, {
            /**
            * @name width
            * @type field
            * @datatype number
            * @description 获取圆形的宽度
            * @class RectElement
            */
            width: {
                get: function () {
                    return this.getValue('width');
                },

                enumerable: false
            },
            /**
            * @name height
            * @type field
            * @datatype number
            * @description 获取圆形的高度
            * @class RectElement
            */
            height: {
                get: function () {
                    return this.getValue('height');
                },
                enumerable: false
            },
            /**
            * @name radius
            * @type field
            * @datatype number
            * @description 获取或设置半径
            * @class CircleElement
            */
            radius: {
                get: function () {
                    return this.getValue('radius');
                },
                set: function (value) {
                    this.setValue('width', value * 2);
                    this.setValue('height', value * 2);
                    this.setValue('radius', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            }

        });
        CircleElement.prototype.updateBounds = function (g) {
            var px = this.parent ? this.parent.x : 0;
            var py = this.parent ? this.parent.y : 0;

            this.drawBounds.x = (this.x + px) * this.scale;
            this.drawBounds.y = (this.y + py) * this.scale;
            this.drawBounds.width = this.radius * 2 * this.scale;
            this.drawBounds.height = this.radius * 2 * this.scale;
            this.drawBounds.calc();

            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].updateBounds(g);
            }

            this.fireLayout();
        }
        CircleElement.prototype.preRender = function (g) {
            g.beginPath();
            g.arc(this.drawBounds.center.x, this.drawBounds.center.y, this.radius * this.scale, 0, 2 * Math.PI);
            g.closePath();
        }
        CircleElement.prototype.renderHighLight = function (g) {
            g.fillStyle = this.highlightColor;
;
            g.fill();

        }
        CircleElement.prototype.renderBackground = function (g) {


            if (g.shadowColor != this.shadow) {
                g.shadowBlur = 8;
                g.shadowColor = this.shadow;
            }
            if (g.fillStyle != this.backgroundColor) g.fillStyle = this.backgroundColor;
           
            g.fill();

            if (this.backgroundImage) {
                g.save();
                g.clip();
                g.drawImage(this.backgroundImage, this.drawBounds.x, this.drawBounds.y, this.drawBounds.width, this.drawBounds.height);
                g.restore();
            }
        }
        CircleElement.prototype.render = function (g) {

            if (this.borderSize > 0) {

                g.strokeStyle = this.borderColor;
                g.lineWidth = this.borderSize;
                g.stroke();
            }
        }
        namespace.CircleElement = CircleElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name LineElement
        * @type class
        * @file lineelement
        * @inherit NodeElement
        * @description 直线元素
        */
        function LineElement() {

            namespace.NodeElement.call(this);
            var data = this.__data__;
            this.type = "lion.LineElement";
            data.backgroundColor = "#333333";
            
            data.arrowSize = 10;
            
            data.arrowDirection = namespace.ArrowDirection.Right;
            
            data.arrowStyle = namespace.ArrowStyle.Triangle;
            data.bindPathAnimations = [];
            
            data.startNode = new namespace.EndPoint(this);
            
            data.endNode = new namespace.EndPoint(this);
            data.arrows = [];
            data.points = [];
            data.textBlocks = {
            };
            data.animationInvalid = false;

        }

        LineElement.prototype = new namespace.NodeElement();
        Object.defineProperties(LineElement.prototype, {
            /**
            * @name arrowSize
            * @type field
            * @datatype bool
            * @description 是否为自动大小
            * @class LineElement
            */
            arrowSize: {
                get: function () {
                    return this.getValue('arrowSize');
                },
                set: function (value) {
                    this.setValue('arrowSize', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name arrowDirection
            * @type field
            * @datatype number
            * @description 获取或设置箭头方向
            * @class LineElement
            */
            arrowDirection: {
                get: function () {
                    return this.getValue('arrowDirection');
                },
                set: function (value) {
                    this.setValue('arrowDirection', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name arrowStyle
            * @type field
            * @datatype number
            * @description 获取或设置箭头样式
            * @class LineElement
            */
            arrowStyle: {
                get: function () {
                    return this.getValue('arrowStyle');
                },
                set: function (value) {
                    this.setValue('arrowStyle', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name bindPathAnimations
            * @type field
            * @datatype Animation[]
            * @description 获取所绑定的路径动画
            * @class LineElement
            */
            bindPathAnimations: {
                get: function () {
                    return this.getValue('bindPathAnimations');
                },
                enumerable: false
            },
            /**
            * @name startNode
            * @type field
            * @datatype Element
            * @description 获取或设置开始元素
            * @class LineElement
            */
            startNode: {
                get: function () {
                    return this.getValue('startNode');
                },
                set: function (value) {
                    this.setValue('startNode', value);
                    this.invalidLayout();
                },
                enumerable: true
            },
            /**
            * @name endNode
            * @type field
            * @datatype Element
            * @description 获取或设置结束元素
            * @class LineElement
            */
            endNode: {
                get: function () {
                    return this.getValue('endNode');
                },
                set: function (value) {
                    this.setValue('endNode', value);
                    this.invalidLayout();
                },
                enumerable: true
            },

            /**
            * @name arrows
            * @type field
            * @datatype number[]
            * @description 获取或设置箭头集合
            * @class LineElement
            */
            arrows: {
                get: function () {
                    return this.getValue('arrows');
                },
                set: function (value) {
                    this.setValue('arrows', value);
                },
                enumerable: false
            },
            /**
            * @name points
            * @type field
            * @datatype Array
            * @description 获取线索形成的点集合
            * @class LineElement
            */
            points: {
                get: function () {
                    return this.getValue('points');
                },
                enumerable: false
            },
            /**
            * @name textBlocks
            * @type field
            * @datatype Array
            * @description 获取文本块集合
            * @class LineElement
            */
            textBlocks: {
                get: function () {
                    return this.getValue('textBlocks');
                },
                enumerable: false
            },
            /**
            * @name animationInvalid
            * @type field
            * @datatype bool
            * @description 获取或设置绑定的动画是否无效，从而导致重绘
            * @class LineElement
            */
            animationInvalid: {
                get: function () {
                    return this.getValue('animationInvalid');
                },
                set: function (value) {
                    this.setValue('animationInvalid', value);
                },
                enumerable: false
            }

        });
        LineElement.prototype.ondeserialize = function (key, value) {

            if (key == "startNode") {
                this._start_ = value;

                return true;
            }
            if (key == "endNode") {
                this._end_ = value;

                return true;
            }

        }
        LineElement.prototype.enddeserialize = function () {

            this.setPoint(this._start_.x, this._start_.y, this._end_.x, this._end_.y);

        }
        /**
        * @name setTextBlock(text, align,color)
        * @type function
        * @description 设置文本块
        * @class LineElement
        * @param text string true 显示的字符串文本
        * @param align number true 文本的对齐方式
        * @param color string false 文本颜色
        */
        LineElement.prototype.setTextBlock = function (text, align, color) {

            var te = new namespace.TextElement();
            te.text = text;
            te.foreColor = color;
            te.setParent(this);
            this.textBlocks[align] = {
                textEle: te, align: align
            };

        }
        LineElement.prototype.setParent = function (parentEle) {
            namespace.NodeElement.prototype.setParent.call(this, parentEle);
            if (this.startNode)
                this.startNode.setParent(this);
            if (this.endNode)
                this.endNode.setParent(this);
        }
        LineElement.prototype.setScale = function (scale) {
            this.scale = scale;
            if (this.startNode)
                this.startNode.setScale(scale);
            if (this.endNode)
                this.endNode.setScale(scale);
        }
        LineElement.prototype.invalidLayout = function (mode) {

            if (mode == "bounds") {
                this.animationInvalid = true;
            }

            namespace.NodeElement.prototype.invalidLayout.call(this, mode);
            
        }
        LineElement.prototype.updateBounds = function (g) {

            

            this.startNode.updateBounds(g);
            this.endNode.updateBounds(g);


            this.drawBounds.x = this.startNode.drawBounds.center.x < this.endNode.drawBounds.center.x ? this.startNode.drawBounds.center.x : this.endNode.drawBounds.center.x;
            this.drawBounds.y = this.startNode.drawBounds.center.y < this.endNode.drawBounds.center.y ? this.startNode.drawBounds.center.y : this.endNode.drawBounds.center.y;
            this.drawBounds.width = Math.abs(this.startNode.drawBounds.center.x - this.endNode.drawBounds.center.x) + this.borderSize;
            this.drawBounds.height = Math.abs(this.startNode.drawBounds.center.y - this.endNode.drawBounds.center.y) + this.borderSize;


            if (this.animationInvalid) {
                for (var i = 0; i < this.bindPathAnimations.length; i++) {
                    this.bindPathAnimations[i].invalid = true;
                }
            }

            var props = Object.getOwnPropertyNames(this.textBlocks);
            for (var i = 0; i < props.length; i++) {
                if (props[i] != "__ob__") this.textBlocks[props[i]].textEle.updateBounds(g);

            }

            this.fireLayout();
        }
        /**
        * @name testPoint(x, y)
        * @type function
        * @description 测试点是否再直线上
        * @class LineElement
        * @param x number true 点的x坐标
        * @param y number true 点的y坐标
        * @return 在直线上返回true，否则返回false
        */
        LineElement.prototype.testPoint = function (x, y) {

            
            var range = 5;
            var pf = { x: x, y: y };
            var p1 = this.startNode.drawBounds.center;
            var p2 = this.endNode.drawBounds.center;
            
            var cross = (p2.x - p1.x) * (pf.x - p1.x) + (p2.y - p1.y) * (pf.y - p1.y);
            if (cross <= 0) return false;
            var d2 = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
            if (cross >= d2) return false;


            var r = cross / d2;
            var px = p1.x + (p2.x - p1.x) * r;
            var py = p1.y + (p2.y - p1.y) * r;
            
            var ran = Math.sqrt((pf.x - px) * (pf.x - px) + (py - pf.y) * (py - pf.y));
            
            return ran <= range;

        }
        LineElement.prototype.preRender = function (g) {

            this.points.splice(0);
            if (this.startNode && this.endNode) {
                this.points.push({
                    x: this.startNode.drawBounds.center.x, y: this.startNode.drawBounds.center.y
                });
                this.points.push({
                    x: this.endNode.drawBounds.center.x, y: this.endNode.drawBounds.center.y
                });
                this._arrows = [];
                this.preArrow(g, this.points[0], this.points[1]);
            }
        }
        LineElement.prototype.render = function (g) {
            if (this.points.length > 0) {
                g.fillStyle = this.backgroundColor;
                g.strokeStyle = this.backgroundColor;
                g.lineWidth = this.borderSize * this.scale;
                g.beginPath();
                g.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 1; i < this.points.length; i++) {
                    g.lineTo(this.points[i].x, this.points[i].y);
                }
                g.stroke();


                for (var i = 0; i < this._arrows.length; i++) {
                    this.renderArrow(g, this.arrowStyle, this.backgroundColor, this._arrows[i].from, this._arrows[i].to);
                }

                var props = Object.getOwnPropertyNames(this.textBlocks);
                for (var i = 0; i < props.length; i++) {
                    if (props[i] != "__ob__") this.textBlocks[props[i]].textEle.renderText(g);
                }
            }

            if (this._poly) {
                g.beginPath();
                g.moveTo(this._poly[0].x, this._poly[0].y);
                for (var i = 1; i < this._poly.length; i++) {
                    g.lineTo(this._poly[i].x, this._poly[i].y);
                }
                g.lineTo(this._poly[0].x, this._poly[0].y);
                g.stroke();
            }

        }
        LineElement.prototype.renderHighLight = function (g) {
            if (this.points.length > 0) {
                g.strokeStyle = this.highlightColor;
                g.fillStyle = this.highlightColor;
                g.lineWidth = this.borderSize;
                g.beginPath();
                g.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 1; i < this.points.length; i++) {
                    g.lineTo(this.points[i].x, this.points[i].y);
                }
                g.stroke();

                for (var i = 0; i < this._arrows.length; i++) {
                    this.renderArrow(g, this.arrowStyle, this.highlightColor, this._arrows[i].from, this._arrows[i].to);
                }
            }
        }
        LineElement.prototype.renderBackground = function (g) {

        }
        LineElement.prototype.setPoint = function (x1, y1, x2, y2) {

            this.startNode.controlMode = namespace.EndPointMode.Start;
            this.startNode.x = x1;
            this.startNode.y = y1;
            this.startNode.width = 10;
            this.startNode.height = 10;
            


            this.endNode.controlMode = namespace.EndPointMode.End;
            this.endNode.x = x2;
            this.endNode.y = y2;
            this.endNode.width = 10;
            this.endNode.height = 10;

        }
        /**
        * @name showNodes(nodes)
        * @type function
        * @description 显示端点
        * @class LineElement
        * @param nodes Array false 显示端点的类型集合，默认为全部显示
        */
        LineElement.prototype.showNodes = function (nodes) {

            this.initNodes();
            this.displayNodes = [];
            if (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] == namespace.EndPointMode.Start)
                        this.displayNodes.push(this.startNode);
                    else if (nodes[i] == namespace.EndPointMode.End)
                        this.displayNodes.push(this.endNode);
                }
            }
            else {
                this.displayNodes.push(this.startNode);
                this.displayNodes.push(this.endNode);
            }
        }
        /**
        * @name lineTo(x, y)
        * @type function
        * @description 设置直线的结束点
        * @class LineElement
        * @param x number true 点的x坐标
        * @param y number true 点的y坐标
        */
        LineElement.prototype.lineTo = function (x, y) {
            
            this.endNode.x = x;
            this.endNode.y = y;
            this.invalidLayout("bounds");
        }
        /**
       * @name moveTo(x, y)
       * @type function
       * @description 设置直线偏移量
       * @class LineElement
       * @param x number true 点的x偏移
       * @param y number true 点的y偏移
       * @param ongrid number false 是否按网格移动，默认为false
       */
        LineElement.prototype.offset = function (x, y, ongrid) {
            
            this.startNode.x += x;
            this.startNode.y += y;
            this.endNode.x += x;
            this.endNode.y += y;

            if (ongrid) {
                this.startNode.x = Math.ceil(this.startNode.x / 10) * 10;
                this.startNode.y = Math.ceil(this.startNode.y / 10) * 10;
                this.endNode.x = Math.ceil(this.endNode.x / 10) * 10;
                this.endNode.y = Math.ceil(this.endNode.y / 10) * 10;
            }

            this.invalidLayout("bounds");
        }
        /**
        * @name moveTo(x, y)
        * @type function
        * @description 移动直线至坐标
        * @class LineElement
        * @param x number true 点的x坐标
        * @param y number true 点的y坐标
        * @param ongrid number false 是否按网格移动，默认为false
        */
        LineElement.prototype.moveTo = function (x, y, ongrid) {
            this.startNode.x += x;
            this.startNode.y += y;
            this.endNode.x += x;
            this.endNode.y += y;

            if (ongrid) {
                this.startNode.x = Math.ceil(this.startNode.x / 10) * 10;
                this.startNode.y = Math.ceil(this.startNode.y / 10) * 10;
                this.endNode.x = Math.ceil(this.endNode.x / 10) * 10;
                this.endNode.y = Math.ceil(this.endNode.y / 10) * 10;
            }

            this.invalidLayout("bounds");
        }
        /**
        * @name getNode(endpointMode)
        * @type function
        * @description 按端点类型获取一个调节端点
        * @class LineElement
        * @param endpointMode number true 端点类型
        * @return 返回端点实例EndPoint
        */

        LineElement.prototype.getNode = function (endpointMode) {
            if (this.nodes.length == 0) {
                this.initNodes();
            }

            if (endpointMode == namespace.EndPointMode.Start)
                return this.nodes[0];
            else if (endpointMode == namespace.EndPointMode.End)
                return this.nodes[1];
        }
        LineElement.prototype.initNodes = function () {

            this.nodes.push(this.startNode);
            this.nodes.push(this.endNode);
            this.startNode.setValue("id", generateId());
            this.endNode.setValue("id", generateId());

        }
        LineElement.prototype.preArrow = function (g, startDrawCenter, endDrawCenter) {
            if (this.arrowSize > 0) {
                if (this.arrowDirection == namespace.ArrowDirection.Left) {
                    this._arrows.push({
                        from: {
                            x: endDrawCenter.x,
                            y: endDrawCenter.y
                        },
                        to: {
                            x: startDrawCenter.x,
                            y: startDrawCenter.y
                        }
                    });
                } else if (this.arrowDirection == namespace.ArrowDirection.Right) {
                    this._arrows.push({
                        from: {
                            x: startDrawCenter.x,
                            y: startDrawCenter.y
                        },
                        to: {
                            x: endDrawCenter.x,
                            y: endDrawCenter.y
                        }
                    });
                } else if (this.arrowDirection == namespace.ArrowDirection.Both) {
                    this._arrows.push({
                        from: {
                            x: endDrawCenter.x,
                            y: endDrawCenter.y
                        },
                        to: {
                            x: startDrawCenter.x,
                            y: startDrawCenter.y
                        }
                    });
                    this._arrows.push({
                        from: {
                            x: startDrawCenter.x,
                            y: startDrawCenter.y
                        },
                        to: {
                            x: endDrawCenter.x,
                            y: endDrawCenter.y
                        }
                    });
                }
            }

        }
        LineElement.prototype.onserialize = function (key, value) {
            if (key == "startNode") return '"startNode":{"x":' + value.x + ',"y":' + value.y + '}';
            if (key == "endNode") return '"endNode":{"x":' + value.x + ',"y":' + value.y + '}';
        }
        LineElement.prototype.renderArrow = function (g, style, bgcolor, start, end) {

            if (style == namespace.ArrowStyle.Arrow) {
                paintArrow(g, start, end, this.arrowSize, bgcolor);
            }
            else if (style == namespace.ArrowStyle.Triangle) {
                paintTriangle(g, start, end, this.arrowSize, bgcolor);
            }
            else if (style == namespace.ArrowStyle.Circle) {
                paintCircle(g, end.x, end.y, this.arrowSize / 2, bgcolor);
            }
            else if (style == namespace.ArrowStyle.Rect) {
                paintRect(g, end.x, end.y, this.arrowSize / 2, bgcolor);
            }
        }
        namespace.LineElement = LineElement;

    })(lion);


    
    
    !(function (namespace) {
        /**
        * @name LinkElement
        * @type class
        * @file linkelement
        * @inherit LineElement
        * @description 连接线元素
        */
        function LinkElement() {

            namespace.LineElement.call(this);
            var data = this.__data__;
            data.canDrag = false;
            this.type = "lion.LinkElement";

            data.startNode = null;
            data.endNode = null;
            data.startElement = null;
            data.endElement = null;
            data.onEdge = false;
  
        }
        
        LinkElement.prototype = new namespace.LineElement();
        Object.defineProperties(LinkElement.prototype, {

            /**
            * @name startNode
            * @type field
            * @datatype Element
            * @description 获取或设置开始元素
            * @class LineElement
            */
            startElement: {
                get: function () {
                    return this.getValue('startElement');
                },
                set: function (value) {
                    this.setValue('startElement', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name endNode
            * @type field
            * @datatype Element
            * @description 获取或设置结束元素
            * @class LineElement
            */
            endElement: {
                get: function () {
                    return this.getValue('endElement');
                },
                set: function (value) {
                    this.setValue('endElement', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name onEdge
            * @type field
            * @datatype boolean
            * @description 获取或设置是否连接元素的边缘，默认为false，对于直角连线，则自动寻找对应方向
            * @class LineElement
            */
            onEdge: {
                get: function () {
                    return this.getValue('onEdge');
                },
                set: function (value) {
                    this.setValue('onEdge', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            }
           

        });
        LinkElement.prototype.ondeserialize = function (key, value) {

            
            if (key == "startNode") {
                this._start_ = value.split('_');;
            }
            if (key == "endNode") {
                this._end_ = value.split('_');;
            }

        }
        LinkElement.prototype.moveTo = function (x, y, ongrid) {
        }
        LinkElement.prototype.enddeserialize = function () {

            var start = this.layer.findElementById(this._start_[0]);
            var end = this.layer.findElementById(this._end_[0]);
            this.setStartAndEnd(start, end, this._start_[1], this._end_[1]);
            delete this._start_;
            delete this._end_;
        }

        

        LinkElement.prototype.updateBounds = function (g) {

            if (this.startNode && this.endNode) {
                this.drawBounds.x = this.startNode.drawBounds.center.x < this.endNode.drawBounds.center.x ? this.startNode.drawBounds.center.x : this.endNode.drawBounds.center.x;
                this.drawBounds.y = this.startNode.drawBounds.center.y < this.endNode.drawBounds.center.y ? this.startNode.drawBounds.center.y : this.endNode.drawBounds.center.y;
                this.drawBounds.width = Math.abs(this.startNode.drawBounds.center.x - this.endNode.drawBounds.center.x) + this.borderSize;
                this.drawBounds.height = Math.abs(this.startNode.drawBounds.center.y - this.endNode.drawBounds.center.y) + this.borderSize;
            }
            if (this.animationInvalid) {
                for (var i = 0; i < this.bindPathAnimations.length; i++) {
                    this.bindPathAnimations[i].invalid = true;
                }
                this.animationInvalid = false;
            }
            var props = Object.getOwnPropertyNames(this.textBlocks);
            for (var i = 0; i < props.length; i++) {
                if (props[i] == "__ob__") continue;
                var tb = this.textBlocks[props[i]];
                tb.textEle.updateBounds(g);
                if (tb.align == namespace.Align.Start) {
                    tb.textEle.drawBounds.x =
                        this.startNode.drawBounds.center.x < this.endNode.drawBounds.center.x ? this.startNode.drawBounds.center.x : this.startNode.drawBounds.center.x - tb.textEle.drawBounds.width;
                    tb.textEle.drawBounds.y = this.startNode.drawBounds.y;
                }
                else if (tb.align == namespace.Align.End) {
                    tb.textEle.drawBounds.x =
                       this.startNode.drawBounds.center.x < this.endNode.drawBounds.center.x ? this.endNode.drawBounds.center.x - tb.textEle.drawBounds.width : this.endNode.drawBounds.center.x;
                    tb.textEle.drawBounds.y = this.endNode.drawBounds.y;
                }
                else {
                    tb.textEle.drawBounds.x = this.drawBounds.x + (this.drawBounds.width - tb.textEle.drawBounds.width) / 2;
                    tb.textEle.drawBounds.y = this.drawBounds.y + (this.drawBounds.height - tb.textEle.drawBounds.height) / 2;
                }
            }

            this.fireLayout();
        }
        function getEdge(ele, ele2) {
            
            if (ele instanceof namespace.RectElement) {
                if (ele.drawBounds.center.x < ele2.drawBounds.center.x && ele.drawBounds.center.y < ele2.drawBounds.center.y) {
                    var w = ele2.drawBounds.center.x - ele.drawBounds.center.x;
                    var h = ele2.drawBounds.center.y - ele.drawBounds.center.y;
                    var radian = Math.atan(h / w);
                    var angle = namespace.Util.toAngle(radian);

                    if (angle <= 45) {
                        var h2 = ele.drawBounds.width / 2 * Math.tan(radian);

                        var x = ele.drawBounds.x + ele.drawBounds.width;
                        var y = ele.drawBounds.y + ele.drawBounds.height / 2 + h2;
                        return { x: x, y: y };
                    }
                    else if (angle > 45) {
                        var w2 = ele.drawBounds.height / 2 / Math.tan(radian);

                        var x = ele.drawBounds.x + ele.drawBounds.width / 2 + w2;
                        var y = ele.drawBounds.y + ele.drawBounds.height;
                        return { x: x, y: y };
                    }
                    else {
                        console.log(angle);
                    }
                }
                else if (ele.drawBounds.center.x > ele2.drawBounds.center.x && ele.drawBounds.center.y < ele2.drawBounds.center.y) {
                    var w = ele.drawBounds.center.x - ele2.drawBounds.center.x;
                    var h = ele2.drawBounds.center.y - ele.drawBounds.center.y;
                    var radian = Math.atan(h / w);
                    var angle = namespace.Util.toAngle(radian);
                    if (angle <= 45) {
                        var h2 = ele.drawBounds.width / 2 * Math.tan(radian);
                        var x = ele.drawBounds.x;
                        var y = ele.drawBounds.center.y + h2;
                        return { x: x, y: y };
                    }
                    else if (angle > 45) {
                        var w2 = ele.drawBounds.height / 2 / Math.tan(radian);

                        var x = ele.drawBounds.center.x - w2;
                        var y = ele.drawBounds.y + ele.drawBounds.height;
                        return { x: x, y: y };
                    }
                    else {
                        console.log(angle);
                    }
                }
                else if (ele.drawBounds.center.x > ele2.drawBounds.center.x && ele.drawBounds.center.y > ele2.drawBounds.center.y) {
                    var w = ele.drawBounds.center.x - ele2.drawBounds.center.x;
                    var h = ele.drawBounds.center.y - ele2.drawBounds.center.y;
                    var radian = Math.atan(h / w);
                    var angle = namespace.Util.toAngle(radian);
                    if (angle <= 45) {
                        var h2 = ele.drawBounds.width / 2 * Math.tan(radian);
                        var x = ele.drawBounds.x;
                        var y = ele.drawBounds.center.y - h2;
                        return { x: x, y: y };
                    }
                    else if (angle > 45) {
                        var w2 = ele.drawBounds.height / 2 / Math.tan(radian);

                        var x = ele.drawBounds.center.x - w2;
                        var y = ele.drawBounds.y;
                        return { x: x, y: y };
                    }
                    else {
                        console.log(angle);
                    }
                }
                else if (ele.drawBounds.center.x < ele2.drawBounds.center.x && ele.drawBounds.center.y > ele2.drawBounds.center.y) {
                    var w = ele2.drawBounds.center.x - ele.drawBounds.center.x;
                    var h = ele.drawBounds.center.y - ele2.drawBounds.center.y;
                    var radian = Math.atan(h / w);
                    var angle = namespace.Util.toAngle(radian);

                    if (angle <= 45) {
                        var h2 = ele.drawBounds.width / 2 * Math.tan(radian);

                        var x = ele.drawBounds.x + ele.drawBounds.width;
                        var y = ele.drawBounds.y + ele.drawBounds.height / 2 - h2;
                        return { x: x, y: y };
                    }
                    else if (angle > 45) {
                        var w2 = ele.drawBounds.height / 2 / Math.tan(radian);

                        var x = ele.drawBounds.x + ele.drawBounds.width / 2 + w2;
                        var y = ele.drawBounds.y;
                        return { x: x, y: y };
                    }
                    else {
                        console.log(angle);
                    }
                }
                else if (ele.drawBounds.center.y == ele2.drawBounds.center.y && ele.drawBounds.center.x < ele2.drawBounds.center.x) {
                    return { x: ele.drawBounds.x + ele.drawBounds.width, y: ele.drawBounds.center.y };
                }
                else if (ele.drawBounds.center.y == ele2.drawBounds.center.y && ele.drawBounds.center.x > ele2.drawBounds.center.x) {
                    return { x: ele.drawBounds.x, y: ele.drawBounds.center.y };
                }
                else if (ele.drawBounds.center.x == ele2.drawBounds.center.x && ele.drawBounds.center.y < ele2.drawBounds.center.y) {
                    return { x: ele.drawBounds.center.x, y: ele.drawBounds.y + ele.drawBounds.height };
                }
                else if (ele.drawBounds.center.x == ele2.drawBounds.center.x && ele.drawBounds.center.y > ele2.drawBounds.center.y) {
                    return { x: ele.drawBounds.center.x, y: ele.drawBounds.y };
                }
                else {
                    return { x: 0, y: 0 };
                }
            }
            else if (ele instanceof namespace.CircleElement) {
                var w = (ele2.drawBounds.center.x - ele.drawBounds.center.x);
                var h = (ele2.drawBounds.center.y - ele.drawBounds.center.y);
                var radian = Math.atan(h / w);



                var y = ele.drawBounds.center.y + (w > 0 ? Math.sin(radian) * ele.radius : 0 - Math.sin(radian) * ele.radius);
                var x = ele.drawBounds.center.x + (w > 0 ? Math.cos(radian) * ele.radius : 0- Math.cos(radian) * ele.radius);
                return { x: x, y: y };


            }
        }
        LinkElement.prototype.preRender = function (g) {
            
            
     
            this.points.splice(0);
            if (this.startNode && this.endNode) {
                if (this.startNode.controlMode == namespace.EndPointMode.Center) {
                    var startEdge = getEdge(this.startElement, this.endElement);
                    this.points.push({
                        x: startEdge.x, y: startEdge.y
                    });
                }
                else if (this.startNode == null) {
                    this.points.push(this.startElement.drawBounds.center);
                }
                else {
                    this.points.push({
                        x: this.startNode.drawBounds.center.x, y: this.startNode.drawBounds.center.y
                    });

                }

                if (this.startElement instanceof namespace.RectElement && this.endNode.controlMode == namespace.EndPointMode.Center) {

                    var endEdge = getEdge(this.endElement, this.startElement);
                    this.points.push({
                        x: endEdge.x, y: endEdge.y
                    });
                }
                else if (this.endNode == null) {
                    this.points.push(this.endElement.drawBounds.center);
                }
                else {
                    this.points.push({
                        x: this.endNode.drawBounds.center.x, y: this.endNode.drawBounds.center.y
                    });
                    
                }
                this._arrows = [];
                this.preArrow(g, this.points[0], this.points[1]);
            }
     
            
        }


        defineMethod(LinkElement.prototype, "setStartAndEnd", function (start, end) {
            this.startElement = start.controlElement;
            this.startNode = start;
            this.endElement = end.controlElement;
            this.endNode = end;
            this.startNode.lines.push(this);
            this.endNode.lines.push(this);
        });
        /**
        * @name setStartAndEnd(start, end, sm, em)
        * @type function
        * @description 设置连线的起始点
        * @class LinkElement
        * @param start Element true 开始元素，取元素中心点
        * @param end Element true 结束元素，取元素中心点
        * @param onEdge bool false 是否在元素边缘，默认为false
        */
        defineMethod(LinkElement.prototype, "setStartAndEnd", function (start, end, onedge) {
            this.onEdge = arguments[2];
            this.startElement = start;
            this.startNode = start.getNode(namespace.EndPointMode.Center);
            this.endElement = end;
            this.endNode = end.getNode(namespace.EndPointMode.Center);
            this.startNode.lines.push(this);
            this.endNode.lines.push(this);
        });
        /**
        * @name setStartAndEnd(start, end, sm, em)
        * @type function
        * @description 设置连线的起始点
        * @class LinkElement
        * @param start Element|EndPoint true 开始元素节点,或元素，如果为节点，sm为空，如果为元素，sm为元素的节点类型
        * @param end Element|EndPoint true 结束元素节点,或元素，如果为节点，em为空，如果为元素，em为元素的节点类型
        * @param sm number false 开始元素的节点类型，start为开始元素节点时此参数无效
        * @param em number false 结束元素的节点类型，start为开始元素节点时此参数无效
        * @param onEdge bool false 是否在元素边缘，默认为false
        */
        defineMethod(LinkElement.prototype, "setStartAndEnd", function (start, end, sm, em) {
            this.startElement = start;
            this.startNode = start.getNode(arguments[2]);
            this.endElement = end;
            this.endNode = end.getNode(arguments[3]);
            this.startNode.lines.push(this);
            this.endNode.lines.push(this);
        });
       
        LinkElement.prototype.setParent = function (parentEle) {
            namespace.NodeElement.prototype.setParent.call(this, parentEle);
        }
        LinkElement.prototype.invalidLayout = function (mode) {

            if (mode == "bounds") {
                this.animationInvalid = true;
            }

            namespace.BaseTextElement.prototype.invalidLayout.call(this,mode);
            
        }
        LinkElement.prototype.onserialize = function (key, value) {
            if (key == "startNode") return '"startNode":"' + value.controlElement.id + '_' + value.controlMode + '"';
            if (key == "endNode") return '"endNode":"' + value.controlElement.id + '_' + value.controlMode + '"';
        }
        namespace.LinkElement = LinkElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name CurveLinkElement
        * @type class
        * @file curvelinkelement
        * @inherit LinkElement
        * @description 曲线连接线元素
        */
        function CurveLinkElement() {

            namespace.LinkElement.call(this);
            this.type = "lion.CurveLinkElement";

            function getPointOnCurve(t, p0, p1, p2) {
                
                
                
                
                
                
                
                
                var point = {};
                var temp = 1 - t;
                point.x = temp * temp * p0.x + 2 * t * temp * p1.x + t * t * p2.x;
                point.y = temp * temp * p0.y + 2 * t * temp * p1.y + t * t * p2.y;
                return point;


            }

            this.preArrow = function (g, startDrawCenter, endDrawCenter) {
                if (this.arrowSize > 0) {
                    if (this.arrowDirection == namespace.ArrowDirection.Left) {
                        var pe = getPointOnCurve(0.1, this.points[0], this.points[1], this.points[2]);
                        this._arrows.push({
                            from: pe,
                            to: this.points[0]
                        });
                    } else if (this.arrowDirection == namespace.ArrowDirection.Right) {

                        var pe = getPointOnCurve(0.9, this.points[0], this.points[1], this.points[2])
                        this._arrows.push({
                            from: pe,
                            to: this.points[2]
                        });
                    } else if (this.arrowDirection == namespace.ArrowDirection.Both) {
                        var pe = getPointOnCurve(0.1, this.points[0], this.points[1], this.points[2])
                        this._arrows.push({
                            from: pe,
                            to: this.points[0]
                        });
                        pe = getPointOnCurve(0.9, this.points[0], this.points[1], this.points[2])
                        this._arrows.push({
                            from: pe,
                            to: this.points[2]
                        });
                    }
                }

            }

        }

        CurveLinkElement.prototype = new namespace.LinkElement(true);
        CurveLinkElement.prototype.preRender = function (g) {

            this.points.splice(0);
            this.points.push({
                x: this.startNode.drawBounds.center.x, y: this.startNode.drawBounds.center.y
            });
            this.points.push({
                x: this.endNode.drawBounds.center.x, y: this.endNode.drawBounds.center.y
            });

            var k = (this.points[1].y - this.points[0].y) * 2 > 100 ? 100 : (this.points[1].y - this.points[0].y) * 2;
            var c1 = {
                x: this.points[0].x + (this.points[1].x - this.points[0].x) / 2, y: this.points[0].y + k
            }

            this.points.splice(1, 0, c1);

            this._arrows = [];
            this.preArrow(g, this.points[0], this.points[1]);
        }
        CurveLinkElement.prototype.render = function (g) {

            g.fillStyle = this.backgroundColor;
            g.strokeStyle = this.backgroundColor;
            g.lineWidth = this.borderSize * this.scale;
            g.beginPath();
            g.moveTo(this.points[0].x, this.points[0].y);
            g.quadraticCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y);
            g.stroke();


            for (var i = 0; i < this._arrows.length; i++) {
                this.renderArrow(g, this.arrowStyle, this.backgroundColor, this._arrows[i].from, this._arrows[i].to);
            }

            var props = Object.getOwnPropertyNames(this.textBlocks);
            for (var i = 0; i < props.length; i++) {
                if (props[i] != "__ob__") this.textBlocks[props[i]].textEle.renderText(g);

            }

        }
        CurveLinkElement.prototype.renderHighLight = function (g) {

            g.fillStyle = this.highlightColor;
            g.strokeStyle = this.highlightColor;
            g.lineWidth = this.borderSize * this.scale;
            g.beginPath();
            g.moveTo(this.points[0].x, this.points[0].y);
            g.quadraticCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y);
            g.stroke();


            for (var i = 0; i < this._arrows.length; i++) {
                this.renderArrow(g, this.arrowStyle, this.highlightColor, this._arrows[i].from, this._arrows[i].to);
            }

        }
        namespace.CurveLinkElement = CurveLinkElement;
    })(lion);

    
    
    !(function (namespace) {
        /**
        * @name RAngleLinkElement
        * @type class
        * @file ranglelinkelement
        * @inherit LinkElement
        * @description 直角连线元素
        */
        function RAngleLinkElement() {

            namespace.LinkElement.call(this);
            var data = this.__data__;
            data.startDirection = namespace.Direction.Right;
            data.endDirection = namespace.Direction.Left;
            data.minInflexion = 50;
            this.type = "lion.RAngleLinkElement";
            this.__oldStartPos = {
                x: 0, y: 0
            };
            this.__oldEndtPos = {
                x: 0, y: 0
            };


        }
        RAngleLinkElement.prototype = new namespace.LinkElement(true);
        Object.defineProperties(RAngleLinkElement.prototype, {
            /**
            * @name startDirection
            * @type field
            * @datatype number
            * @description 获取连线开始的方向
            * @class RAngleLinkElement
            */
            startDirection: {
                get: function () {
                    return this.getValue('startDirection');
                },
                set: function (value) {
                    this.setValue('startDirection', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name endDirection
            * @type field
            * @datatype number
            * @description 获取连线结束的方向
            * @class RAngleLinkElement
            */
            endDirection: {
                get: function () {
                    return this.getValue('endDirection');
                },
                set: function (value) {
                    this.setValue('endDirection', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            },
            /**
            * @name minInflexion
            * @type field
            * @datatype number
            * @description 最小转折点
            * @class RAngleLinkElement
            */
            minInflexion: {
                get: function () {
                    return this.getValue('minInflexion');
                },
                set: function (value) {
                    this.setValue('minInflexion', value);
                    this.invalidLayout("bounds");
                },
                enumerable: true
            }

        });

        function getMinLength(l1, l2, defaultVal) {
            var l = Math.abs(l2 - l1) / 2;
            return l < defaultVal ? l : defaultVal;
        }

        function getMaxLength(l1, l2, defaultVal) {
            var l = Math.abs(l2 - l1) / 2;
            return l > defaultVal ? l : defaultVal;
        }


        
        function nextIsEnd(curDirection, endDirection, start, end) {
            switch (curDirection) {
                case namespace.Direction.Top:
                    {
                        return (start.y > end.y && start.x < end.x && endDirection == namespace.Direction.Left) ||
                            (start.y > end.y && start.x > end.x && endDirection == namespace.Direction.Right);
                    }
                    break;
                case namespace.Direction.Bottom:
                    {
                        return (start.y < end.y && start.x < end.x && endDirection == namespace.Direction.Left) ||
                            (start.y < end.y && start.x > end.x && endDirection == namespace.Direction.Right);
                    }
                    break;
                case namespace.Direction.Left:
                    {
                        return (start.x > end.x && start.y < end.y && endDirection == namespace.Direction.Top) ||
                            (start.x > end.x && start.y > end.y && endDirection == namespace.Direction.Bottom);
                    }
                    break;
                case namespace.Direction.Right:
                    {
                        return (start.x < end.x && start.y < end.y && endDirection == namespace.Direction.Top) ||
                            (start.x < end.x && start.y > end.y && endDirection == namespace.Direction.Bottom);
                    }
                    break;
            }
        }

        
        function findPoints(o, start, end, minInflexion) {
            var array = [];
            var blankstep = minInflexion;
            var last = o.startDirection;
            var cur = start;
            array.push(start);
            
            while (cur.x != end.x || cur.y != end.y) {
                switch (last) {
                    case namespace.Direction.Top: {


                        if (o.endDirection == namespace.Direction.Top) {
                            if (cur.x == end.x) {
                                cur = (cur.y < end.y) ? { x: cur.x, y: cur.y - getMinLength(end.y, cur.y, blankstep) } : { x: cur.x, y: cur.y - getMaxLength(end.y, cur.y, blankstep) };
                            }
                            else {
                                cur = (cur.y < end.y) ? { x: cur.x, y: cur.y - blankstep } : { x: cur.x, y: end.y - blankstep };
                            }
                        }
                        else if (o.endDirection == namespace.Direction.Bottom) {
                            if (cur.y < end.y) {
                                cur = { x: cur.x, y: cur.y - blankstep };
                            }
                            else {
                                cur = (cur.x == end.x) ? { x: end.x, y: end.y } : { x: cur.x, y: cur.y - getMaxLength(end.y, cur.y, blankstep) };
                            }
                        }
                        else {

                            if (nextIsEnd(last, o.endDirection, cur, end)) { cur = { x: cur.x, y: end.y }; }
                            else if (cur.y < end.y) { cur = { x: cur.x, y: cur.y - getMinLength(end.y, cur.y, blankstep) }; }
                            else { cur = { x: cur.x, y: cur.y - getMaxLength(end.y, cur.y, blankstep) }; }
                        }

                        if (cur.x < end.x) last = namespace.Direction.Right
                        else last = namespace.Direction.Left;

                    }
                        break;
                    case namespace.Direction.Bottom: {
                        if (o.endDirection == namespace.Direction.Bottom) {
                            if (cur.x == end.x) {
                                cur = (cur.y < end.y) ? { x: cur.x, y: cur.y + getMaxLength(end.y, cur.y, blankstep) } : { x: cur.x, y: cur.y + getMinLength(end.y, cur.y, blankstep) };
                            }
                            else {
                                cur = (cur.y < end.y) ? { x: cur.x, y: end.y + blankstep } : { x: cur.x, y: cur.y + blankstep };
                            }
                        }
                        else if (o.endDirection == namespace.Direction.Top) {
                            if (cur.y < end.y) {
                                cur = (cur.x == end.x) ? { x: end.x, y: end.y } : { x: cur.x, y: cur.y + getMaxLength(end.y, cur.y, blankstep) };
                            }
                            else {
                                cur = { x: cur.x, y: cur.y + blankstep };
                            }
                        }
                        else {

                            if (nextIsEnd(last, o.endDirection, cur, end)) { cur = { x: cur.x, y: end.y }; }
                            else if (cur.y < end.y) { cur = { x: cur.x, y: cur.y + getMaxLength(end.y, cur.y, blankstep) }; }
                            else { cur = { x: cur.x, y: cur.y + getMinLength(end.y, cur.y, blankstep) }; }
                        }
                        if (cur.x < end.x) last = namespace.Direction.Right
                        else last = namespace.Direction.Left;

                    }
                        break;
                    case namespace.Direction.Left: {
                        if (o.endDirection == namespace.Direction.Left) {
                            if (cur.y == end.y) {
                                cur = (cur.x < end.x) ? { x: cur.x - getMinLength(end.x, cur.x, blankstep), y: cur.y } : { x: cur.x - getMaxLength(end.x, cur.x, blankstep), y: cur.y };
                            }
                            else {
                                cur = (cur.x < end.x) ? { x: cur.x - blankstep, y: cur.y } : { x: end.x - blankstep, y: cur.y };
                            }
                        }
                        else if (o.endDirection == namespace.Direction.Right) {
                            if (cur.x < end.x) {
                                cur = { x: cur.x - blankstep, y: cur.y };
                            }
                            else {
                                cur = (cur.y == end.y) ? { x: end.x, y: end.y } : { x: cur.x - getMaxLength(end.x, cur.x, blankstep), y: cur.y };
                            }
                        }
                        else {
                            if (nextIsEnd(last, o.endDirection, cur, end)) { cur = { x: end.x, y: cur.y }; }
                            else if (cur.x < end.x) { cur = { x: cur.x - getMinLength(end.x, cur.x, blankstep), y: cur.y } }
                            else { cur = { x: cur.x - getMaxLength(end.x, cur.x, blankstep), y: cur.y }; }
                        }

                        if (cur.y < end.y) last = namespace.Direction.Bottom
                        else last = namespace.Direction.Top;
                    }
                        break;
                    case namespace.Direction.Right: {
                        if (o.endDirection == namespace.Direction.Right) {
                            if (cur.y == end.y) {
                                cur = (cur.x > end.x) ? { x: cur.x + getMinLength(end.x, cur.x, blankstep), y: cur.y } : { x: cur.x + getMaxLength(end.x, cur.x, blankstep), y: cur.y };
                            }
                            else {
                                cur = (cur.x < end.x) ? { x: end.x + blankstep, y: cur.y } : { x: cur.x + blankstep, y: cur.y };
                            }
                        }
                        else if (o.endDirection == namespace.Direction.Left) {
                            if (cur.x < end.x) {
                                cur = (cur.y == end.y) ? { x: end.x, y: end.y } : { x: cur.x + getMaxLength(end.x, cur.x, blankstep), y: cur.y };

                            }
                            else {
                                cur = { x: cur.x + blankstep, y: cur.y };
                            }
                        }
                        else {
                            if (nextIsEnd(last, o.endDirection, cur, end)) { cur = { x: end.x, y: cur.y }; }
                            else if (cur.x < end.x) { cur = { x: cur.x + getMaxLength(end.x, cur.x, blankstep), y: cur.y }; }
                            else { cur = { x: cur.x + getMinLength(end.x, cur.x, blankstep), y: cur.y }; }
                        }

                        if (cur.y < end.y) last = namespace.Direction.Bottom
                        else last = namespace.Direction.Top;
                    }
                        break;
                }

                array.push(cur);

                if (array.length > 10) break;
            }

            return array;
        }


        RAngleLinkElement.prototype.innerfindPoints = function () {
            
            if (this.__oldStartPos.x != this.startNode.x ||
                                this.__oldStartPos.y != this.startNode.y ||
                                this.__oldEndtPos.x != this.endNode.x ||
                                this.__oldEndtPos.y != this.endNode.y) {
                var ps = findPoints(this, this.startNode.drawBounds.center, this.endNode.drawBounds.center, this.minInflexion);
                this.points.splice(0);
                pushArray(this.points, ps);
                this.__oldStartPos = {
                    x: this.startNode.drawBounds.center.x, y: this.startNode.drawBounds.center.y
                };
                this.__oldEndtPos = {
                    x: this.endNode.drawBounds.center.x, y: this.endNode.drawBounds.center.y
                };
            }
        }
        /**
        * @name setStartAndEnd(start, end)
        * @type function
        * @description 设置连线的起始点,不实现此函数
        * @class RAngleLinkElement
        */
        defineMethod(RAngleLinkElement.prototype, "setStartAndEnd", function (start, end) {

            throw "function setStartAndEnd(start,end) not support"
        });
        /**
        * @name setStartAndEnd(start, end, sm, em)
        * @type function
        * @description 设置连线的起始点
        * @class RAngleLinkElement
        * @param start Element|EndPoint true 开始元素节点,或元素，如果为节点，sm为空，如果为元素，sm为元素的节点类型
        * @param end Element|EndPoint true 结束元素节点,或元素，如果为节点，em为空，如果为元素，em为元素的节点类型
        * @param sm number false 开始元素的节点类型，start为开始元素节点时此参数无效
        * @param em number false 结束元素的节点类型，start为开始元素节点时此参数无效
        */
        defineMethod(RAngleLinkElement.prototype, "setStartAndEnd", function (start, end, sm, em) {
            function getDirection(start, end, endpointMode) {
                if (endpointMode == namespace.EndPointMode.MiddleLeft)
                    return namespace.Direction.Left;
                else if (endpointMode == namespace.EndPointMode.MiddleRight)
                    return namespace.Direction.Right;
                else if (endpointMode == namespace.EndPointMode.MiddleTop)
                    return namespace.Direction.Top;
                else if (endpointMode == namespace.EndPointMode.MiddleBottom)
                    return namespace.Direction.Bottom;
                else if (endpointMode == namespace.EndPointMode.End) {
                    if (start.x < end.x)
                        return namespace.Direction.Right;
                    else if (start.x > end.x)
                        return namespace.Direction.Left;
                    else if (start.y < end.y)
                        return namespace.Direction.Bottom;
                    else
                        return namespace.Direction.Top;
                }
                else if (endpointMode == namespace.EndPointMode.Start) {
                    if (start.x < end.x)
                        return namespace.Direction.Left;
                    else if (start.x > end.x)
                        return namespace.Direction.Right;
                    else if (start.y < end.y)
                        return namespace.Direction.Top;
                    else
                        return namespace.Direction.Bottom;
                }
            }
            namespace.LinkElement.prototype.setStartAndEnd.call(this, start, end,sm,em);

                this.startDirection = getDirection(this.startElement, this.endElement, this.startNode.controlMode);
                this.endDirection = getDirection(this.startElement, this.endElement, this.endNode.controlMode);
            
        });

        RAngleLinkElement.prototype.setStartAndEndDirection = function (start, end, sm, em) {
           
            namespace.LinkElement.prototype.setStartAndEnd.call(this, start, end);
            if (sm != null || em != null) {
                this.startDirection = sm;
                this.endDirection = em;
            }
        };

 
        RAngleLinkElement.prototype.updateBounds = function (g) {
            namespace.LinkElement.prototype.updateBounds.call(this, g);
            if (this.onEdge)
                this.initDirection();
        }

        RAngleLinkElement.prototype.initDirection = function () {
            var sx = this.startElement.drawBounds.center.x;
            var sy = this.startElement.drawBounds.center.y;
            var ex = this.endElement.drawBounds.center.x;
            var ey = this.endElement.drawBounds.center.y;

            if (Math.abs(ex - sx) > Math.abs(ey - sy)) {
                
                if (sx < ex) {
                    this.startNode = this.startElement.getNode(namespace.EndPointMode.MiddleRight);
                    this.endNode = this.endElement.getNode(namespace.EndPointMode.MiddleLeft);
                    this.startDirection = namespace.Direction.Right;
                    this.endDirection = namespace.Direction.Left;
                } else {
                    this.startNode = this.startElement.getNode(namespace.EndPointMode.MiddleLeft);
                    this.endNode = this.endElement.getNode(namespace.EndPointMode.MiddleRight);
                    this.startDirection = namespace.Direction.Left;
                    this.endDirection = namespace.Direction.Right;
                }
            }
            else {
                
                if (sy <= ey) {
                    this.startNode = this.startElement.getNode(namespace.EndPointMode.MiddleBottom);
                    this.endNode = this.endElement.getNode(namespace.EndPointMode.MiddleTop);
                    this.startDirection = namespace.Direction.Bottom;
                    this.endDirection = namespace.Direction.Top;
                }
                else {
                    this.startNode = this.startElement.getNode(namespace.EndPointMode.MiddleTop);
                    this.endNode = this.endElement.getNode(namespace.EndPointMode.MiddleBottom);
                    this.startDirection = namespace.Direction.Top;
                    this.endDirection = namespace.Direction.Bottom;
                }
            }

           
        }
        RAngleLinkElement.prototype.testPoint = function (x, y) {
            for (var i = 1; i < this.points.length; i++) {

                var mx = Math.min(this.points[i - 1].x, this.points[i].x);
                var my = Math.min(this.points[i - 1].y, this.points[i].y);
                var mw = Math.max(2, Math.abs(this.points[i].x - this.points[i - 1].x));
                var mh = Math.max(2, Math.abs(this.points[i].y - this.points[i - 1].y));
                if (namespace.Util.inRect(
                    mx,
                    my,
                    mw,
                    mh,
                    x, y
                    )) {
                    return true;
                }
            }

            return false;
        }
        RAngleLinkElement.prototype.preRender = function (g) {

            this.innerfindPoints.call(this);
            if (this.points.length == 0) return;
            this._arrows = [];
            if (this.arrowDirection == namespace.ArrowDirection.Left) {
                this._arrows.push({
                    from: {
                        x: this.points[1].x,
                        y: this.points[1].y
                    },
                    to: {
                        x: this.startNode.drawBounds.center.x,
                        y: this.startNode.drawBounds.center.y
                    }
                });
            }
            else if (this.arrowDirection == namespace.ArrowDirection.Right) {
                this._arrows.push({
                    from: {
                        x: this.points[this.points.length - 2].x,
                        y: this.points[this.points.length - 2].y
                    },
                    to: {
                        x: this.endNode.drawBounds.center.x,
                        y: this.endNode.drawBounds.center.y
                    }
                });
            }
            else if (this.arrowDirection == namespace.ArrowDirection.Both) {
                this._arrows.push({
                    from: {
                        x: this.points[this.points.length - 2].x,
                        y: this.points[this.points.length - 2].y
                    },
                    to: {
                        x: this.endNode.drawBounds.center.x,
                        y: this.endNode.drawBounds.center.y
                    }
                });
                this._arrows.push({
                    from: {
                        x: this.points[1].x,
                        y: this.points[1].y
                    },
                    to: {
                        x: this.startNode.drawBounds.center.x,
                        y: this.startNode.drawBounds.center.y
                    }
                });
            }

        }
        RAngleLinkElement.prototype.onserialize = function (key, value) {
            if (key == "startNode") return '"startNode":"' + value.controlElement.id + '_' + value.controlMode + '"';
            if (key == "endNode") return '"endNode":"' + value.controlElement.id + '_' + value.controlMode + '"';
        }

        RAngleLinkElement.prototype.ondeserialize = function (key, value) {

            if (key == "startNode") {
                var array = value.split('_');
                return this._start_ = array;
            }
            if (key == "endNode") {
                var array = value.split('_');
                return this._end_ = array;
            }
        }

        RAngleLinkElement.prototype.enddeserialize = function () {
            var start = this.layer.findElementById(this._start_[0]);
            var end = this.layer.findElementById(this._end_[0]);
            this.setStartAndEnd(start, end, this._start_[1], this._end_[1]);
            delete this._start_;
            delete this._end_;
        }
        namespace.RAngleLinkElement = RAngleLinkElement;
    })(lion);

    

    
    !(function (namespace) {
        /**
        * @name Layout
        * @type class
        * @file layout
        * @description 布局模式
        * 这是一个方便进行排列对齐等布局的帮助函数集
        */
        function Layout() { }
        namespace.Layout = Layout;
        
        Layout.AlignMode = {
            Left: 0,
            Right: 1,
            Top: 2,
            Buttom: 3,
            Horizontal: 10,
            Vertical: 11
        }
        
        Layout.ArrangeMode = {
            Horizontal: 0,
            Vertical: 1
        }
        /**
        * @name align(alignMode, elements, ele)
        * @type function
        * @description 将元素进行对齐
        * @class Layout
        * @param alignMode AlignMode true 对齐方式
        * @param elements Element[] true 需要进行对齐的元素
        * @param ele Element false 参照元素,空则按第一个元素进行对齐
        */
        Layout.align = function (alignMode, elements, ele) {
            var stand = ele ? ele : elements[0];
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].group != null) continue;
                if (alignMode == Layout.AlignMode.Left) {
                    if (elements[i] instanceof lion.Group) {
                        elements[i].move(stand.drawBounds.x, elements[i].drawBounds.y);
                    } else {
                        elements[i].x = stand.x;
                    }
                }
                else if (alignMode == Layout.AlignMode.Right)
                    elements[i].x = stand.x + stand.width - elements[i].width;
                else if (alignMode == Layout.AlignMode.Top)
                    elements[i].y = stand.y;
                else if (alignMode == Layout.AlignMode.Buttom)
                    elements[i].y = stand.y + stand.height - elements[i].height;
                else if (alignMode == Layout.AlignMode.Horizontal)
                    elements[i].y = stand.y - (elements[i].height - stand.height) / 2;
                else if (alignMode == Layout.AlignMode.Vertical)
                    elements[i].x = stand.x - (elements[i].width - stand.width) / 2;

            }
        }
        /**
        * @name arrange(arrangeMode, elements, ele)
        * @type function
        * @description 将元素进行排列
        * @class Layout
        * @param alignMode AlignMode true 排列方式
        * @param elements Element[] true 需要进行排列的元素
        * @param ele Element false 参照元素,缺省按第一个元素进行排列
        */
        Layout.arrange = function (arrangeMode, elements, space) {
            for (var i = 1; i < elements.length; i++) {
                if (arrangeMode == Layout.ArrangeMode.Horizontal)
                    elements[i].x = elements[i - 1].x + elements[i - 1].width + space;
                else if (arrangeMode == Layout.ArrangeMode.Vertical)
                    elements[i].y = elements[i - 1].y + elements[i - 1].height + space;

            }
        }
        /**
        * @name table(elements, cols, rect, row)
        * @type function
        * @description 将元素进行表格化布局
        * @class Layout
        * @param elements Element[] true 需要布局的元素
        * @param cols number true 列数
        * @param rect Rect true 布局参考的矩形位
        * @param row number false 行数，缺省为1
        */
        Layout.table = function (elements, cols, rect, row) {
            if (row == null) row = 1;
            var rw = rect.width / cols;
            var rh = rect.height / row;
            var index = 0;

            var rindex = 0;
            for (var i = 0; i < elements.length; i++) {
                var u = (i + 1) % cols;

                var cindex = (u == 0) ? cols - 1 : u - 1;
                elements[i].x = rect.x + cindex * rw;
                elements[i].y = rect.y + rindex * rh;
                if (u == 0) {
                    rindex++;
                }
            }

        }
        /**
        * @name flow(elements, stand, margin)
        * @type function
        * @description 将元素进行流布局
        * @class Layout
        * @param elements Element[] true 需要布局的元素
        * @param stand number|Rect true 参照区域
        * @param margin number true 间隙大小
        */
        Layout.flow = function (elements, stand, margin) {
            var rect = null;
            if (typeof stand == 'number') {
                rect = new Rect(0, 0, stand, 0);
            }
            else if (stand instanceof Rect) {
                rect = stand;
            }

            var lineWidth = 0;
            var lineHeight = 0;
            var lineIndex = 0;
            var lineElements = [];
            for (var i = 0; i < elements.length; i++) {

                

                lineElements.push(elements[i]);
                elements[i].x = rect.x + lineWidth + margin;
                elements[i].y = rect.y + lineHeight + margin;
                lineWidth += elements[i].width + margin;

                if (lineWidth + elements[i].x + elements[i].width + margin > rect.width) {
                    lineWidth = 0;
                    lineIndex++;
                    lineHeight += getLineHeight(lineElements) + margin;
                    lineElements.splice(0);
                }
            }

            function getLineHeight(elements) {
                var max = elements[0].height;
                for (var i = 1; i < elements.length; i++) {
                    if (elements[i].height > max) {
                        max = elements[i].height;
                    }
                }
                return max;
            }
        }
        /**
        * @name around(elements, radius, stand, startangle)
        * @type function
        * @description 将元素进行环绕布局
        * @class Layout
        * @param elements Element[] true 需要布局的元素
        * @param radius number true 环绕的半径
        * @param stand Element false 参考的中心环绕元素，缺省为第一个元素
        * @param startangle number false 开始的角度，缺省为0度
        */
        Layout.around = function (elements, radius, stand, startangle) {
   
            var step = step = 360 / elements.length;
            var angle = startangle ? startangle : 0;
            var start = 0;
            if (!stand) {
                stand = elements[0];
                step = 360 / (elements.length - 1);
                start = 1;
            }

            for (var i = start; i < elements.length; i++) {

                var radian = namespace.Util.toRadian(angle);
                var x = radius * Math.cos(radian);
                var y = radius * Math.sin(radian);
                if (!stand.drawBounds || stand.drawBounds.empty == true) {
                    elements[i].x = stand.center.x + x - (elements[i].height / 2);
                    elements[i].y = stand.center.y + y - (elements[i].height / 2);
                } else {
                    elements[i].x = stand.drawBounds.x + x - (elements[i].height / 2);
                    elements[i].y = stand.drawBounds.y + y - (elements[i].height / 2);
                }
                angle += step;
            }
        }
        /**
        * @name center(element, rect)
        * @type function
        * @description 将元素在矩形范围内居中
        * @class Layout
        * @param element Element true 需要布局的元素
        * @param rect Rect true 矩形区域
        */
        Layout.center = function (elements, rect) {

            if (elements instanceof Array) {
                var newrect = getRect(elements);
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i] instanceof namespace.LineElement) {
                        elements[i].moveTo(elements[i].x + (rect.width - newrect.width) / 2 - newrect.x,
                            elements[i].y + (rect.height - newrect.height) / 2 - newrect.y);
                    }
                    else {
                        elements[i].x = elements[i].x + (rect.width - newrect.width) / 2 - newrect.x;
                        elements[i].y = elements[i].y + (rect.height - newrect.height) / 2 - newrect.y;
                    }
                }
            }
            else {
                elements.x = rect.x + (rect.width - elements.width) / 2;
                elements.y = rect.y + (rect.height - elements.height) / 2;
            }
        }
    })
    (lion);
    

    return lion.Timer.init();

})(window);
