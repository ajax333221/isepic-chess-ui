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
<sub>**Note:** Documentation for `Ic.initBoard()` can be found [here](https://github.com/ajax333221/isepic-chess/blob/master/docs/ic-methods.md#ic-methods).</sub>

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

- Responsive board size
- Both *drag-and-drop* and *click-from-click-to* in parallel
- Highlight last move, legal moves and checks
- Many optional components:
	- Chess board
	- Material difference (small piece icons)
	- Selectable FEN text
	- Navigation buttons (first, previous, next and last)
	- Rotate board button
	- Pawn promotion dropdown
	- Board list (with *switch-to-board* links)
	- SAN move list (with *jump-to-move* links)
- Automatic component binding, no need to do anything manually to the DOM elements (they will simply work just by having their correct id property at any given time)
- Piece displacement animation
- Chess fonts:
	- **Merida** <img src="./css/images/chess-fonts/merida/wk.png" width="20"><img src="./css/images/chess-fonts/merida/wq.png" width="20"><img src="./css/images/chess-fonts/merida/wr.png" width="20"><img src="./css/images/chess-fonts/merida/wb.png" width="20"><img src="./css/images/chess-fonts/merida/wn.png" width="20"><img src="./css/images/chess-fonts/merida/wp.png" width="20"><img src="./css/images/chess-fonts/merida/bk.png" width="20"><img src="./css/images/chess-fonts/merida/bq.png" width="20"><img src="./css/images/chess-fonts/merida/br.png" width="20"><img src="./css/images/chess-fonts/merida/bb.png" width="20"><img src="./css/images/chess-fonts/merida/bn.png" width="20"><img src="./css/images/chess-fonts/merida/bp.png" width="20">
	- **isepic-chess-font** <sup>(by ajax333221)</sup> <img src="./css/images/chess-fonts/isepic/wk.png" width="20"><img src="./css/images/chess-fonts/isepic/wq.png" width="20"><img src="./css/images/chess-fonts/isepic/wr.png" width="20"><img src="./css/images/chess-fonts/isepic/wb.png" width="20"><img src="./css/images/chess-fonts/isepic/wn.png" width="20"><img src="./css/images/chess-fonts/isepic/wp.png" width="20"><img src="./css/images/chess-fonts/isepic/bk.png" width="20"><img src="./css/images/chess-fonts/isepic/bq.png" width="20"><img src="./css/images/chess-fonts/isepic/br.png" width="20"><img src="./css/images/chess-fonts/isepic/bb.png" width="20"><img src="./css/images/chess-fonts/isepic/bn.png" width="20"><img src="./css/images/chess-fonts/isepic/bp.png" width="20">

:book: Documentation
-------------

> **Note:** make sure to also read the [isepic-chess.js Documentation](https://github.com/ajax333221/isepic-chess#book-documentation).

- [Ic Ui methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/ic-methods.md#ic-methods)
- [Board Ui methods](https://github.com/ajax333221/isepic-chess/blob/master/docs/board-methods.md#board-methods)

:page_facing_up: Copyright and license
-------------

Copyright © 2021 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
