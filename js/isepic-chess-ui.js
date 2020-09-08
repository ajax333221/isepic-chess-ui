/** Copyright (c) 2020 Ajax Isepic (ajax333221) Licensed MIT */

/* jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, latedef:nofunc, bitwise:false, sub:true, eqeqeq:true, esversion:6 */

(function(windw, $, Ic){
	var IcUi=(function(){
		var _VERSION="1.7.4";
		
		var _ANIMATE_DURATION=300;
		var _MATERIAL_DIFF_PX=15;
		
		//---------------- utilities
		
		function _cancelAnimations(){
			$(".ic_piece_holder").finish();
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
				"position" : "absolute",
				"top" : old_offset.top,
				"left" : old_offset.left,
				"height" : old_h,
				"width" : old_w,
				"zIndex" : 1000
			}).animate({
				"top" : new_offset.top,
				"left" : new_offset.left
			}, {
				duration : _ANIMATE_DURATION,
				always : function(){
					piece_elm.show();
					temp.remove();
				}
			});
		}
		
		function _bindOnce(){
			var temp;
			
			temp=$("#ic_ui_fen");
			
			if(temp.length && !temp.attr("data-binded")){
				temp.attr("data-binded", "1");
				
				temp.click(function(){
					$(this).select();
				});
			}
			
			temp=$("#ic_ui_debug_toggle");
			
			if(temp.length && !temp.attr("data-binded")){
				temp.attr("data-binded", "1");
				
				temp.click(function(){
					$(this).text("Debug "+($("#ic_ui_debug").is(":visible") ? "▲" : "▼"));
					$("#ic_ui_debug").toggle();
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
			}
		}
		
		function _reBindBoardLinks(){
			$(".ic_changeboard").unbind("click").click(function(){
				var board, board_name, no_errors;
				
				no_errors=true;
				
				//if(no_errors){
					board_name=$(this).attr("data-boardname");
					board=Ic.selectBoard(board_name);
					
					if(!Ic.boardExists(board)){
						no_errors=false;
						Ic.utilityMisc.consoleLog("Error[.ic_changeboard]: \""+board_name+"\" is not defined");
					}
				//}
				
				if(no_errors){
					refreshBoard.apply(board, [0]);
				}
				
				if($(this).prop("tagName")==="A"){
					return false;
				}
			});
		}
		
		function _refreshActiveDot(active_is_black){
			$(".ic_w_color, .ic_b_color").removeClass("ic_w_color ic_b_color");
			$(active_is_black ? ".ic_bside" : ".ic_wside").addClass(active_is_black ? "ic_b_color" : "ic_w_color");
		}
		
		function _refreshBoardTabs(board_name){
			var i, len, current_board, current_board_name, board_list, new_html;
			
			if($("#ic_ui_tabs").length){
				board_list=Ic.getBoardNames();
				new_html="<strong>Board list:</strong> ";
				
				for(i=0, len=board_list.length; i<len; i++){//0<len
					new_html+=(i ? " | " : "");
					current_board_name=board_list[i];
					current_board=Ic.selectBoard(current_board_name);
					
					if(Ic.boardExists(current_board)){
						if(current_board.isHidden){
							new_html+="<em class='ic_disabled'>"+current_board_name+"</em>";
						}else if(current_board_name===board_name){
							new_html+="<em>"+current_board_name+"</em>";
						}else{
							new_html+="<a class='ic_changeboard' data-boardname='"+current_board_name+"' href='#'>"+current_board_name+"</a>";
						}
					}else{
						Ic.utilityMisc.consoleLog("Warning[_refreshBoardTabs]: \""+current_board_name+"\" is not defined");
					}
				}
				
				$("#ic_ui_tabs").html(new_html);
			}
		}
		
		function _refreshTable(is_rotated, is_unlabeled){
			var i, j, temp, rank_bos, current_bos, new_class, new_html;
			
			if($("#ic_ui_board").length){
				temp=[];
				
				if(is_rotated){
					temp.push("ic_rotated");
				}
				
				if(is_unlabeled){
					temp.push("ic_unlabeled");
				}
				
				new_class=temp.join(" ");
				
				new_html="<table cellpadding='0' cellspacing='0'>";
				
				if(!is_unlabeled){
					new_html+="<tr><td class='ic_label'></td><td class='ic_label'><div class='ic_char'><span>"+(is_rotated ? "HGFEDCBA" : "ABCDEFGH").split("").join("</span></div></td><td class='ic_label'><div class='ic_char'><span>")+"</span></div></td><td class='"+("ic_label ic_dot "+(is_rotated ? "ic_wside" : "ic_bside"))+"'><div class='ic_char'><span>◘</span></div></td></tr>";
				}
				
				for(i=0; i<8; i++){//0...7
					rank_bos=(is_rotated ? (i+1) : (8-i));
					
					new_html+="<tr>";
					
					if(!is_unlabeled){
						new_html+="<td class='ic_label'><div class='ic_char'><span>"+rank_bos+"</span></div></td>";
					}
					
					for(j=0; j<8; j++){//0...7
						current_bos=Ic.toBos(is_rotated ? [(7-i), (7-j)] : [i, j]);
						
						new_html+="<td id='"+("ic_ui_"+current_bos)+"' class='"+((i+j)%2 ? "ic_bs" : "ic_ws")+"' data-bos='"+current_bos+"'><div class='ic_piece_holder'></div></td>";
					}
					
					if(!is_unlabeled){
						new_html+="<td class='ic_label'><div class='ic_char'><span>"+rank_bos+"</span></div></td>";
					}
					
					new_html+="</tr>";
				}
				
				if(!is_unlabeled){
					new_html+="<tr><td class='ic_label'></td><td class='ic_label'><div class='ic_char'><span>"+(is_rotated ? "HGFEDCBA" : "ABCDEFGH").split("").join("</span></div></td><td class='ic_label'><div class='ic_char'><span>")+"</span></div></td><td class='"+("ic_label ic_dot "+(is_rotated ? "ic_bside" : "ic_wside"))+"'><div class='ic_char'><span>◘</span></div></td></tr>";
				}
				
				new_html+="</table>";
				
				$("#ic_ui_board").attr("class", new_class).html(new_html);
			}
		}
		
		//---------------- utilities (this=apply)
		
		function _navHelper(move_index){
			var that, is_goto, diff;
			
			that=this;
			
			move_index=Ic.utilityMisc.toInt(move_index);
			
			diff=(move_index-that.currentMove);
			is_goto=(Math.abs(diff)!==1);
			
			return that.setCurrentMove((is_goto ? move_index : diff), is_goto);
		}
		
		function _animateCaller(is_reversed){
			var that, temp, initial_val, final_val, from_bos, to_bos, piece_class, promotion_class;
			
			that=this;
			
			if((that.currentMove!==0 || is_reversed) && (that.currentMove!==(that.moveList.length-1) || !is_reversed)){
				temp=that.moveList[that.currentMove+is_reversed];
				
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
		
		function _reBindPromotion(){
			var that;
			
			that=this;
			
			$("#ic_ui_promote").unbind("change").change(function(){
				that.setPromoteTo($(this).val());
			});
		}
		
		function _reBindPgnLinks(){
			var that;
			
			that=this;
			
			$(".ic_pgn_link").unbind("click").click(function(){
				navLinkMove.apply(that, [$(this).attr("data-index")]);
			});
		}
		
		function _reBindButtons(){
			var that;
			
			that=this;
			
			$("#ic_ui_nav_first").unbind("click").click(function(){
				navFirst.apply(that, []);
				
				if($(this).prop("tagName")==="A"){
					return false;
				}
			});
			
			$("#ic_ui_nav_previous").unbind("click").click(function(){
				navPrevious.apply(that, []);
				
				if($(this).prop("tagName")==="A"){
					return false;
				}
			});
			
			$("#ic_ui_nav_next").unbind("click").click(function(){
				navNext.apply(that, []);
				
				if($(this).prop("tagName")==="A"){
					return false;
				}
			});
			
			$("#ic_ui_nav_last").unbind("click").click(function(){
				navLast.apply(that, []);
				
				if($(this).prop("tagName")==="A"){
					return false;
				}
			});
			
			$("#ic_ui_rotate").unbind("click").click(function(){
				that.toggleIsRotated();
				
				if($(this).prop("tagName")==="A"){
					return false;
				}
			});
		}
		
		function _reBindSquares(){
			var that;
			
			that=this;
			
			$(".ic_ws, .ic_bs").unbind("click").click(function(){
				var i, len, current_bos, need_highlight, legal_moves;
				
				need_highlight=true;
				current_bos=$(this).attr("data-bos");
				
				if(that.selectedBos){
					$(".ic_highlight").removeClass("ic_highlight");
					$(".ic_currpiece").removeClass("ic_currpiece");
					
					if(Ic.sameSquare(that.selectedBos, current_bos)){
						that.selectedBos="";
						_refreshDebug.apply(that, []);
						need_highlight=false;
					}else{
						if(that.moveCaller(that.selectedBos, current_bos)){
							refreshBoard.apply(that, [1]);
							need_highlight=false;
						}else{
							that.selectedBos="";
							need_highlight=true;
						}
					}
				}
				
				if(need_highlight){
					legal_moves=that.legalMoves(current_bos);
					len=legal_moves.length;
					
					if(len){
						that.selectedBos=current_bos;
						$(this).addClass("ic_currpiece");
						
						for(i=0; i<len; i++){//0<len
							$("#ic_ui_"+Ic.toBos(legal_moves[i])).addClass("ic_highlight");
						}
					}
					
					_refreshDebug.apply(that, []);
				}
			});
		}
		
		function _refreshPieceClasses(){
			var i, j, that, reset_class, current_square, square_class;
			
			that=this;
			
			if($("#ic_ui_board").length){
				for(i=0; i<8; i++){//0...7
					for(j=0; j<8; j++){//0...7
						reset_class=((i+j)%2 ? "ic_bs" : "ic_ws");
						current_square=that.getSquare(that.isRotated ? [(7-i), (7-j)] : [i, j]);
						
						square_class=current_square.className;
						square_class=(square_class ? (" ic_"+square_class) : "");
						
						$("#ic_ui_"+current_square.bos).attr("class", reset_class).html("<div class='"+("ic_piece_holder"+square_class)+"'></div>");
					}
				}
			}
		}
		
		function _refreshMaterialDifference(){
			var i, that, temp, current_side, matdiff_html;
			
			that=this;
			
			if($("#ic_ui_materialdiff").length){
				matdiff_html="";
				
				for(i=0; i<2; i++){//0...1
					current_side=(that.isRotated===!i ? that.w : that.b);
					matdiff_html+=(i ? "<hr>" : "");
					
					temp=current_side.materialDiff.map(
						x => "<img src='"+("./css/images/"+Ic.toClassName(x)+".png")+"' width='"+_MATERIAL_DIFF_PX+"' height='"+_MATERIAL_DIFF_PX+"'>"
					).join("");
					
					matdiff_html+=(temp || "-");
				}
				
				$("#ic_ui_materialdiff").html(matdiff_html);
			}
		}
		
		function _refreshMoveList(){
			var i, len, that, move_list, black_starts, initial_full_move, new_html;
			
			that=this;
			
			if($("#ic_ui_movelist").length){
				move_list=that.moveList;
				black_starts=Ic.utilityMisc.strContains(move_list[0].Fen, " b ");
				initial_full_move=(that.fullMove-Math.floor((that.currentMove+black_starts-1)/2)+(black_starts===!(that.currentMove%2))-1);
				
				new_html="";
				
				for(i=1, len=move_list.length; i<len; i++){//1<len
					new_html+=(i!==1 ? " " : "");
					new_html+=(black_starts===!(i%2) ? ("<span class='ic_pgn_number'>"+(initial_full_move+Math.floor((i+black_starts-1)/2))+".</span>") : "");
					new_html+="<span class='"+(i!==that.currentMove ? "ic_pgn_link" : "ic_pgn_current")+"' data-index='"+i+"'>"+move_list[i].PGNmove+"</span>";
					new_html+=(move_list[i].PGNend ? (" <span class='ic_pgn_result'>"+move_list[i].PGNend+"</span>") : "");
				}
				
				if(black_starts && new_html){
					new_html="<span class='ic_pgn_number'>"+initial_full_move+"...</span>"+new_html;
				}
				
				new_html=(new_html || "-");
				
				$("#ic_ui_movelist").html(new_html);
			}
		}
		
		function _refreshDebug(){
			var i, j, that, temp, current_square, current_row, new_html;
			
			that=this;
			
			if($("#ic_ui_debug").length){
				new_html="<ul>";
				new_html+="<li><strong>Selected board:</strong> <span>"+that.boardName+"</span></li>";
				new_html+="<li><strong>Is rotated?:</strong> <span>"+that.isRotated+"</span></li>";
				new_html+="<li><strong>Number of checks:</strong> <span>"+that.checks+"</span></li>";
				new_html+="<li><strong>Is check?:</strong> <span>"+that.isCheck+"</span></li>";
				new_html+="<li><strong>Is checkmate?:</strong> <span>"+that.isCheckmate+"</span></li>";
				new_html+="<li><strong>Is stalemate?:</strong> <span>"+that.isStalemate+"</span></li>";
				new_html+="<li><strong>Is threefold repetition?:</strong> <span>"+that.isThreefold+"</span></li>";
				new_html+="<li><strong>Is fifty-move rule?:</strong> <span>"+that.isFiftyMove+"</span></li>";
				new_html+="<li><strong>Is insufficient material?:</strong> <span>"+that.isInsufficientMaterial+"</span></li>";
				new_html+="<li><strong>In draw?:</strong> <span>"+that.inDraw+"</span></li>";
				new_html+="<li><strong>En Passant square:</strong> <span>"+(that.enPassantBos || "-")+"</span></li>";
				new_html+="<li><strong>Active color:</strong> <span>"+that.activeColor+"</span></li>";
				new_html+="<li><strong>Non active color:</strong> <span>"+that.nonActiveColor+"</span></li>";
				
				new_html+="<li>";
				new_html+="<strong>W</strong>";
				new_html+="<ul>";
				new_html+="<li><strong>king square:</strong> <span>"+that.w.kingBos+"</span></li>";
				new_html+="<li><strong>castling rights:</strong> <span>"+(Ic.utilityMisc.castlingChars(that.w.castling).toUpperCase() || "-")+"</span></li>";
				new_html+="<li><strong>material difference:</strong> <span>["+that.w.materialDiff.join(", ")+"]</span></li>";
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+="<li>";
				new_html+="<strong>B</strong>";
				new_html+="<ul>";
				new_html+="<li><strong>king square:</strong> <span>"+that.b.kingBos+"</span></li>";
				new_html+="<li><strong>castling rights:</strong> <span>"+(Ic.utilityMisc.castlingChars(that.b.castling) || "-")+"</span></li>";
				new_html+="<li><strong>material difference:</strong> <span>["+that.b.materialDiff.join(", ")+"]</span></li>";
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+="<li><strong>Half moves:</strong> <span>"+that.halfMove+"</span></li>";
				new_html+="<li><strong>Full moves:</strong> <span>"+that.fullMove+"</span></li>";
				new_html+="<li><strong>Current move:</strong> <span>"+that.currentMove+"</span></li>";
				new_html+="<li><strong>Promote to:</strong> <span>"+Ic.toBal(that.promoteTo*that[that.activeColor].sign)+"</span></li>";
				new_html+="<li><strong>Is unlabeled? <sup>(ui-only)</sup>:</strong> <span>"+that.isUnlabeled+"</span></li>";
				new_html+="<li><strong>Selected square <sup>(ui-only)</sup>:</strong> <span>"+(that.selectedBos || "-")+"</span></li>";
				
				new_html+="<li>";
				new_html+="<strong>Squares</strong>";
				new_html+="<ul>";
				
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
					
					new_html+="<li><strong>A"+(8-i)+"-H"+(8-i)+":</strong> "+current_row.join(" | ")+"</li>";
				}
				
				new_html+="</ul>";
				new_html+="</li>";
				
				new_html+="<li><strong>FEN:</strong> <span>"+that.fen+"</span></li>";
				new_html+="<li><strong>Version:</strong> <span>[Ic_v"+Ic.version+"] [IcUi_v"+_VERSION+"]</span></li>";
				new_html+="</ul>";
				
				$("#ic_ui_debug").html(new_html);
			}
		}
		
		//---------------- ic ui (this=apply)
		
		function navFirst(){
			var that;
			
			that=this;
			
			return _navHelper.apply(that, [0]);
		}
		
		function navPrevious(){
			var that;
			
			that=this;
			
			return _navHelper.apply(that, [that.currentMove-1]);
		}
		
		function navNext(){
			var that;
			
			that=this;
			
			return _navHelper.apply(that, [that.currentMove+1]);
		}
		
		function navLast(){
			var that;
			
			that=this;
			
			return _navHelper.apply(that, [that.moveList.length-1]);
		}
		
		function navLinkMove(move_index){
			var that;
			
			that=this;
			
			return _navHelper.apply(that, [move_index]);
		}
		
		function refreshBoard(animation_type){
			var that;
			
			that=this;
			
			if(!that.isHidden){
				_cancelAnimations();
				
				that.selectedBos="";
				
				_bindOnce();
				
				if(!$("#ic_ui_board").html() || $("#ic_ui_board").hasClass("ic_rotated")!==that.isRotated || $("#ic_ui_board").hasClass("ic_unlabeled")!==that.isUnlabeled){
					_refreshTable(that.isRotated, that.isUnlabeled);
				}
				
				_reBindSquares.apply(that, []);
				
				$("#ic_ui_fen").val(that.fen);
				$("#ic_ui_promote").val(that.promoteTo);
				
				_refreshDebug.apply(that, []);
				
				_refreshBoardTabs(that.boardName);
				_reBindBoardLinks();
				
				_reBindButtons.apply(that, []);
				
				_reBindPromotion.apply(that, []);
				
				_refreshPieceClasses.apply(that, []);
				
				_refreshMaterialDifference.apply(that, []);
				
				_refreshMoveList.apply(that, []);
				_reBindPgnLinks.apply(that, []);
				
				if($("#ic_ui_board").length){
					_refreshActiveDot(that[that.activeColor].isBlack);
					
					if(animation_type){
						_animateCaller.apply(that, [animation_type<0]);
					}
					
					if(that.currentMove!==0){
						$("#ic_ui_"+that.moveList[that.currentMove].FromBos).addClass("ic_lastmove");
						$("#ic_ui_"+that.moveList[that.currentMove].ToBos).addClass("ic_lastmove");
					}
				}
			}
		}
		
		return (($!==null && Ic!==null) ? {
			version : _VERSION,
			navFirst : navFirst,
			navPrevious : navPrevious,
			navNext : navNext,
			navLast : navLast,
			navLinkMove : navLinkMove,
			refreshBoard : refreshBoard
		} : null);
	})();
	
	if(windw!==null){
		if(!windw.IcUi){
			windw.IcUi=IcUi;
		}
	}
})(((typeof window)!=="undefined" ? window : null), ((typeof jQuery)!=="undefined" ? jQuery : null), ((typeof Ic)!=="undefined" ? Ic : null));
