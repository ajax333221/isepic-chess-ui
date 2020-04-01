isepic-chess-ui
================

Isepic Chess UI is the user interface for [isepic-chess.js (GitHub repo)](https://github.com/ajax333221/isepic-chess). It uses jQuery for DOM manipulation and animations.

Demo
-------------

https://ajax333221.github.io/isepic-chess-ui/

Features
-------------

- Highlight legal moves / last move
- Navigation buttons
- Jump to move from the move list
- Pawn promotion dropdown menu
- Visual material difference
- Piece displacement animation
- ~~Drag-and-drop pieces~~ (currently disabled)
- Chess-font by ajax333221 ![White King](css/images/wk.png "white king")![White Queen](css/images/wq.png "white queen")![White Rook](css/images/wr.png "white rook")![White Bishop](css/images/wb.png "white bishop")![White Knight](css/images/wn.png "white knight")![White Pawn](css/images/wp.png "white pawn")![Black King](css/images/bk.png "black king")![Black Queen](css/images/bq.png "black queen")![Black Rook](css/images/br.png "black rook")![Black Bishop](css/images/bb.png "black bishop")![Black Knight](css/images/bn.png "black knight")![Black Pawn](css/images/bp.png "black pawn")

How to use?
-------------

1. Add the necessary files (the order of the **.js** files is important):

```
<link rel="stylesheet" href="./css/isepic-chess-ui.css">
<script src="./js/jquery-3.3.1.min.js"></script>
<script src="./js/isepic-chess.js"></script>
<script src="./js/isepic-chess-ui.js"></script>
```

2. Wrap your code inside `$(function(){...});` to wait for the DOM to be ready.

```
<script>
	$(function(){
		var board = Ic.initBoard({
			name : "main"
		});
		
		IcUi.refreshBoard.apply(board, [0]);
	});
</script>
```
<sub>**Note:** Documentation for `Ic.initBoard()` can be found [here](https://github.com/ajax333221/isepic-chess#documentation).</sub>

3. Open the **.html** file.

To Do
-------------

- Automatically bind `IcUi.refreshBoard()` to boards (`IcUi.refreshBoard.apply(board, [0]);` will become just `board.refreshBoard()`)
- Adaptable board size
- Create, rename and delete boards through the UI
- Set-up position mode
- Break down components for customizability
- Variety of themes and chess fonts

Copyright and License
-------------

Copyright © 2020 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
