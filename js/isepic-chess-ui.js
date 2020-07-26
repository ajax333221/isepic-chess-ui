/** Copyright (c) 2020 Ajax Isepic (ajax333221) Licensed MIT */

/*jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, latedef:nofunc, bitwise:false, sub:true, eqeqeq:true, esversion:6 */

(function(win, $, Ic){
	var IcUi=(function(){
		var _VERSION="1.1.0";
		
		function refreshBoard(animate_move){
			var that, temp, is_reversed, from_bos, to_bos, initial_val, final_val, piece_class, promotion_class, is_new_html;
			
			that=this;
			
			function _animatePiece(from_bos, to_bos, piece_class, promotion_class){
				var temp, piece_elm, from_square, to_square, old_offset, new_offset;
				
				from_square=$("#ic_id_"+from_bos);
				to_square=$("#ic_id_"+to_bos);
				
				old_offset=from_square.children(".ic_piece_holder").offset();
				new_offset=to_square.children(".ic_piece_holder").offset();
				
				to_square.html("<div class='"+("ic_piece_holder"+piece_class)+"'></div>");
				piece_elm=to_square.children(".ic_piece_holder");
				
				temp=piece_elm.clone().appendTo("#ic_id_board");
				
				piece_elm.hide().attr("class", ("ic_piece_holder"+(promotion_class || piece_class)));
				
				temp.css({
					"position" : "absolute",
					"left" : old_offset.left,
					"top" : old_offset.top,
					"zIndex" : 1000
				}).animate({
					"top" : new_offset.top,
					"left" : new_offset.left
				}, {
					duration : 300,
					always : function(){
						piece_elm.show();
						temp.remove();
					}
				});
			}
			
			function _getObjInfoHTML(){
				var i, j, temp, current_square, current_row, rtn;
				
				rtn="<li><strong>Selected board:</strong> <span>"+that.BoardName+"</span></li>";
				rtn+="<li><strong>Is rotated?:</strong> <span>"+that.IsRotated+"</span></li>";
				rtn+="<li><strong>Is check?:</strong> <span>"+that.IsCheck+"</span></li>";
				rtn+="<li><strong>Is checkmate?:</strong> <span>"+that.IsCheckmate+"</span></li>";
				rtn+="<li><strong>Is stalemate?:</strong> <span>"+that.IsStalemate+"</span></li>";
				rtn+="<li><strong>Is threefold repetition?:</strong> <span>"+that.IsThreefold+"</span></li>";
				rtn+="<li><strong>Is fifty-move rule?:</strong> <span>"+that.IsFiftyMove+"</span></li>";
				rtn+="<li><strong>En Passant square:</strong> <span>"+(that.EnPassantBos || "-")+"</span></li>";
				
				rtn+="<li>";
				rtn+="<strong>Active</strong>";
				rtn+="<ul>";
				rtn+="<li><strong>isBlack?:</strong> <span>"+that.Active.isBlack+"</span></li>";
				rtn+="<li><strong>sign:</strong> <span>("+(that.Active.sign>0 ? "+" : "-")+")</span></li>";
				rtn+="<li><strong>king square:</strong> <span>"+that.Active.kingBos+"</span></li>";
				rtn+="<li><strong>checks:</strong> <span>"+that.Active.checks+"</span></li>";
				rtn+="</ul>";
				rtn+="</li>";
				
				rtn+="<li>";
				rtn+="<strong>Non Active</strong>";
				rtn+="<ul>";
				rtn+="<li><strong>isBlack?:</strong> <span>"+that.NonActive.isBlack+"</span></li>";
				rtn+="<li><strong>sign:</strong> <span>("+(that.NonActive.sign>0 ? "+" : "-")+")</span></li>";
				rtn+="<li><strong>king square:</strong> <span>"+that.NonActive.kingBos+"</span></li>";
				rtn+="<li><strong>checks:</strong> <span>"+that.NonActive.checks+"</span></li>";
				rtn+="</ul>";
				rtn+="</li>";
				
				rtn+="<li><strong>White castling:</strong> <span>"+(Ic.utilityMisc.castlingChars(that.WCastling).toUpperCase() || "-")+"</span></li>";
				rtn+="<li><strong>Black castling:</strong> <span>"+(Ic.utilityMisc.castlingChars(that.BCastling) || "-")+"</span></li>";
				rtn+="<li><strong>Half moves:</strong> <span>"+that.HalfMove+"</span></li>";
				rtn+="<li><strong>Full moves:</strong> <span>"+that.FullMove+"</span></li>";
				rtn+="<li><strong>Current move:</strong> <span>"+that.CurrentMove+"</span></li>";
				rtn+="<li><strong>Initial full move:</strong> <span>"+that.InitialFullMove+"</span></li>";
				rtn+="<li><strong>Promote to:</strong> <span>"+Ic.toBal(that.PromoteTo*Ic.getSign(that.Active.isBlack))+"</span></li>";
				rtn+="<li><strong>Selected square:</strong> <span>"+(that.SelectedBos || "-")+"</span></li>";
				rtn+="<li><strong>Material difference:</strong> <span>{w:["+that.MaterialDiff.w.join(", ")+"], b:["+that.MaterialDiff.b.join(", ")+"]}</span></li>";
				
				rtn+="<li>";
				rtn+="<strong>Squares</strong>";
				rtn+="<ul>";
				
				for(i=0; i<8; i++){//0...7
					current_row=[];
					
					for(j=0; j<8; j++){//0...7
						current_square=that.getSquare([i, j]);
						
						temp=""+current_square.val;
						
						if(temp.length===1){
							temp=" "+temp;
						}
						
						current_row.push("<span title='"+(current_square.bos.toUpperCase()+" = "+(current_square.className || "empty"))+"'>"+temp+"</span>");
					}
					
					rtn+="<li><strong>A"+(8-i)+"-H"+(8-i)+":</strong> "+current_row.join(" | ")+"</li>";
				}
				
				rtn+="</ul>";
				rtn+="</li>";
				
				rtn+="<li><strong>FEN:</strong> <span>"+that.Fen+"</span></li>";
				
				return rtn;
			}
			
			if(!that.IsHidden){
				is_new_html=!$("#ic_id_main").length;
				
				if(is_new_html){
					$("body").append("<div id='ic_id_main'><h3 class='ic_inlineb'>GitHub: <a href='https://github.com/ajax333221/isepic-chess'>isepic-chess</a> | <a href='https://github.com/ajax333221/isepic-chess-ui'>isepic-chess-ui</a></h3><div id='ic_id_board'></div><div id='ic_id_controls'><input id='ic_id_fen' value='' type='text'><br><input id='ic_id_nav_first' value='|<' type='button'> <input id='ic_id_nav_previous' value='<' type='button'> <input id='ic_id_nav_next' value='>' type='button'> <input id='ic_id_nav_last' value='>|' type='button'><input id='ic_id_rotate' value='rotate' type='button'><select id='ic_id_promote'><option value='5' selected='selected'>queen</option><option value='4'>rook</option><option value='3'>bishop</option><option value='2'>knight</option></select><hr><p id='ic_id_tabs'></p><p id='ic_id_movelist'></p></div><div id='ic_id_infoholder'><a id='ic_id_debug_toggle' href='#'>Debug ▲</a><ul id='ic_id_objinfo' style='display:none'></ul></div></div>");
					
					$("#ic_id_fen").click(function(){
						$(this).select();
					});
					
					$("#ic_id_debug_toggle").click(function(){
						$(this).text("Debug "+($("#ic_id_objinfo").is(":visible") ? "▲" : "▼"));
						$("#ic_id_objinfo").toggle();
						return false;
					});
				}
				
				if(is_new_html || $("#ic_id_board .ic_tableb").hasClass("ic_rotated")!==that.IsRotated){
					$("#ic_id_board").html((function(is_rotated){
						var i, j, rank_bos, current_bos, rtn;
						
						rtn="<table class='"+("ic_tableb"+(is_rotated ? " ic_rotated" : ""))+"' cellpadding='0' cellspacing='0'>";
						rtn+="<tr><td class='ic_label ic_top_border ic_left_border'></td><td class='ic_label ic_top_border'>"+(is_rotated ? "hgfedcba" : "abcdefgh").split("").join("</td><td class='ic_label ic_top_border'>")+"</td><td class='"+("ic_label ic_top_border ic_right_border ic_dot "+(is_rotated ? "ic_wside" : "ic_bside"))+"'>◘</td><td class='ic_captureds' rowspan='10'></td></tr>";
						
						for(i=0; i<8; i++){//0...7
							rank_bos=(is_rotated ? (i+1) : (8-i));
							rtn+="<tr><td class='ic_label ic_left_border'>"+rank_bos+"</td>";
							
							for(j=0; j<8; j++){//0...7
								current_bos=Ic.toBos(is_rotated ? [(7-i), (7-j)] : [i, j]);
								rtn+="<td id='"+("ic_id_"+current_bos)+"' class='"+((i+j)%2 ? "ic_bs" : "ic_ws")+"' data-bos='"+current_bos+"'><div class='ic_piece_holder'></div></td>";
							}
							
							rtn+="<td class='ic_label ic_right_border'>"+rank_bos+"</td></tr>";
						}
						
						rtn+="<tr><td class='ic_label ic_bottom_border ic_left_border'></td><td class='ic_label ic_bottom_border'>"+(is_rotated ? "hgfedcba" : "abcdefgh").split("").join("</td><td class='ic_label ic_bottom_border'>")+"</td><td class='"+("ic_label ic_right_border ic_bottom_border ic_dot "+(is_rotated ? "ic_bside" : "ic_wside"))+"'>◘</td></tr>";
						rtn+="</table>";
						
						return rtn;
					})(that.IsRotated));
				}
				
				$(".ic_ws, .ic_bs").unbind("click").click(function(){
					var i, len, current_bos, need_highlight, legal_moves;
					
					need_highlight=true;
					current_bos=$(this).attr("data-bos");
					
					if(that.SelectedBos){
						$(".ic_highlight").removeClass("ic_highlight");
						$(".ic_currpiece").removeClass("ic_currpiece");
						
						if(Ic.sameSquare(that.SelectedBos, current_bos)){
							that.SelectedBos="";
							$("#ic_id_objinfo").html(_getObjInfoHTML());
							need_highlight=false;
						}else{
							if(that.moveCaller(that.SelectedBos, current_bos)){
								refreshBoard.apply(that, [1]);
								need_highlight=false;
							}else{
								that.SelectedBos="";
								need_highlight=true;
							}
						}
					}
					
					if(need_highlight){
						legal_moves=that.legalMoves(current_bos);
						len=legal_moves.length;
						
						if(len){
							that.SelectedBos=current_bos;
							$(this).addClass("ic_currpiece");
							
							for(i=0; i<len; i++){//0<len
								$("#ic_id_"+Ic.toBos(legal_moves[i])).addClass("ic_highlight");
							}
						}
						
						$("#ic_id_objinfo").html(_getObjInfoHTML());
					}
				});
				
				$(".ic_piece_holder").finish();
				
				$("#ic_id_tabs").html((function(){
					var i, len, current_board, board_list, rtn;
					
					board_list=Ic.getBoardNames();
					rtn="<strong>Board list:</strong> ";
					
					for(i=0, len=board_list.length; i<len; i++){//0<len
						rtn+=(i ? " | " : "");
						current_board=Ic.selectBoard(board_list[i]);
						
						if(Ic.boardExists(current_board)){
							if(current_board.IsHidden){
								rtn+="<em class='ic_disabled'>"+current_board.BoardName+"</em>";
							}else if(current_board.BoardName===that.BoardName){
								rtn+="<em>"+current_board.BoardName+"</em>";
							}else{
								rtn+="<a class='ic_changeboard' data-boardname='"+current_board.BoardName+"' href='#'>"+current_board.BoardName+"</a>";
							}
						}else{
							Ic.utilityMisc.consoleLog("Warning[_getBoardTabsHTML]: \""+current_board.BoardName+"\" is not defined");
						}
					}
					
					return rtn;
				})());
				
				$(".ic_changeboard").unbind("click").click(function(){
					var board, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board=Ic.selectBoard($(this).attr("data-boardname"));
						
						if(!Ic.boardExists(board)){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[.ic_changeboard]: \""+board.BoardName+"\" is not defined");
						}
					//}
					
					if(no_errors){
						refreshBoard.apply(board, [0]);
					}
					
					return false;
				});
				
				$("#ic_id_nav_first").unbind("click").click(function(){
					var is_goto;
					
					is_goto=(that.CurrentMove!==1);
					
					if(that.setCurrentMove((is_goto ? 0 : -1), is_goto)){
						refreshBoard.apply(that, [is_goto ? 0 : -1]);
					}
				});
				
				$("#ic_id_nav_previous").unbind("click").click(function(){
					if(that.setCurrentMove(-1, false)){
						refreshBoard.apply(that, [-1]);
					}
				});
				
				$("#ic_id_nav_next").unbind("click").click(function(){
					if(that.setCurrentMove(1, false)){
						refreshBoard.apply(that, [1]);
					}
				});
				
				$("#ic_id_nav_last").unbind("click").click(function(){
					var is_goto;
					
					is_goto=(that.CurrentMove!==(that.MoveList.length-2));
					
					if(that.setCurrentMove((is_goto ? 10000 : 1), is_goto)){
						refreshBoard.apply(that, [is_goto ? 0 : 1]);
					}
				});
				
				$("#ic_id_rotate").unbind("click").click(function(){
					that.toggleIsRotated();
					refreshBoard.apply(that, [0]);
				});
				
				$("#ic_id_promote").unbind("change").change(function(){
					that.setPromoteTo($(this).val());
					$("#ic_id_objinfo").html(_getObjInfoHTML());
				});
				
				(function(){//reset piece classes
					var i, j, len, current_square, current_diff, captured_html, new_class, square_class;
					
					for(i=0; i<8; i++){//0...7
						for(j=0; j<8; j++){//0...7
							new_class=((i+j)%2 ? "ic_bs" : "ic_ws");
							current_square=that.getSquare(that.IsRotated ? [(7-i), (7-j)] : [i, j]);
							
							//si prev next exclude, pasar blank square (ni si quiera poner un piece holder)
							square_class=current_square.className;
							square_class=(square_class ? (" ic_"+square_class) : "");
							
							$("#ic_id_"+current_square.bos).attr("class", new_class).html("<div class='"+("ic_piece_holder"+square_class)+"'></div>");
						}
					}
					
					captured_html="";
					
					for(i=0; i<2; i++){//0...1
						current_diff=(that.IsRotated===!i ? that.MaterialDiff.w : that.MaterialDiff.b);
						captured_html+=(i ? "<hr>" : "");
						
						for(j=0, len=current_diff.length; j<len; j++){//0<len
							captured_html+="<img src='"+("./css/images/"+Ic.toClassName(current_diff[j])+".png")+"' width='20' height='20'>";
						}
					}
					
					$("#ic_id_board .ic_captureds").html(captured_html);
				})();
				
				if(animate_move){
					is_reversed=(animate_move===-1);
					
					if((that.CurrentMove!==0 || is_reversed) && (that.CurrentMove!==(that.MoveList.length-1) || !is_reversed)){
						temp=that.MoveList[that.CurrentMove+is_reversed];
						
						initial_val=(is_reversed ? temp.FinalVal : temp.InitialVal);
						final_val=(is_reversed ? temp.InitialVal : temp.FinalVal);
						from_bos=(is_reversed ? temp.ToBos : temp.FromBos);
						to_bos=(is_reversed ? temp.FromBos : temp.ToBos);
						
						piece_class=Ic.toClassName(is_reversed ? final_val : initial_val);
						piece_class=(piece_class ? (" ic_"+piece_class) : "");
						
						promotion_class=Ic.toClassName((initial_val!==final_val && !is_reversed) ? final_val : 0);
						promotion_class=(promotion_class ? (" ic_"+promotion_class) : "");
						
						_animatePiece(from_bos, to_bos, piece_class, promotion_class);
						
						if(temp.KingCastled){
							from_bos=Ic.toBos([Ic.getRankPos(temp.ToBos), (temp.KingCastled===1 ? 7 : 0)]);
							to_bos=Ic.toBos([Ic.getRankPos(temp.ToBos), (temp.KingCastled===1 ? 5 : 3)]);
							
							piece_class=Ic.toClassName(Ic.toAbsVal("r")*Ic.getSign(Ic.getRankPos(temp.ToBos)===0));
							piece_class=(piece_class ? (" ic_"+piece_class) : "");
							
							if(is_reversed){
								_animatePiece(to_bos, from_bos, piece_class);
							}else{
								_animatePiece(from_bos, to_bos, piece_class);
							}
						}
					}
				}
				
				$(".ic_wside, .ic_bside").removeClass("ic_w_color ic_b_color");
				$(that.Active.isBlack ? ".ic_bside" : ".ic_wside").addClass(that.Active.isBlack ? "ic_b_color" : "ic_w_color");
				
				$("#ic_id_movelist").html((function(){
					var i, len, move_list, black_starts, rtn;
					
					move_list=that.MoveList;
					black_starts=Ic.utilityMisc.strContains(move_list[0].Fen, " b ");
					
					rtn="";
					
					for(i=1, len=move_list.length; i<len; i++){//1<len
						rtn+=(i!==1 ? " " : "");
						rtn+=(black_starts===!(i%2) ? ("<span class='ic_pgn_number'>"+(that.InitialFullMove+Math.floor((i+black_starts-1)/2))+".</span>") : "");
						rtn+="<span class='"+(i!==that.CurrentMove ? "ic_pgn_link" : "ic_pgn_current")+"' data-index='"+i+"'>"+move_list[i].PGNmove+"</span>";
						rtn+=(move_list[i].PGNend ? (" <span class='ic_pgn_result'>"+move_list[i].PGNend+"</span>") : "");
					}
					
					if(black_starts && rtn){
						rtn="<span class='ic_pgn_number'>"+that.InitialFullMove+"...</span>"+rtn;
					}
					
					return (rtn || "...");
				})());
				
				$(".ic_pgn_link").unbind("click").click(function(){
					var data_val, diff, is_goto;
					
					data_val=Ic.utilityMisc.toInt($(this).attr("data-index"));
					diff=(data_val-that.CurrentMove);
					is_goto=(Math.abs(diff)!==1);
					
					if(that.setCurrentMove((is_goto ? data_val : diff), is_goto)){
						refreshBoard.apply(that, [is_goto ? 0 : diff]);
					}
				});
				
				$("#ic_id_fen").val(that.Fen);
				$("#ic_id_promote").val(that.PromoteTo);
				
				if(that.CurrentMove!==0){
					$("#ic_id_"+that.MoveList[that.CurrentMove].FromBos).addClass("ic_lastmove");
					$("#ic_id_"+that.MoveList[that.CurrentMove].ToBos).addClass("ic_lastmove");
				}
				
				that.SelectedBos="";
				
				$("#ic_id_objinfo").html(_getObjInfoHTML());
			}
		}
		
		return {
			version : _VERSION,
			refreshBoard : refreshBoard
		};
	})();
	
	if(!win.IcUi){
		win.IcUi=IcUi;
	}
})(window, jQuery, Ic);
