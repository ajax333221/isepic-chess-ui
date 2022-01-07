/** Copyright (c) 2021 Ajax Isepic (ajax333221) Licensed MIT */

/* jshint quotmark:double, undef:true, unused:true, jquery:true, curly:true, latedef:nofunc, bitwise:false, eqeqeq:true, esversion:9 */

/* globals Ic */

(function(windw, $, Ic){
	var IcUi=(function(){
		var _VERSION="4.4.1";
		
		var _CFG={
			chessFont: "merida",
			boardLabels: true,
			boardInteractions: true,
			soundEffects: true,
			pieceAnimations: true,
			pieceDragging: true,
			highlightChecks: true,
			highlightLastMove: true,
			highlightLegalMoves: true,
			highlightSelected: true,
			scrollNavigation: true,
			arrowKeysNavigation: false,
			puzzleMode: false,
			animationTime: 300,
			draggingTime: 50,
			scrollingTime: 60
		};
		
		var _POS_Y=0;
		var _POS_X=0;
		var _INTERVAL=0;
		
		var _RAN_ONCE=false;
		var _SCROLLING_WAITING=false;
		
		var _BOARD_NAME="";
		var _SELECTED_BOS="";
		var _DRAGGING_BOS="";
		
		//---------------- helpers
		
		function _chessFontHelper(chess_font){
			chess_font=(""+chess_font).replace(/\s/g, "");
			
			if(chess_font!=="merida" && chess_font!=="isepic"){
				chess_font="merida";
			}
			
			return chess_font;
		}
		
		//---------------- utilities
		
		function _cancelAnimations(){
			$("#ic_ui_board .ic_piece_holder").finish();
		}
		
		function _cancelSelected(){
			$("#ic_ui_board .ic_highlight").removeClass("ic_highlight");
			$("#ic_ui_board .ic_selected").removeClass("ic_selected");
			
			_SELECTED_BOS="";
		}
		
		function _cancelDragging(){
			if(_INTERVAL){
				clearInterval(_INTERVAL);
				
				_INTERVAL=0;
			}
			
			if(_DRAGGING_BOS){
				$("#ic_ui_board .ic_drag_shown").remove();
				
				$("#ic_ui_board .ic_drag_hidden").show().removeClass("ic_drag_hidden");
			}
			
			_DRAGGING_BOS="";
		}
		
		function _getHoverElement(x, y){
			var rtn;
			
			rtn=null;
			
			$("#ic_ui_board .ic_ws, #ic_ui_board .ic_bs").each(function(){
				var elm, elm_top, elm_right, elm_bottom, elm_left;
				
				elm=$(this);
				
				elm_top=elm.offset().top;
				elm_right=(elm.offset().left+elm.width());
				elm_bottom=(elm.offset().top+elm.height());
				elm_left=elm.offset().left;
				
				if(x>=elm_left && x<=elm_right){
					if(y>=elm_top && y<=elm_bottom){
						rtn=elm;
						
						return false;
					}
				}
			});
			
			return rtn;
		}
		
		function _animatePiece(from_bos, to_bos, piece_class, promotion_class){
			var temp, piece_elm, from_square, to_square, old_offset, new_offset, old_h, old_w;
			
			from_square=$("#ic_ui_"+from_bos);
			to_square=$("#ic_ui_"+to_bos);
			
			old_offset=from_square.children(".ic_piece_holder").offset();
			new_offset=to_square.children(".ic_piece_holder").offset();
			
			old_h=from_square.height();
			old_w=from_square.width();
			
			to_square.html("<div class='"+("ic_piece_holder"+piece_class)+"'></div>");
			piece_elm=to_square.children(".ic_piece_holder");
			
			temp=piece_elm.clone().appendTo("#ic_ui_board");
			
			piece_elm.hide().attr("class", ("ic_piece_holder"+(promotion_class || piece_class)));
			
			temp.css({
				position: "absolute",
				top: old_offset.top,
				left: old_offset.left,
				height: old_h,
				width: old_w,
				zIndex: 1000
			}).animate({
				top: new_offset.top,
				left: new_offset.left
			}, {
				duration: _CFG.animationTime,
				always: function(){
					piece_elm.show();
					temp.remove();
				}
			});
		}
		
		function _dragPiece(initial_x, initial_y, square_bos){
			var limit, dragged_elm, piece_elm, piece_h, piece_w, piece_offset, centered_top, centered_left, target_square, old_y, old_x, limit_top, limit_right, limit_bottom, limit_left;
			
			_cancelDragging();
			
			_DRAGGING_BOS=square_bos;
			
			limit=document.body;
			
			if(limit){
				limit_top=$(limit).offset().top+$(document).scrollTop();
				limit_left=$(limit).offset().left+$(document).scrollLeft();
				
				limit_right=(limit_left+$(limit).innerWidth());
				limit_bottom=(limit_top+$(limit).innerHeight());
			}
			
			target_square=$("#ic_ui_"+square_bos);
			
			piece_h=target_square.height();
			piece_w=target_square.width();
			
			piece_elm=target_square.children(".ic_piece_holder");
			
			piece_offset=piece_elm.offset();
			
			dragged_elm=piece_elm.clone().appendTo("#ic_ui_board");
			
			piece_elm.addClass("ic_drag_hidden").hide();
			
			centered_top=(initial_y-(piece_h/2));
			centered_left=(initial_x-(piece_w/2));
			
			dragged_elm.css({
				position: "absolute",
				top: piece_offset.top,
				left: piece_offset.left,
				height: piece_h,
				width: piece_w,
				cursor: "pointer",
				zIndex: 1020
			}).addClass("ic_drag_shown").appendTo("#ic_ui_board");
			
			_POS_Y=initial_y;
			_POS_X=initial_x;
			
			old_y=_POS_Y;
			old_x=_POS_X;
			
			_INTERVAL=setInterval(function(){
				var pos_y, pos_x;
				
				if(old_y!==_POS_Y || old_x!==_POS_X){
					pos_y=(centered_top-(initial_y-_POS_Y));
					pos_x=(centered_left-(initial_x-_POS_X));
					
					if(pos_y<limit_top && limit){
						pos_y=limit_top;
					}else if((pos_y+dragged_elm.innerHeight())>limit_bottom && limit){
						pos_y=(limit_bottom-dragged_elm.outerHeight());
					}
					
					if(pos_x<limit_left && limit){
						pos_x=limit_left;
					}else if(pos_x+dragged_elm.innerWidth()>limit_right && limit){
						pos_x=(limit_right-dragged_elm.outerWidth());
					}
					
					dragged_elm.css({
						top: pos_y,
						left: pos_x
					});
				}
				
				old_y=_POS_Y;
				old_x=_POS_X;
			}, _CFG.draggingTime);
		}
		
		function _bindOnce(){
			var doc;
			
			if(!_RAN_ONCE){
				_RAN_ONCE=true;
				
				doc=$(document);
				
				doc.off("click.icuifen").on("click.icuifen", "#ic_ui_fen", function(){
					$(this).select();
				});
				
				doc.off("click.icuidebug").on("click.icuidebug", "#ic_ui_debug_toggler", function(){
					$(this).text("Debug "+($("#ic_ui_debug").is(":visible") ? "▲" : "▼"));
					
					$("#ic_ui_debug").toggle();
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("keydown.icuikeynav").on("keydown.icuikeynav", function(e){
					var board, current_nav;
					
					block:
					{
						if(!_CFG.arrowKeysNavigation){
							break block;
						}
						
						if(e.which<37 || e.which>40){
							break block;
						}
						
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[keydown]: board not found");
							break block;
						}
						
						current_nav=["left", "up", "right", "down"][e.which-37];
						
						switch(current_nav){
							case "up" :
								board.navFirst();
								break;
							case "left" :
								board.navPrevious();
								break;
							case "right" :
								board.navNext();
								break;
							case "down" :
								board.navLast();
								break;
							default :
								Ic.utilityMisc.consoleLog("Error[keydown]: invalid case \""+current_nav+"\"");
						}
						
						return false;
					}
				});
				
				doc.off("click.icuifirst").on("click.icuifirst", "#ic_ui_nav_first", function(){
					var board;
					
					if($(this).hasClass("ic_disabled")){
						return false;
					}
					
					block:
					{
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_first]: board not found");
							break block;
						}
						
						board.navFirst();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuiprev").on("click.icuiprev", "#ic_ui_nav_previous", function(){
					var board;
					
					if($(this).hasClass("ic_disabled")){
						return false;
					}
					
					block:
					{
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_previous]: board not found");
							break block;
						}
						
						board.navPrevious();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuinext").on("click.icuinext", "#ic_ui_nav_next", function(){
					var board;
					
					if($(this).hasClass("ic_disabled")){
						return false;
					}
					
					block:
					{
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_next]: board not found");
							break block;
						}
						
						board.navNext();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuilast").on("click.icuilast", "#ic_ui_nav_last", function(){
					var board;
					
					if($(this).hasClass("ic_disabled")){
						return false;
					}
					
					block:
					{
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_last]: board not found");
							break block;
						}
						
						board.navLast();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuirotate").on("click.icuirotate", "#ic_ui_rotate", function(){
					var board;
					
					if($(this).hasClass("ic_disabled")){
						return false;
					}
					
					block:
					{
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[#ic_ui_rotate]: board not found");
							break block;
						}
						
						board.toggleIsRotated();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("change.icuipromote").on("change.icuipromote", "#ic_ui_promote", function(){
					var board;
					
					block:
					{
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[#ic_ui_promote]: board not found");
							break block;
						}
						
						board.setPromoteTo($(this).val());
					}
				});
				
				doc.off("click.icuichange").on("click.icuichange", ".ic_changeboard", function(){
					var board, board_name;
					
					block:
					{
						board_name=$(this).attr("data-rebindboardname");
						
						if(!board_name){
							Ic.utilityMisc.consoleLog("Error[.ic_changeboard]: missing data-rebindboardname");
							break block;
						}
						
						board=Ic.getBoard(board_name);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[.ic_changeboard]: board not found");
							break block;
						}
						
						refreshUi.apply(board, [0, false]);
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuipgnlinks").on("click.icuipgnlinks", ".ic_pgn_link", function(){
					var pgn_index, board;
					
					block:
					{
						pgn_index=$(this).attr("data-index");
						
						if(!pgn_index){
							Ic.utilityMisc.consoleLog("Error[.ic_pgn_link]: missing data-index");
							break block;
						}
						
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[.ic_pgn_link]: board not found");
							break block;
						}
						
						board.navLinkMove(pgn_index);
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("mousemove.icuirefreshpos").on("mousemove.icuirefreshpos", function(e){
					block:
					{
						if(!_CFG.pieceDragging || !_DRAGGING_BOS){
							break block;
						}
						
						_POS_Y=e.pageY;
						_POS_X=e.pageX;
					}
				});
				
				doc.off("mouseup.icuirelease").on("mouseup.icuirelease", function(e){
					var temp, board, current_bos, old_drg;
					
					old_drg=_DRAGGING_BOS;
					_cancelDragging();
					
					block:
					{
						if(!_CFG.boardInteractions){
							break block;
						}
						
						if(!old_drg){
							break block;
						}
						
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[mouseup]: board not found");
							break block;
						}
						
						temp=_getHoverElement(e.pageX, e.pageY);
						
						if(!temp){
							break block;
						}
						
						current_bos=temp.attr("data-bos");
						
						if(!current_bos){
							Ic.utilityMisc.consoleLog("Error[mouseup]: missing data-bos");
							break block;
						}
						
						if(old_drg!==current_bos){
							_playMoveCaller.apply(board, [[old_drg, current_bos], true]);
						}
					}
				});
				
				doc.off("mousedown.icuipress").on("mousedown.icuipress", function(e){
					var i, len, temp, legal_moves, board, square, current_bos, old_sel;
					
					old_sel=_SELECTED_BOS;
					_cancelSelected();
					_cancelDragging();
					
					block:
					{
						if(!_CFG.boardInteractions){
							break block;
						}
						
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[mousedown]: board not found");
							break block;
						}
						
						temp=_getHoverElement(e.pageX, e.pageY);
						
						if(!temp){
							break block;
						}
						
						current_bos=temp.attr("data-bos");
						
						if(!current_bos){
							Ic.utilityMisc.consoleLog("Error[mousedown]: missing data-bos");
							break block;
						}
						
						square=board.getSquare(current_bos);
						
						if(square===null){
							Ic.utilityMisc.consoleLog("Error[mousedown]: square not found");
							break block;
						}
						
						if(!old_sel || (old_sel!==current_bos && !_playMoveCaller.apply(board, [[old_sel, current_bos], false]))){
							if(square.className){
								_SELECTED_BOS=current_bos;
								
								if(_CFG.pieceDragging){
									_dragPiece(e.pageX, e.pageY, current_bos);
								}
								
								if(_CFG.highlightSelected){
									$("#ic_ui_"+current_bos).addClass("ic_selected");
								}
								
								if(_CFG.highlightLegalMoves){
									legal_moves=board.legalMoves(current_bos);
									
									for(i=0, len=legal_moves.length; i<len; i++){//0<len
										square=board.getSquare(legal_moves[i]);
										
										temp="ic_highlight";
										
										if(!square.isEmptySquare && square.sign===board[board.nonActiveColor].sign){
											temp+=" ic_capture";
										}
										
										$("#ic_ui_"+square.bos).addClass(temp);
									}
								}
							}
						}
					}
				});
				
				doc.off("wheel.icuiscroll").on("wheel.icuiscroll", function(e){
					var temp, board, is_reversed;
					
					block:
					{
						if(!_CFG.scrollNavigation || _SCROLLING_WAITING){
							break block;
						}
						
						_SCROLLING_WAITING=true;
						
						setTimeout(function(){
							_SCROLLING_WAITING=false;
						}, _CFG.scrollingTime);
						
						temp=0;
						
						if(e && e.originalEvent && e.originalEvent.deltaY){
							temp=e.originalEvent.deltaY;
						}
						
						if(!temp){//horizontal scrolling or bad event
							break block;
						}
						
						is_reversed=(temp<0);
						
						if(!$(e.target).closest("#ic_ui_board").length){//not a child
							break block;
						}
						
						board=Ic.getBoard(_BOARD_NAME);
						
						if(board===null){
							Ic.utilityMisc.consoleLog("Error[wheel]: board not found");
							break block;
						}
						
						if(is_reversed){
							board.navPrevious();
						}else{
							board.navNext();
						}
					}
				});
			}
		}
		
		function _refreshActiveDot(active_is_black){
			$("#ic_ui_board .ic_w_color, #ic_ui_board .ic_b_color").removeClass("ic_w_color ic_b_color");
			$("#ic_ui_board "+(active_is_black ? ".ic_bside" : ".ic_wside")).addClass(active_is_black ? "ic_b_color" : "ic_w_color");
		}
		
		function _refreshBoardTabs(board_name){
			var i, len, current_board, current_board_name, board_list, new_html;
			
			if($("#ic_ui_board_tabs").length){
				board_list=Ic.getBoardNames();
				new_html="<strong>Boards:</strong> ";
				
				for(i=0, len=board_list.length; i<len; i++){//0<len
					new_html+=(i ? " | " : "");
					current_board_name=board_list[i];
					
					current_board=Ic.getBoard(current_board_name);
					
					if(current_board===null){
						Ic.utilityMisc.consoleLog("Warning[_refreshBoardTabs]: board not found");
						
						continue;
					}
					
					if(current_board.isHidden){
						new_html+=("<em class='ic_disabled'>"+current_board_name+"</em>");
					}else if(current_board_name===board_name){
						new_html+=("<em>"+current_board_name+"</em>");
					}else{
						new_html+=("<a href='#' class='ic_changeboard' data-rebindboardname='"+current_board_name+"'>"+current_board_name+"</a>");
					}
				}
				
				$("#ic_ui_board_tabs").html(new_html);
			}
		}
		
		function _refreshTable(is_rotated, is_labeled, is_interactive){
			var i, j, temp, rank_bos, current_bos, new_class, new_html;
			
			temp=[];
			
			if(is_rotated){
				temp.push("ic_rotated");
			}
			
			if(!is_labeled){
				temp.push("ic_unlabeled");
			}
			
			if(!is_interactive){
				temp.push("ic_frozen");
			}
			
			temp.push("ic_"+_chessFontHelper(_CFG.chessFont));
			
			new_class=temp.join(" ");
			
			new_html="<table cellpadding='0' cellspacing='0'>";
			
			if(is_labeled){
				new_html+=("<tr><td class='ic_label'></td><td class='ic_label'><div class='ic_char'><span>"+(is_rotated ? "HGFEDCBA" : "ABCDEFGH").split("").join("</span></div></td><td class='ic_label'><div class='ic_char'><span>")+"</span></div></td><td class='"+("ic_label ic_dot "+(is_rotated ? "ic_wside" : "ic_bside"))+"'><div class='ic_char'><span>◘</span></div></td></tr>");
			}
			
			for(i=0; i<8; i++){//0...7
				rank_bos=(is_rotated ? (i+1) : (8-i));
				
				new_html+="<tr>";
				
				if(is_labeled){
					new_html+=("<td class='ic_label'><div class='ic_char'><span>"+rank_bos+"</span></div></td>");
				}
				
				for(j=0; j<8; j++){//0...7
					current_bos=Ic.toBos(is_rotated ? [(7-i), (7-j)] : [i, j]);
					
					new_html+=("<td id='"+("ic_ui_"+current_bos)+"' class='"+((i+j)%2 ? "ic_bs" : "ic_ws")+"' data-bos='"+current_bos+"'><div class='ic_piece_holder'></div></td>");
				}
				
				if(is_labeled){
					new_html+=("<td class='ic_label'><div class='ic_char'><span>"+rank_bos+"</span></div></td>");
				}
				
				new_html+="</tr>";
			}
			
			if(is_labeled){
				new_html+=("<tr><td class='ic_label'></td><td class='ic_label'><div class='ic_char'><span>"+(is_rotated ? "HGFEDCBA" : "ABCDEFGH").split("").join("</span></div></td><td class='ic_label'><div class='ic_char'><span>")+"</span></div></td><td class='"+("ic_label ic_dot "+(is_rotated ? "ic_bside" : "ic_wside"))+"'><div class='ic_char'><span>◘</span></div></td></tr>");
			}
			
			new_html+="</table>";
			
			if(_CFG.soundEffects){
				new_html+="<audio id='ic_ui_sound_move' src='./sounds/move.wav' preload='auto' style='display:none;'></audio>";
				new_html+="<audio id='ic_ui_sound_capture' src='./sounds/capture.wav' preload='auto' style='display:none;'></audio>";
			}
			
			$("#ic_ui_board").attr("class", new_class).html(new_html);
		}
		
		//---------------- utilities (this=apply)
		
		function _playMoveCaller(mov, is_inanimated){
			var that, temp, puzzle_advance, rtn;
			
			that=this;
			
			rtn=false;
			
			if(that.isLegalMove(mov)){
				if(_CFG.puzzleMode){
					puzzle_advance=false;
					
					if((that.currentMove+1)<that.moveList.length){
						temp=that.playMove(mov, {isMockMove: true, isLegalMove: true});
						temp=(temp ? temp.san : "");
						
						if(temp===that.moveList[that.currentMove+1].san){
							puzzle_advance=true;
						}
					}
					
					if(puzzle_advance){
						that.setCurrentMove(2, false);
						
						if((that.currentMove+1)===that.moveList.length){
							Ic.utilityMisc.consoleLog("Puzzle: finished");
						}
						
						rtn=true;
					}else{
						_cancelSelected();
						
						Ic.utilityMisc.consoleLog("Puzzle: wrong move");
					}
				}else{
					rtn=!!that.playMove(mov, {isInanimated: !!is_inanimated, playSounds: true, isLegalMove: true});
				}
			}
			
			return rtn;
		}
		
		function _animateCaller(is_reversed){
			var that, temp, from_bos, to_bos, piece_class, promotion_class;
			
			that=this;
			
			if((that.currentMove!==0 || is_reversed) && (that.currentMove!==(that.moveList.length-1) || !is_reversed)){
				temp=that.moveList[that.currentMove+is_reversed];
				
				from_bos=temp.fromBos;
				to_bos=temp.toBos;
				
				piece_class=Ic.toClassName(Ic.toAbsVal(temp.piece)*Ic.getSign(temp.colorMoved==="b"));
				piece_class=(piece_class ? (" ic_"+piece_class) : "");
				
				if(is_reversed){
					_animatePiece(to_bos, from_bos, piece_class);
				}else{
					promotion_class=Ic.toClassName(Ic.toAbsVal(temp.promotion)*Ic.getSign(temp.colorMoved==="b"));
					promotion_class=(promotion_class ? (" ic_"+promotion_class) : "");
					
					_animatePiece(from_bos, to_bos, piece_class, promotion_class);
				}
				
				if(temp.san.slice(0, 2)==="O-"){
					from_bos=Ic.toBos([Ic.getRankPos(temp.toBos), (temp.san==="O-O-O" ? 0 : 7)]);
					to_bos=Ic.toBos([Ic.getRankPos(temp.toBos), (temp.san==="O-O-O" ? 3 : 5)]);
					
					piece_class=Ic.toClassName(Ic.toAbsVal("r")*Ic.getSign(temp.colorMoved==="b"));
					piece_class=(piece_class ? (" ic_"+piece_class) : "");
					
					if(is_reversed){
						_animatePiece(to_bos, from_bos, piece_class);
					}else{
						_animatePiece(from_bos, to_bos, piece_class);
					}
				}
			}
		}
		
		function _refreshPieceClasses(){
			var i, j, that, reset_class, current_square, square_class;
			
			that=this;
			
			for(i=0; i<8; i++){//0...7
				for(j=0; j<8; j++){//0...7
					reset_class=((i+j)%2 ? "ic_bs" : "ic_ws");
					current_square=that.getSquare(that.isRotated ? [(7-i), (7-j)] : [i, j]);
					
					square_class=current_square.className;
					square_class=(square_class ? (" ic_"+square_class) : "");
					
					$("#ic_ui_"+current_square.bos).attr("class", reset_class).html("<div class='"+("ic_piece_holder"+square_class)+"'></div>");
				}
			}
			
			if(_CFG.highlightChecks && that.isCheck){
				$("#ic_ui_"+that[that.activeColor].kingBos).addClass("ic_incheck");
			}
		}
		
		function _refreshMaterialDifference(){
			var i, j, len, that, temp, current_side, img_obj, matdiff_html;
			
			that=this;
			
			if($("#ic_ui_material_diff").length){
				matdiff_html="";
				
				img_obj={
					chessFont: _chessFontHelper(_CFG.chessFont),
					width: 20,
					height: 20
				};
				
				for(i=0; i<2; i++){//0...1
					current_side=(that.isRotated===!i ? that.w : that.b);
					matdiff_html+=(i ? "<hr>" : "");
					
					temp="";
					
					for(j=0, len=current_side.materialDiff.length; j<len; j++){//0<len
						temp+=("<img src='"+("./css/images/chess-fonts/"+img_obj.chessFont+"/"+Ic.toClassName(current_side.materialDiff[j])+".png")+"' width='"+img_obj.width+"' height='"+img_obj.height+"'>");
					}
					
					matdiff_html+=(temp || "-");
				}
				
				$("#ic_ui_material_diff").html(matdiff_html);
			}
		}
		
		function _refreshMoveList(){
			var i, len, that, result_tag_ow, move_list, black_starts, initial_full_move, new_html;
			
			that=this;
			
			if($("#ic_ui_move_list").length){
				move_list=that.moveList;
				
				black_starts=(move_list[0].colorToPlay==="b");
				
				initial_full_move=(that.fullMove-Math.floor((that.currentMove+black_starts-1)/2)+(black_starts===!(that.currentMove%2))-1);
				
				result_tag_ow="*";
				
				new_html="";
				
				for(i=0, len=move_list.length; i<len; i++){//0<len
					if(i){
						if(_CFG.puzzleMode && i>that.currentMove){
							continue;
						}
						
						new_html+=(i!==1 ? " " : "");
						
						new_html+=(black_starts===!(i%2) ? ("<span class='ic_pgn_number'>"+(initial_full_move+Math.floor((i+black_starts-1)/2))+". </span>") : "");
						
						new_html+=("<span class='"+(i!==that.currentMove ? "ic_pgn_link" : "ic_pgn_active")+"' data-index='"+i+"'>"+move_list[i].san+"</span>");
						
						if(move_list[i].comment){
							new_html+=("<span class='"+(i!==that.currentMove ? "ic_pgn_comment" : "ic_pgn_comment_active")+"'> "+move_list[i].comment+"</span>");
						}
					}
					
					if(move_list[i].moveResult){
						result_tag_ow=move_list[i].moveResult;
					}
				}
				
				if(that.manualResult!=="*"){
					result_tag_ow=that.manualResult;
				}
				
				if(new_html){
					if(black_starts){
						new_html=("<span class='ic_pgn_number'>"+initial_full_move+"...</span>"+new_html);
					}
					
					if(result_tag_ow!=="*"){
						new_html+=(" <span class='ic_pgn_result'>"+result_tag_ow+"</span>");
					}
				}else{
					if(result_tag_ow!=="*"){
						new_html+=("<span class='ic_pgn_result'>"+result_tag_ow+"</span>");
					}
				}
				
				if(_CFG.puzzleMode){
					if((that.currentMove+1)===that.moveList.length){
						new_html+="<br><span class='ic_pgn_complete'>Puzzle complete!</span>";
					}else{
						new_html+=" *<br><span class='ic_pgn_find'>Find the best move.</span>";
					}
				}
				
				new_html=(new_html || "-");
				
				$("#ic_ui_move_list").html(new_html);
			}
		}
		
		function _refreshDebug(){
			var i, j, len, len2, that, temp, temp2, current_square, current_row, new_html;
			
			that=this;
			
			if($("#ic_ui_debug").length){
				new_html="<ul>";
				new_html+=("<li><strong>Selected board:</strong> <span>"+that.boardName+"</span></li>");
				new_html+=("<li><strong>Is rotated?:</strong> <span>"+that.isRotated+"</span></li>");
				new_html+=("<li><strong>Number of checks:</strong> <span>"+that.checks+"</span></li>");
				new_html+=("<li><strong>Is check?:</strong> <span>"+that.isCheck+"</span></li>");
				new_html+=("<li><strong>Is checkmate?:</strong> <span>"+that.isCheckmate+"</span></li>");
				new_html+=("<li><strong>Is stalemate?:</strong> <span>"+that.isStalemate+"</span></li>");
				new_html+=("<li><strong>Is threefold repetition?:</strong> <span>"+that.isThreefold+"</span></li>");
				new_html+=("<li><strong>Is insufficient material?:</strong> <span>"+that.isInsufficientMaterial+"</span></li>");
				new_html+=("<li><strong>Is fifty-move rule?:</strong> <span>"+that.isFiftyMove+"</span></li>");
				new_html+=("<li><strong>In draw?:</strong> <span>"+that.inDraw+"</span></li>");
				new_html+=("<li><strong>En Passant square:</strong> <span>"+(that.enPassantBos || "-")+"</span></li>");
				new_html+=("<li><strong>Active color:</strong> <span>"+that.activeColor+"</span></li>");
				new_html+=("<li><strong>Non active color:</strong> <span>"+that.nonActiveColor+"</span></li>");
				
				new_html+="<li>";
				new_html+="<strong>W</strong>";
				new_html+="<ul>";
				new_html+=("<li><strong>king square:</strong> <span>"+that.w.kingBos+"</span></li>");
				new_html+=("<li><strong>castling rights:</strong> <span>"+(Ic.utilityMisc.castlingChars(that.w.castling).toUpperCase() || "-")+"</span></li>");
				new_html+=("<li><strong>material difference:</strong> <span>["+that.w.materialDiff.join(", ")+"]</span></li>");
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+="<li>";
				new_html+="<strong>B</strong>";
				new_html+="<ul>";
				new_html+=("<li><strong>king square:</strong> <span>"+that.b.kingBos+"</span></li>");
				new_html+=("<li><strong>castling rights:</strong> <span>"+(Ic.utilityMisc.castlingChars(that.b.castling) || "-")+"</span></li>");
				new_html+=("<li><strong>material difference:</strong> <span>["+that.b.materialDiff.join(", ")+"]</span></li>");
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+=("<li><strong>Half moves:</strong> <span>"+that.halfMove+"</span></li>");
				new_html+=("<li><strong>Full moves:</strong> <span>"+that.fullMove+"</span></li>");
				new_html+=("<li><strong>Current move:</strong> <span>"+that.currentMove+"</span></li>");
				new_html+=("<li><strong>Promote to:</strong> <span>"+Ic.toBal(that.promoteTo*that[that.activeColor].sign)+"</span></li>");
				new_html+=("<li><strong>Manual result:</strong> <span>"+that.manualResult+"</span></li>");
				
				new_html+="<li>";
				new_html+="<strong>Squares</strong>";
				new_html+="<ul>";
				
				for(i=0; i<8; i++){//0...7
					current_row=[];
					
					for(j=0; j<8; j++){//0...7
						current_square=that.getSquare([i, j]);
						
						temp=(""+current_square.val);
						
						if(temp.length===1){
							temp=(" "+temp);
						}
						
						current_row.push("<span title='"+(current_square.bos.toUpperCase()+" = "+(current_square.className || "empty"))+"'>"+temp+"</span>");
					}
					
					new_html+=("<li><strong>A"+(8-i)+"-H"+(8-i)+":</strong> "+current_row.join(" | ")+"</li>");
				}
				
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+=("<li><strong>FEN:</strong> <span>"+that.fen+"</span></li>");
				
				temp="";
				
				for(i=0, len=that.legalUci.length; i<len; i++){//0<len
					temp+=((i ? ", " : "")+((!i || i%5) ? "" : "<br>")+that.legalUci[i]);
				}
				
				new_html+=("<li><strong>Legal UCI:</strong> <span>["+temp+"]</span></li>");
				
				new_html+="<li>";
				new_html+="<strong>Legal UCI tree</strong>";
				new_html+="<ul>";
				
				temp=Object.keys(that.legalUciTree);
				
				for(i=0, len=temp.length; i<len; i++){//0<len
					new_html+=("<li><strong>"+temp[i]+":</strong> ["+that.legalUciTree[temp[i]].join(", ")+"]</li>");
				}
				
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+="<li>";
				new_html+="<strong>Legal reversed tree</strong>";
				new_html+="<ul>";
				
				temp=Object.keys(that.legalRevTree);
				
				for(i=0, len=temp.length; i<len; i++){//0<len
					new_html+=("<li><strong>"+temp[i]+":</strong>");
					new_html+=" {";
					
					temp2=Object.keys(that.legalRevTree[temp[i]]);
					
					for(j=0, len2=temp2.length; j<len2; j++){//0<len2
						new_html+=((j ? ", " : "")+"<strong>"+temp2[j]+":</strong> ["+that.legalRevTree[temp[i]][temp2[j]].join(", ")+"]");
					}
					
					new_html+="}</li>";
				}
				
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+=("<li><strong>Version:</strong> <span>[Ic_v"+Ic.version+"] [IcUi_v"+_VERSION+"]</span></li>");
				new_html+="</ul>";
				
				$("#ic_ui_debug").html(new_html);
			}
		}
		
		//---------------- ic ui
		
		function setCfg(key, val){
			var board;
			
			_CFG[""+key]=val;
			
			board=Ic.getBoard(_BOARD_NAME);
			
			if(board!==null){
				refreshUi.apply(board, [0, false]);
			}
		}
		
		function refreshUi(animation_type, play_sounds){
			var that, temp, board_elm;
			
			that=this;
			
			if(!that.isHidden){
				_BOARD_NAME=that.boardName;
				
				_cancelSelected();
				_cancelDragging();
				_cancelAnimations();
				
				_bindOnce();
				
				board_elm=$("#ic_ui_board");
				
				if(board_elm.length){
					if(!board_elm.html() || board_elm.hasClass("ic_rotated")!==that.isRotated || board_elm.hasClass("ic_unlabeled")===_CFG.boardLabels || board_elm.hasClass("ic_frozen")===_CFG.boardInteractions || !board_elm.hasClass("ic_"+_chessFontHelper(_CFG.chessFont)) || (!!$("#ic_ui_sound_move").length || !!$("#ic_ui_sound_capture").length)!==_CFG.soundEffects){
						_refreshTable(that.isRotated, _CFG.boardLabels, _CFG.boardInteractions);
					}
				}
				
				$("#ic_ui_fen").val(that.fen);
				
				$("#ic_ui_promote").val(that.promoteTo);
				
				_refreshDebug.apply(that, []);
				
				_refreshBoardTabs(that.boardName);
				
				_refreshMaterialDifference.apply(that, []);
				
				_refreshMoveList.apply(that, []);
				
				$("#ic_ui_nav_first.ic_disabled, #ic_ui_nav_previous.ic_disabled, #ic_ui_nav_next.ic_disabled, #ic_ui_nav_last.ic_disabled").removeClass("ic_disabled");
				
				if(!that.currentMove){
					$("#ic_ui_nav_first, #ic_ui_nav_previous").addClass("ic_disabled");
				}
				
				if(that.currentMove===(that.moveList.length-1)){
					$("#ic_ui_nav_next, #ic_ui_nav_last").addClass("ic_disabled");
				}
				
				if(board_elm.length){
					_refreshPieceClasses.apply(that, []);
					
					_refreshActiveDot(that[that.activeColor].isBlack);
					
					if(_CFG.pieceAnimations && animation_type){
						_animateCaller.apply(that, [animation_type<0]);
					}
					
					if(_CFG.soundEffects && play_sounds){
						temp=(that.moveList[that.currentMove].captured ? "capture" : "move");
						temp=$("#ic_ui_sound_"+temp)[0];
						
						if(temp){
							temp.pause();
							temp.currentTime=0;
							temp.play();
						}
					}
					
					if(_CFG.highlightLastMove && that.currentMove!==0){
						$("#ic_ui_"+that.moveList[that.currentMove].fromBos).addClass("ic_lastmove");
						$("#ic_ui_"+that.moveList[that.currentMove].toBos).addClass("ic_lastmove");
					}
				}
			}
		}
		
		return (($!==null && Ic!==null) ? {
			version: _VERSION,
			setCfg: setCfg,
			refreshUi: refreshUi
		} : null);
	})();
	
	if(windw!==null){
		if(!windw.IcUi){
			windw.IcUi=IcUi;
		}
	}
})(((typeof window)!=="undefined" ? window : null), ((typeof jQuery)!=="undefined" ? jQuery : null), ((typeof Ic)!=="undefined" ? Ic : null));
