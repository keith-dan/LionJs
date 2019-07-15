/// <reference path="/script/lion.js"/>
lion.ui = {};
!(function (namespace) {
	/**
	* @name Button
	* @type class
	* @file button
	* @inherit NodeElement
	* @description 按钮元素
	*/
	function Button() {


		namespace.RectElement.call(this, arguments[0]);
		this.type = "lion.ui.Button";
		var data = this.__data__;

		data.width = 80;
		data.height = 30;
		data.radius = 0;
		data.shadow = 'grey';
		data.backgroundColor = "white";
		data.align = lion.Align.Center;
		data.canDrag = false;
		data.radius = 8;
	}
	Button.prototype = new namespace.RectElement();

	namespace.ui.Button = Button;
})(lion);

!(function (namespace) {
    /**
	* @name Button
	* @type class
	* @file button
	* @inherit NodeElement
	* @description 按钮元素
	*/
    function TextArea() {
        namespace.MixElement.call(this, arguments[0]);
        this.type = "lion.ui.TextArea";
        var data = this.__data__;

        data.width = 500;
        data.height = 100;
        data.radius = 0;
        data.shadow = 'grey';
        data.backgroundColor = "white";
        data.align = lion.Align.Center;
        data.canDrag = false;
        data.radius = 8;


        var contentArea = new namespace.RectElement();
        contentArea.width = this.width - 24;
        contentArea.height = this.height;
        contentArea.x = 0;
        contentArea.y = 0;
        contentArea.allowWrap = true;
        contentArea.backgroundColor = "grey";
        contentArea.text = "阿斯大三大四的\r\n阿斯达岁的豆腐干风格和";
        this.add(contentArea);

        var btnUp = new namespace.RectElement();
        btnUp.width = 24;
        btnUp.height = 24;
        btnUp.x = this.width - 24;
        btnUp.y = 0;
        btnUp.backgroundColor = "yellow";
        btnUp.text = "∧"
        this.add(btnUp);

        var btnDown = new namespace.RectElement();
        btnDown.width = 24;
        btnDown.height = 24;
        btnDown.x = this.width - 24;
        btnDown.y = this.height - 24;
        btnDown.backgroundColor = "yellow";
        btnDown.text = "∨"
        this.add(btnDown);

    }
    TextArea.prototype = new namespace.MixElement();

    namespace.ui.TextArea = TextArea;
})(lion);

!(function (namespace) {
    /**
	* @name Button
	* @type class
	* @file button
	* @inherit NodeElement
	* @description 按钮元素
	*/
    function Panel() {
        namespace.MixElement.call(this, arguments[0]);
        this.type = "lion.ui.Panel";
        var data = this.__data__;
    }
    Panel.prototype = new namespace.MixElement();

    namespace.ui.Panel = Panel;
})(lion);

