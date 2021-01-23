/** Copyright (c) 2021 Ajax Isepic (ajax333221) Licensed MIT */

/* jshint indent:4, quotmark:double, onevar:true, undef:true, unused:true, trailing:true, jquery:true, curly:true, latedef:nofunc, bitwise:false, sub:true, eqeqeq:true, esversion:6 */

(function(windw, $, Ic){
	var IcUi=(function(){
		var _VERSION="2.2.0";
		
		var _RAN_ONCE=false;
		var _KEY_NAV_MODE=false;
		
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
			var doc;
			
			if(!_RAN_ONCE){
				_RAN_ONCE=true;
				
				doc=$(document);
				
				doc.off("click.icuifen").on("click.icuifen", "#ic_ui_fen", function(){
					$(this).select();
				});
				
				doc.off("click.icuidebug").on("click.icuidebug", "#ic_ui_debug_toggle", function(){
					$(this).text("Debug "+($("#ic_ui_debug").is(":visible") ? "▲" : "▼"));
					$("#ic_ui_debug").toggle();
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("keydown.icuikeynav").on("keydown.icuikeynav", function(e){
					var elm, current_nav;
					
					if(_KEY_NAV_MODE){
						if(e.which>=37 && e.which<=40){
							current_nav=["previous", "first", "next", "last"][e.which-37];
							
							elm=$("#ic_ui_nav_"+current_nav);
						}
						
						if(elm && elm.length){
							elm.trigger("click");
							
							return false;
						}
					}
				});
				
				doc.off("click.icuifirst").on("click.icuifirst", "#ic_ui_nav_first", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_first]: missing data-boardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_first]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.navFirst();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuiprev").on("click.icuiprev", "#ic_ui_nav_previous", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_previous]: missing data-boardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_previous]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.navPrevious();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuinext").on("click.icuinext", "#ic_ui_nav_next", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_next]: missing data-boardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_next]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.navNext();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuilast").on("click.icuilast", "#ic_ui_nav_last", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_last]: missing data-boardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_nav_last]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.navLast();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuirotate").on("click.icuirotate", "#ic_ui_rotate", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_rotate]: missing data-boardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_rotate]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.toggleIsRotated();
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("change.icuipromote").on("change.icuipromote", "#ic_ui_promote", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_promote]: missing data-boardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_promote]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.setPromoteTo($(this).val());
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuichange").on("click.icuichange", ".ic_changeboard", function(){
					var board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						board_name=$(this).attr("data-rebindboardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[.ic_changeboard]: missing data-rebindboardname");
						}
					//}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[.ic_changeboard]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						refreshUi.apply(board, [0]);
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuipgnlinks").on("click.icuipgnlinks", ".ic_pgn_link", function(){
					var pgn_index, board, board_name, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						pgn_index=$(this).attr("data-index");
						
						if(!pgn_index){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[.ic_pgn_link]: missing data-index");
						}
					//}
					
					if(no_errors){
						board_name=$(this).attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[.ic_pgn_link]: missing data-boardname");
						}
					}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[.ic_pgn_link]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						board.navLinkMove(pgn_index);
					}
					
					if($(this).prop("tagName")==="A"){
						return false;
					}
				});
				
				doc.off("click.icuisquares").on("click.icuisquares", ".ic_ws, .ic_bs", function(){
					var i, len, board, board_name, current_bos, need_highlight, legal_moves, no_errors;
					
					no_errors=true;
					
					//if(no_errors){
						current_bos=$(this).attr("data-bos");
						
						if(!current_bos){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_board .ic_xs]: missing data-bos");
						}
					//}
					
					if(no_errors){
						board_name=$("#ic_ui_board").attr("data-boardname");
						
						if(!board_name){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_board .ic_xs]: missing data-boardname");
						}
					}
					
					if(no_errors){
						board=Ic.getBoard(board_name);
						
						if(board===null){
							no_errors=false;
							Ic.utilityMisc.consoleLog("Error[#ic_ui_board .ic_xs]: \""+board_name+"\" is not defined");
						}
					}
					
					if(no_errors){
						need_highlight=true;
						
						if(board.selectedBos){
							$(".ic_highlight").removeClass("ic_highlight");
							$(".ic_currpiece").removeClass("ic_currpiece");
							
							if(Ic.sameSquare(board.selectedBos, current_bos)){
								board.selectedBos="";
								_refreshDebug.apply(board, []);
								need_highlight=false;
							}else{
								if(board.playMove([board.selectedBos, current_bos])){
									need_highlight=false;
								}else{
									board.selectedBos="";
									need_highlight=true;
								}
							}
						}
						
						if(need_highlight){
							legal_moves=board.legalMoves(current_bos);
							len=legal_moves.length;
							
							if(len){
								board.selectedBos=current_bos;
								$(this).addClass("ic_currpiece");
								
								for(i=0; i<len; i++){//0<len
									$("#ic_ui_"+legal_moves[i]).addClass("ic_highlight");
								}
							}
							
							_refreshDebug.apply(board, []);
						}
					}
				});
			}
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
					
					current_board=Ic.getBoard(current_board_name);
					
					if(current_board===null){
						Ic.utilityMisc.consoleLog("Warning[_refreshBoardTabs]: \""+current_board_name+"\" is not defined");
						
						continue;
					}
					
					if(current_board.isHidden){
						new_html+="<em class='ic_disabled'>"+current_board_name+"</em>";
					}else if(current_board_name===board_name){
						new_html+="<em>"+current_board_name+"</em>";
					}else{
						new_html+="<a class='ic_changeboard' data-rebindboardname='"+current_board_name+"' href='#'>"+current_board_name+"</a>";
					}
				}
				
				$("#ic_ui_tabs").html(new_html);
			}
		}
		
		function _updateDataBoardNames(board_name){
			var i, len, arr, elm;
			
			arr=["#ic_ui_board", "#ic_ui_nav_first", "#ic_ui_nav_previous", "#ic_ui_nav_next", "#ic_ui_nav_last", "#ic_ui_rotate", "#ic_ui_promote"];
			
			for(i=0, len=arr.length; i<len; i++){
				elm=$(arr[i]);
				
				if(elm.length){
					if(!elm.attr("data-boardname") || elm.attr("data-boardname")!==board_name){
						elm.attr("data-boardname", board_name);
					}
				}
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
				
				if(temp.San.slice(0, 2)==="O-"){
					from_bos=Ic.toBos([Ic.getRankPos(temp.ToBos), (temp.San==="O-O-O" ? 0 : 7)]);
					to_bos=Ic.toBos([Ic.getRankPos(temp.ToBos), (temp.San==="O-O-O" ? 3 : 5)]);
					
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
			var i, j, len, that, temp, current_side, matdiff_html;
			
			that=this;
			
			if($("#ic_ui_materialdiff").length){
				matdiff_html="";
				
				for(i=0; i<2; i++){//0...1
					current_side=(that.isRotated===!i ? that.w : that.b);
					matdiff_html+=(i ? "<hr>" : "");
					
					temp="";
					
					for(j=0, len=current_side.materialDiff.length; j<len; j++){//0<len
						temp+="<img src='"+("./css/images/"+Ic.toClassName(current_side.materialDiff[j])+".png")+"' width='"+_MATERIAL_DIFF_PX+"' height='"+_MATERIAL_DIFF_PX+"'>";
					}
					
					matdiff_html+=(temp || "-");
				}
				
				$("#ic_ui_materialdiff").html(matdiff_html);
			}
		}
		
		function _refreshMoveList(){
			var i, len, that, result_tag_ow, move_list, black_starts, initial_full_move, new_html;
			
			that=this;
			
			if($("#ic_ui_movelist").length){
				move_list=that.moveList;
				
				black_starts=Ic.utilityMisc.strContains(move_list[0].Fen, " b ");
				
				initial_full_move=(that.fullMove-Math.floor((that.currentMove+black_starts-1)/2)+(black_starts===!(that.currentMove%2))-1);
				
				result_tag_ow="*";
				
				new_html="";
				
				for(i=0, len=move_list.length; i<len; i++){//0<len
					if(i){
						new_html+=(i!==1 ? " " : "");
						
						new_html+=(black_starts===!(i%2) ? ("<span class='ic_pgn_number'>"+(initial_full_move+Math.floor((i+black_starts-1)/2))+". </span>") : "");
						
						new_html+="<span class='"+(i!==that.currentMove ? "ic_pgn_link" : "ic_pgn_current")+"' data-index='"+i+"' data-boardname='"+that.boardName+"'>"+move_list[i].San+"</span>";
						
						if(move_list[i].Comment){
							new_html+="<span class='"+(i!==that.currentMove ? "ic_pgn_comment" : "ic_pgn_comment_current")+"'> "+move_list[i].Comment+"</span>";
						}
					}
					
					if(move_list[i].MoveResult){
						result_tag_ow=move_list[i].MoveResult;
					}
				}
				
				if(that.manualResult!=="*"){
					result_tag_ow=that.manualResult;
				}
				
				if(new_html){
					if(black_starts){
						new_html="<span class='ic_pgn_number'>"+initial_full_move+"...</span>"+new_html;
					}
					
					if(result_tag_ow!=="*"){
						new_html+=" <span class='ic_pgn_result'>"+result_tag_ow+"</span>";
					}
				}else{
					if(result_tag_ow!=="*"){
						new_html+="<span class='ic_pgn_result'>"+result_tag_ow+"</span>";
					}
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
				new_html+="<li><strong>Is insufficient material?:</strong> <span>"+that.isInsufficientMaterial+"</span></li>";
				new_html+="<li><strong>Is fifty-move rule?:</strong> <span>"+that.isFiftyMove+"</span></li>";
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
				new_html+="<li><strong>Manual result:</strong> <span>"+that.manualResult+"</span></li>";
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
		
		function setKeyNavMode(val){
			_KEY_NAV_MODE=!!val;
		}
		
		function refreshUi(animation_type){
			var that;
			
			that=this;
			
			if(!that.isHidden){
				_cancelAnimations();
				
				_bindOnce();
				_updateDataBoardNames(that.boardName);
				
				that.selectedBos="";
				
				if(!$("#ic_ui_board").html() || $("#ic_ui_board").hasClass("ic_rotated")!==that.isRotated || $("#ic_ui_board").hasClass("ic_unlabeled")!==that.isUnlabeled){
					_refreshTable(that.isRotated, that.isUnlabeled);
				}
				
				$("#ic_ui_fen").val(that.fen);
				$("#ic_ui_promote").val(that.promoteTo);
				
				_refreshDebug.apply(that, []);
				
				_refreshBoardTabs(that.boardName);
				
				_refreshPieceClasses.apply(that, []);
				
				_refreshMaterialDifference.apply(that, []);
				
				_refreshMoveList.apply(that, []);
				
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
			setKeyNavMode : setKeyNavMode,
			refreshUi : refreshUi
		} : null);
	})();
	
	if(windw!==null){
		if(!windw.IcUi){
			windw.IcUi=IcUi;
		}
	}
})(((typeof window)!=="undefined" ? window : null), ((typeof jQuery)!=="undefined" ? jQuery : null), ((typeof Ic)!=="undefined" ? Ic : null));
