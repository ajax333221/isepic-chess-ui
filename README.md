<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui"><img width="100" src="https://github.com/ajax333221/isepic-chess-ui/raw/master/css/images/ic_ui_logo.png" alt="IcUi logo"></a></p>

<h1 align="center">isepic-chess-ui</h1>

Isepic Chess UI is the user interface for [isepic-chess.js](https://github.com/ajax333221/isepic-chess). It uses jQuery for DOM manipulation and animations.

:pushpin: Table of contents
-------------

- [isepic-chess-ui](https://github.com/ajax333221/isepic-chess-ui#isepic-chess-ui)
- [Table of contents](https://github.com/ajax333221/isepic-chess-ui#pushpin-table-of-contents)
- [How to use?](https://github.com/ajax333221/isepic-chess-ui#computer_mouse-how-to-use)
- [Demo](https://github.com/ajax333221/isepic-chess-ui#eye-demo)
- [Features](https://github.com/ajax333221/isepic-chess-ui#rocket-features)
- [Documentation](https://github.com/ajax333221/isepic-chess-ui#book-documentation)
	- [IcUi methods](https://github.com/ajax333221/isepic-chess-ui#list-of-icuimethods)
	- [Board UI methods](https://github.com/ajax333221/isepic-chess-ui#list-of-boarduimethods)
- [To do](https://github.com/ajax333221/isepic-chess-ui#telescope-to-do)
- [Copyright and license](https://github.com/ajax333221/isepic-chess-ui#page_facing_up-copyright-and-license)

:computer_mouse: How to use?
-------------

1. Add the necessary files (the order of the **.js** files is important):

```html
<link rel="stylesheet" href="./css/isepic-chess-ui.css">
<script src="./js/jquery-3.3.1.min.js"></script>
<script src="./js/isepic-chess.js"></script>
<script src="./js/isepic-chess-ui.js"></script>
```

2. Wrap your code inside `$(function(){...});` to wait for the DOM to be ready.

```html
<script>
  $(function(){
    var board = Ic.initBoard({
      boardName : "main"
    });
  });
</script>
```
<sub>**Note:** Documentation for `Ic.initBoard()` can be found [here](https://github.com/ajax333221/isepic-chess#documentation).</sub>

3. Add the elements you need (don't add them more than once) inside `<body>`.
```html
<div id="ic_ui_board"></div>
<div id="ic_ui_materialdiff"></div>
<input id="ic_ui_fen" value="" type="text">
<input id="ic_ui_nav_first" value="|<" type="button">
<input id="ic_ui_nav_previous" value="<" type="button">
<input id="ic_ui_nav_next" value=">" type="button">
<input id="ic_ui_nav_last" value=">|" type="button">
<input id="ic_ui_rotate" value="rotate" type="button">
<select id="ic_ui_promote">
  <option value="5" selected="selected">queen</option>
  <option value="4">rook</option>
  <option value="3">bishop</option>
  <option value="2">knight</option>
</select>
<div id="ic_ui_tabs"></div>
<div id="ic_ui_movelist"></div>
```
<sub>**Note:** there are classes that enhance them (no documentation for this yet, see `index.html` and `isepic-chess-ui.css` for help).</sub>

4. Open the **.html** file.

:eye: Demo
-------------

https://ajax333221.github.io/isepic-chess-ui/

:rocket: Features
-------------

- Highlight legal moves / last move
- Navigation buttons
- Jump to move from the move list
- Adaptable board size
- Pawn promotion dropdown menu
- Visual material difference
- Piece displacement animation
- Chess-font by ajax333221 <img src="./css/images/wk.png" width="20"><img src="./css/images/wq.png" width="20"><img src="./css/images/wr.png" width="20"><img src="./css/images/wb.png" width="20"><img src="./css/images/wn.png" width="20"><img src="./css/images/wp.png" width="20"><img src="./css/images/bk.png" width="20"><img src="./css/images/bq.png" width="20"><img src="./css/images/br.png" width="20"><img src="./css/images/bb.png" width="20"><img src="./css/images/bn.png" width="20"><img src="./css/images/bp.png" width="20">

:book: Documentation
-------------

You should first read the [isepic-chess.js Documentation](https://github.com/ajax333221/isepic-chess#book-documentation).

#### List of `IcUi.<methods>(...)`:

Isepic Chess UI library `isepic-chess-ui.js` has the following available methods.

Function | Parameters | Return | UI refresh? | Description
-------- | ---------- | ------ | ----------- | -----------
**setKeyNavMode**(<br>*allowNavigation*<br>) | <ul><li>allowNavigation (Boolean)</li></ul> | - | No | Turns on/off the **key navigation mode** to allow/deny the navigation with the keyboard arrows (`left = previous`, `up = first`, `down = last` and `right = next`).<br><br>The **key navigation mode** is initially turned off.<br><br>:large_orange_diamond:**Important:** the default behavior of the keyboard arrows will get disabled when the mode is on.<hr>Examples:<ul><li>`IcUi.setKeyNavMode(true)`</li><li>`IcUi.setKeyNavMode(false)`</li></ul>

<hr>

#### List of `board.<UImethods>(...)`:

> **Note:** the board UI methods will automatically start working when **isepic-chess-ui.js** is present, otherwise nothing will happen when they are called.

Boards created by `Ic.initBoard()` have the following available UI methods.

Function | Parameters | Return | UI refresh? | Description
-------- | ---------- | ------ | ----------- | -----------
**refreshUi**(<br>*animationType*<br>) | <ul><li>:eight_pointed_black_star:animationType (Number)</li></ul><hr>:eight_pointed_black_star:Optional Parameter | - | Yes | This method will:<ul><li>Refresh the HTML of all the components (if any) to reflect the internal state of the board.</li><li>Update the **data-attributes** of all the components (if any) to point to this **board name**.</li><li>Finish any ongoing piece animations.</li><li>Start the current animation (if any).</li></ul>If `animationType` is a **falsy-value**, no animation will happen.<br><br>If `animationType` is a **positive number**, the board will be refreshed with an animation as if the last move was played.<br><br>If `animationType` is a **negative number**, the board will be refreshed with an animation as if the next move was reverted.

:telescope: To do
-------------

- Drag-and-drop pieces
- Create, rename and delete boards through the UI
- Set-up position mode
- Variety of themes and chess-fonts

:page_facing_up: Copyright and license
-------------

Copyright © 2021 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
