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
- Chess-font by ajax333221 <img src="./css/images/wk.png" width="20"><img src="./css/images/wq.png" width="20"><img src="./css/images/wr.png" width="20"><img src="./css/images/wb.png" width="20"><img src="./css/images/wn.png" width="20"><img src="./css/images/wp.png" width="20"><img src="./css/images/bk.png" width="20"><img src="./css/images/bq.png" width="20"><img src="./css/images/br.png" width="20"><img src="./css/images/bb.png" width="20"><img src="./css/images/bn.png" width="20"><img src="./css/images/bp.png" width="20">

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
		
		board.refreshBoard();
	});
</script>
```
<sub>**Note:** Documentation for `Ic.initBoard()` can be found [here](https://github.com/ajax333221/isepic-chess#documentation).</sub>

3. Open the **.html** file.

To Do
-------------

- Adaptable board size
- Create, rename and delete boards through the UI
- Set-up position mode
- Break down components for customizability
- Variety of themes and chess-fonts

Copyright and License
-------------

Copyright © 2020 Ajax Isepic (ajax333221)

Licensed under MIT License: http://opensource.org/licenses/mit-license.php
