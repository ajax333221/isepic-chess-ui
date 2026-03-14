/*! Copyright (c) 2026 Ajax Isepic (ajax333221) Licensed MIT */

(function (windw, Ic) {
  var IcUi = (function () {
    var _VERSION = '5.1.1';

    var _CFG = {
      chessFont: 'merida',
      chessTheme: 'wood',
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
      interactivePromotion: true,
      arrowKeysNavigation: false,
      moveTooltip: false,
      moveTooltipSize: 250,
      animationTime: 300,
      draggingTime: 50,
      scrollingTime: 60,
      pushAlertsTime: 5000,
      highlightMarkers: true,
    };

    var _POS_Y = 0;
    var _POS_X = 0;
    var _BOARD_TOOLTIP_TIMEOUT = null;
    var _INTERVAL = 0;
    var _ALERT_COUNT = 0;
    var _RAN_ONCE = false;
    var _SCROLLING_WAITING = false;
    var _BOARD_NAME = '';
    var _SELECTED_BOS = '';
    var _DRAGGING_BOS = '';
    var _PROMOTION_MODE = false;
    var _PROMOTION_DATA = null;

    var _MARKERS_LIST = [];
    var _RIGHT_DOWN_BOS = '';
    var _CURRENT_MARKER_BOS = '';

    var _ALERT_WARNING = 'warning';
    var _ALERT_ERROR = 'error';

    //!---------------- helpers

    function _chessFontHelper(chess_font) {
      var arr, default_elm;

      default_elm = 'merida';
      arr = [default_elm, 'isepic'];
      chess_font = ('' + chess_font).replace(/\s/g, '').toLowerCase();

      if (arr.indexOf(chess_font) === -1) {
        chess_font = default_elm;
      }

      return chess_font;
    }

    function _chessThemeHelper(chess_theme) {
      var arr, default_elm;

      default_elm = 'wood';
      arr = [default_elm, 'olive', 'magenta', 'aqua'];
      chess_theme = ('' + chess_theme).replace(/\s/g, '').toLowerCase();

      if (arr.indexOf(chess_theme) === -1) {
        chess_theme = default_elm;
      }

      return chess_theme;
    }

    function _promotionSquaresHelper(to_bos) {
      var file_bos, to_rank, interior_dir, i, squares;

      squares = [];
      file_bos = (to_bos || '').charAt(0);
      to_rank = parseInt((to_bos || '').charAt(1), 10);

      if (!file_bos || isNaN(to_rank)) {
        return squares;
      }

      interior_dir = to_rank === 8 ? -1 : 1;

      for (i = 0; i < 4; i++) {
        var current_rank = to_rank + interior_dir * i;

        if (current_rank < 1 || current_rank > 8) {
          break;
        }

        squares.push(file_bos + current_rank);
      }

      return squares;
    }

    function _promotionPieceClassHelper(color_moved, piece_bal) {
      var balanced_piece, val, cls;

      balanced_piece = color_moved === 'w' ? piece_bal.toUpperCase() : piece_bal.toLowerCase();
      val = Ic.toVal(balanced_piece);
      cls = Ic.toClassName(val);

      return cls ? ' ic_' + cls : '';
    }

    function _restoreCheck(board) {
      document.querySelectorAll('#ic_ui_board .ic_incheck').forEach(function (elm) {
        elm.classList.remove('ic_incheck');
      });

      if (_CFG.highlightChecks && board !== null && board.isCheck) {
        document.getElementById('ic_ui_' + board[board.activeColor].kingBos).classList.add('ic_incheck');
      }
    }

    function _restoreLastMove(board) {
      var move, from_elm, to_elm;

      document.querySelectorAll('#ic_ui_board .ic_lastmove').forEach(function (elm) {
        elm.classList.remove('ic_lastmove');
      });

      if (_CFG.highlightLastMove && board !== null && board.currentMove !== 0) {
        move = board.moveList[board.currentMove];
        from_elm = document.getElementById('ic_ui_' + move.fromBos);
        to_elm = document.getElementById('ic_ui_' + move.toBos);

        if (from_elm) from_elm.classList.add('ic_lastmove');
        if (to_elm) to_elm.classList.add('ic_lastmove');
      }
    }

    function _abortPromotionMode() {
      var i, len, data, overlay_elm, opts, square_elm, holder_elm;

      if (!_PROMOTION_MODE || !_PROMOTION_DATA) {
        return;
      }

      data = _PROMOTION_DATA;
      _PROMOTION_MODE = false;
      _PROMOTION_DATA = null;

      overlay_elm = document.getElementById('ic_ui_promotion_overlay');

      if (overlay_elm && overlay_elm.parentNode) {
        overlay_elm.parentNode.removeChild(overlay_elm);
      }

      opts = document.querySelectorAll('#ic_ui_board .ic_promotion_option');

      for (i = 0, len = opts.length; i < len; i++) {
        opts[i].remove();
      }

      if (data.squares && data.squares.length) {
        for (i = 0, len = data.squares.length; i < len; i++) {
          square_elm = document.getElementById('ic_ui_' + data.squares[i]);

          if (square_elm) {
            holder_elm = square_elm.querySelector(':scope > .ic_piece_holder');

            if (holder_elm) {
              holder_elm.style.display = '';
            }
          }
        }
      }

      if (data.fromHolderElm) {
        data.fromHolderElm.style.display = '';
      }

      _cancelAnimations();
    }

    function _exitPromotionMode(is_cancelled) {
      var i,
        len,
        data,
        board,
        overlay_elm,
        opts,
        square_elm,
        holder_elm,
        from_sq_elm,
        to_sq_elm,
        board_elm,
        rev_pawn_holder,
        rev_pawn_class,
        rev_from_rect,
        rev_to_rect,
        rev_sq_h,
        rev_sq_w,
        rev_anim_pawn,
        final_uci;

      if (!_PROMOTION_MODE || !_PROMOTION_DATA) {
        return;
      }

      data = _PROMOTION_DATA;
      _PROMOTION_MODE = false;
      _PROMOTION_DATA = null;

      board = Ic.getBoard(data.boardName);

      overlay_elm = document.getElementById('ic_ui_promotion_overlay');

      if (overlay_elm && overlay_elm.parentNode) {
        overlay_elm.parentNode.removeChild(overlay_elm);
      }

      opts = document.querySelectorAll('#ic_ui_board .ic_promotion_option');

      for (i = 0, len = opts.length; i < len; i++) {
        opts[i].remove();
      }

      if (data.squares && data.squares.length) {
        for (i = 0, len = data.squares.length; i < len; i++) {
          square_elm = document.getElementById('ic_ui_' + data.squares[i]);

          if (square_elm) {
            holder_elm = square_elm.querySelector(':scope > .ic_piece_holder');

            if (holder_elm && holder_elm !== data.fromHolderElm) {
              holder_elm.style.display = '';
            }
          }
        }
      }

      if (is_cancelled) {
        if (data.fromHolderElm && _CFG.pieceAnimations && _CFG.animationTime > 0) {
          from_sq_elm = document.getElementById('ic_ui_' + data.fromBos);
          to_sq_elm = document.getElementById('ic_ui_' + data.toBos);
          board_elm = document.getElementById('ic_ui_board');

          if (from_sq_elm && to_sq_elm && board_elm) {
            _restoreLastMove(board);
            _restoreCheck(board);

            rev_pawn_holder = data.fromHolderElm;
            rev_pawn_class = rev_pawn_holder.className;
            rev_from_rect = to_sq_elm.getBoundingClientRect();
            rev_to_rect = from_sq_elm.getBoundingClientRect();
            rev_sq_h = from_sq_elm.offsetHeight;
            rev_sq_w = from_sq_elm.offsetWidth;

            rev_pawn_holder.style.display = 'none';

            rev_anim_pawn = document.createElement('div');
            rev_anim_pawn.className = rev_pawn_class;
            Object.assign(rev_anim_pawn.style, {
              position: 'fixed',
              top: rev_from_rect.top + 'px',
              left: rev_from_rect.left + 'px',
              height: rev_sq_h + 'px',
              width: rev_sq_w + 'px',
              zIndex: '1011',
              pointerEvents: 'none',
            });

            board_elm.appendChild(rev_anim_pawn);

            void rev_anim_pawn.offsetWidth;

            rev_anim_pawn.style.transition = 'top ' + _CFG.animationTime + 'ms, left ' + _CFG.animationTime + 'ms';
            rev_anim_pawn.style.top = rev_to_rect.top + 'px';
            rev_anim_pawn.style.left = rev_to_rect.left + 'px';

            rev_anim_pawn.addEventListener(
              'transitionend',
              function () {
                rev_pawn_holder.style.display = '';
                rev_anim_pawn.remove();
              },
              { once: true }
            );
          } else {
            data.fromHolderElm.style.display = '';
            _restoreLastMove(board);
            _restoreCheck(board);
          }
        } else {
          if (data.fromHolderElm) {
            data.fromHolderElm.style.display = '';
          }
          _restoreLastMove(board);
        }

        _cancelSelected();
      } else {
        if (data.fromHolderElm) {
          data.fromHolderElm.style.display = '';
        }

        if (board !== null && data.cachedMoveUci) {
          final_uci = data.cachedMoveUci.slice(0, 4) + data.pieceBal.toLowerCase();
          board.playMove(final_uci, { isLegalMove: true, isInanimated: true, playSounds: true });
        }
      }
    }

    function _enterPromotionMode(board, from_bos, to_bos, mock_move, cached_move_uci, is_click_move) {
      var i,
        len,
        squares,
        piece_order,
        overlay_elm,
        board_elm,
        from_holder_elm,
        from_lm_elm,
        to_lm_elm,
        current_bos,
        square_elm,
        holder_elm,
        promo_class,
        promo_elm,
        from_square_elm,
        pawn_holder,
        to_square_elm,
        pawn_class,
        from_rect,
        to_rect,
        sq_h,
        sq_w,
        anim_pawn;

      if (!mock_move || !mock_move.promotion || !cached_move_uci) {
        return false;
      }

      to_bos = cached_move_uci.slice(2, 4) || to_bos;

      piece_order = ['q', 'n', 'r', 'b'];
      squares = _promotionSquaresHelper(to_bos);

      if (!squares.length) {
        return false;
      }

      board_elm = document.getElementById('ic_ui_board');

      if (!board_elm) {
        return false;
      }

      _cancelSelected();

      document.querySelectorAll('#ic_ui_board .ic_incheck').forEach(function (elm) {
        elm.classList.remove('ic_incheck');
      });

      document.querySelectorAll('#ic_ui_board .ic_lastmove').forEach(function (elm) {
        elm.classList.remove('ic_lastmove');
      });

      if (_CFG.highlightLastMove) {
        from_lm_elm = document.getElementById('ic_ui_' + from_bos);
        to_lm_elm = document.getElementById('ic_ui_' + to_bos);

        if (from_lm_elm) from_lm_elm.classList.add('ic_lastmove');
        if (to_lm_elm) to_lm_elm.classList.add('ic_lastmove');
      }

      overlay_elm = document.createElement('div');
      overlay_elm.id = 'ic_ui_promotion_overlay';
      overlay_elm.className = 'ic_promotion_overlay';
      overlay_elm.style.position = 'absolute';
      overlay_elm.style.top = '0';
      overlay_elm.style.left = '0';
      overlay_elm.style.width = '100%';
      overlay_elm.style.height = '100%';
      overlay_elm.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay_elm.style.zIndex = '1010';
      board_elm.appendChild(overlay_elm);

      for (i = 0, len = piece_order.length; i < len && i < squares.length; i++) {
        current_bos = squares[i];
        square_elm = document.getElementById('ic_ui_' + current_bos);

        if (!square_elm) {
          continue;
        }

        holder_elm = square_elm.querySelector(':scope > .ic_piece_holder');

        if (holder_elm) {
          holder_elm.style.display = 'none';
        }

        promo_class = _promotionPieceClassHelper(mock_move.colorMoved, piece_order[i]);
        promo_elm = document.createElement('div');
        promo_elm.className = 'ic_piece_holder' + promo_class + ' ic_promotion_option';
        promo_elm.dataset.bos = current_bos;
        promo_elm.dataset.piece = piece_order[i];
        promo_elm.style.position = 'relative';
        promo_elm.style.zIndex = '1012';

        square_elm.appendChild(promo_elm);
      }

      from_holder_elm = null;
      from_square_elm = document.getElementById('ic_ui_' + from_bos);

      if (from_square_elm) {
        pawn_holder = from_square_elm.querySelector(':scope > .ic_piece_holder');

        if (pawn_holder) {
          from_holder_elm = pawn_holder;
          pawn_holder.style.display = 'none';

          if (is_click_move && _CFG.pieceAnimations && _CFG.animationTime > 0) {
            to_square_elm = document.getElementById('ic_ui_' + to_bos);

            if (to_square_elm) {
              pawn_class = pawn_holder.className;
              from_rect = from_square_elm.getBoundingClientRect();
              to_rect = to_square_elm.getBoundingClientRect();
              sq_h = from_square_elm.offsetHeight;
              sq_w = from_square_elm.offsetWidth;

              anim_pawn = document.createElement('div');
              anim_pawn.className = pawn_class;
              Object.assign(anim_pawn.style, {
                position: 'fixed',
                top: from_rect.top + 'px',
                left: from_rect.left + 'px',
                height: sq_h + 'px',
                width: sq_w + 'px',
                zIndex: '1011',
                pointerEvents: 'none',
              });

              board_elm.appendChild(anim_pawn);

              void anim_pawn.offsetWidth;

              anim_pawn.style.transition = 'top ' + _CFG.animationTime + 'ms, left ' + _CFG.animationTime + 'ms';
              anim_pawn.style.top = to_rect.top + 'px';
              anim_pawn.style.left = to_rect.left + 'px';

              anim_pawn.addEventListener(
                'transitionend',
                function () {
                  anim_pawn.remove();
                },
                { once: true }
              );
            }
          }
        }
      }

      _PROMOTION_MODE = true;
      _PROMOTION_DATA = {
        boardName: board.boardName,
        fromBos: from_bos,
        toBos: to_bos,
        cachedMoveUci: cached_move_uci,
        squares: squares,
        fromHolderElm: from_holder_elm,
      };

      return true;
    }

    function _pushAlertHelper(alert_msg, from_top, class_name) {
      var timeout_id, alert_id, top_or_bottom, alert_holder, alert_box, close_btn;

      class_name = class_name || '';
      from_top = from_top === true;

      block: {
        top_or_bottom = from_top ? 'top' : 'bottom';
        alert_holder = document.getElementById('ic_ui_push_alerts_' + top_or_bottom);

        if (!alert_holder) {
          break block;
        }

        timeout_id = null;
        alert_id = `ic_alert-${++_ALERT_COUNT}`;

        if (_CFG.pushAlertsTime > 0) {
          timeout_id = setTimeout(function () {
            var alert_box;

            alert_box = document.getElementById(alert_id);

            if (alert_box) {
              alert_box.classList.add('ic_alert_hidden');
              alert_box.addEventListener(
                'transitionend',
                function () {
                  alert_box.remove();
                  clearTimeout(timeout_id);
                },
                { once: true }
              );
            }
          }, _CFG.pushAlertsTime);
        }

        alert_box = document.createElement('div');
        alert_box.id = alert_id;
        alert_box.className = 'ic_alert_box ic_alert_animation' + (class_name ? ' ' + class_name : '');
        alert_box.style.setProperty('margin-' + top_or_bottom, '20px');
        alert_box.innerHTML = (alert_msg || '').replace(
          /^([^ ]*)\[[^\]]+]: /,
          (x) => `<span class='ic_alert_header'>${x.trim()}</span>`
        );
        alert_holder.appendChild(alert_box);

        close_btn = document.createElement('div');
        close_btn.className = 'ic_alert_close';
        close_btn.dataset.target = alert_id;
        close_btn.dataset.timeout = timeout_id;
        close_btn.innerHTML = '&times;';
        alert_box.appendChild(close_btn);
      }
    }

    //!---------------- utilities

    function _cancelAnimations() {
      document.querySelectorAll('#ic_ui_board > .ic_piece_holder').forEach(function (elm) {
        elm.remove();
      });
      document.querySelectorAll('#ic_ui_board .ic_piece_holder').forEach(function (elm) {
        elm.style.display = '';
      });
    }

    function _cancelSelected() {
      document.querySelectorAll('#ic_ui_board .ic_highlight').forEach(function (elm) {
        elm.classList.remove('ic_highlight');
      });
      document.querySelectorAll('#ic_ui_board .ic_selected').forEach(function (elm) {
        elm.classList.remove('ic_selected');
      });

      _SELECTED_BOS = '';
    }

    function _cancelDragging() {
      if (_INTERVAL) {
        clearInterval(_INTERVAL);

        _INTERVAL = 0;
      }

      if (_DRAGGING_BOS) {
        document.querySelectorAll('#ic_ui_board .ic_drag_shown').forEach(function (elm) {
          elm.remove();
        });
        document.querySelectorAll('#ic_ui_board .ic_drag_hidden').forEach(function (elm) {
          elm.style.display = '';
          elm.classList.remove('ic_drag_hidden');
        });
      }

      _DRAGGING_BOS = '';
    }

    function _getHoverElement(x, y) {
      var i, elm, rect, squares, rtn;

      rtn = null;
      squares = document.querySelectorAll('#ic_ui_board .ic_ws, #ic_ui_board .ic_bs');

      for (i = 0; i < squares.length; i++) {
        elm = squares[i];
        rect = elm.getBoundingClientRect();

        if (x >= rect.left + window.scrollX && x <= rect.right + window.scrollX) {
          if (y >= rect.top + window.scrollY && y <= rect.bottom + window.scrollY) {
            rtn = elm;
            break;
          }
        }
      }

      return rtn;
    }

    function _refreshMarkers() {
      var i,
        len,
        board_elm,
        svg_elm,
        marker,
        from_sq,
        to_sq,
        from_rect,
        to_rect,
        board_rect,
        x1,
        y1,
        x2,
        y2,
        dx,
        dy,
        angle,
        dist,
        svg_html,
        opacity,
        marker_arr,
        active_from,
        active_to,
        preview_exists,
        is_being_erased,
        is_new_preview;

      board_elm = document.getElementById('ic_ui_board');

      if (!board_elm) {
        return;
      }

      document.querySelectorAll('#ic_ui_markers_svg').forEach(function (elm) {
        elm.remove();
      });

      if (!_CFG.highlightMarkers) {
        return;
      }

      active_from = _RIGHT_DOWN_BOS;
      active_to = _CURRENT_MARKER_BOS;
      preview_exists = !!(active_from && active_to);
      marker_arr = [];

      for (i = 0, len = _MARKERS_LIST.length; i < len; i++) {
        is_being_erased = false;

        if (preview_exists && _MARKERS_LIST[i].from === active_from && _MARKERS_LIST[i].to === active_to) {
          is_being_erased = true;
        }

        marker_arr.push({ data: _MARKERS_LIST[i], opacity: is_being_erased ? 0.35 : 0.7 });
      }

      if (preview_exists) {
        is_new_preview = true;

        for (i = 0, len = _MARKERS_LIST.length; i < len; i++) {
          if (_MARKERS_LIST[i].from === active_from && _MARKERS_LIST[i].to === active_to) {
            is_new_preview = false;
            break;
          }
        }

        if (is_new_preview) {
          marker_arr.push({ data: { from: active_from, to: active_to }, opacity: 0.7 });
        }
      }

      if (!marker_arr.length) {
        return;
      }

      board_rect = board_elm.getBoundingClientRect();
      svg_html = '';

      for (i = 0, len = marker_arr.length; i < len; i++) {
        marker = marker_arr[i].data;
        opacity = marker_arr[i].opacity;

        from_sq = document.getElementById('ic_ui_' + marker.from);
        to_sq = document.getElementById('ic_ui_' + marker.to);

        if (!from_sq || !to_sq) {
          continue;
        }

        from_rect = from_sq.getBoundingClientRect();
        to_rect = to_sq.getBoundingClientRect();

        x1 = from_rect.left + from_rect.width / 2 - board_rect.left;
        y1 = from_rect.top + from_rect.height / 2 - board_rect.top;
        x2 = to_rect.left + to_rect.width / 2 - board_rect.left;
        y2 = to_rect.top + to_rect.height / 2 - board_rect.top;

        var stroke_w = Math.max(2, from_rect.width * 0.1); // Scales with size, minimum 2px
        var arrow_size = from_rect.width * 0.45; // Scales arrowhead size

        if (marker.from === marker.to) {
          svg_html += `<g opacity='${opacity}'>`;
          svg_html += `<circle cx='${x1}' cy='${y1}' r='${
            from_rect.width / 2 - 4
          }' fill='none' stroke='rgb(255, 231, 0)' stroke-width='${stroke_w * 0.85}' />`;
          svg_html += `</g>`;
        } else {
          dx = x2 - x1;
          dy = y2 - y1;
          angle = Math.atan2(dy, dx) * (180 / Math.PI);
          dist = Math.sqrt(dx * dx + dy * dy);

          svg_html += `<g transform='translate(${x1},${y1}) rotate(${angle})' opacity='${opacity}' stroke-linecap='butt' stroke-linejoin='miter'>`;

          // Line stops before the arrowhead base
          svg_html += `<line x1='0' y1='0' x2='${
            dist - arrow_size * 0.8
          }' y2='0' stroke='rgb(255, 231, 0)' stroke-width='${stroke_w * 1.4}' />`;

          // Proportional triangle
          svg_html += `<path d='M${dist - arrow_size},-${arrow_size * 0.6} L${dist},0 L${dist - arrow_size},${
            arrow_size * 0.6
          } Z' fill='rgb(255, 231, 0)' />`;

          svg_html += `</g>`;
        }
      }

      svg_elm = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg_elm.id = 'ic_ui_markers_svg';
      Object.assign(svg_elm.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '1005',
      });
      svg_elm.innerHTML = svg_html;
      board_elm.appendChild(svg_elm);
    }

    function _animatePiece(from_bos, to_bos, piece_class, promotion_class) {
      var temp, piece_elm, from_square, to_square, old_offset, new_offset, old_h, old_w;

      from_square = document.getElementById('ic_ui_' + from_bos);
      to_square = document.getElementById('ic_ui_' + to_bos);

      temp = from_square.querySelector(':scope > .ic_piece_holder').getBoundingClientRect();
      old_offset = { top: temp.top, left: temp.left };
      temp = to_square.querySelector(':scope > .ic_piece_holder').getBoundingClientRect();
      new_offset = { top: temp.top, left: temp.left };

      old_h = from_square.offsetHeight;
      old_w = from_square.offsetWidth;

      to_square.innerHTML = "<div class='" + ('ic_piece_holder' + piece_class) + "'></div>";
      piece_elm = to_square.querySelector(':scope > .ic_piece_holder');
      temp = piece_elm.cloneNode(true);
      document.getElementById('ic_ui_board').appendChild(temp);
      piece_elm.style.display = 'none';
      piece_elm.className = 'ic_piece_holder' + (promotion_class || piece_class);

      Object.assign(temp.style, {
        position: 'fixed',
        top: old_offset.top + 'px',
        left: old_offset.left + 'px',
        height: old_h + 'px',
        width: old_w + 'px',
        zIndex: 1000,
      });
      void temp.offsetWidth;
      temp.style.transition = 'top ' + _CFG.animationTime + 'ms, left ' + _CFG.animationTime + 'ms';
      temp.style.top = new_offset.top + 'px';
      temp.style.left = new_offset.left + 'px';
      temp.addEventListener(
        'transitionend',
        function () {
          piece_elm.style.display = '';
          temp.remove();
        },
        { once: true }
      );
    }

    function _dragPiece(initial_x, initial_y, square_bos) {
      var limit,
        dragged_elm,
        piece_elm,
        piece_h,
        piece_w,
        piece_offset,
        centered_top,
        centered_left,
        target_square,
        old_y,
        old_x,
        limit_top,
        limit_right,
        limit_bottom,
        limit_left;

      _cancelDragging();
      _DRAGGING_BOS = square_bos;
      limit = document.body;

      if (limit) {
        limit_top = 0;
        limit_left = 0;
        limit_right = window.innerWidth;
        limit_bottom = window.innerHeight;
      }

      target_square = document.getElementById('ic_ui_' + square_bos);

      piece_h = target_square.offsetHeight;
      piece_w = target_square.offsetWidth;

      piece_elm = target_square.querySelector(':scope > .ic_piece_holder');
      piece_offset = { top: piece_elm.getBoundingClientRect().top, left: piece_elm.getBoundingClientRect().left };
      dragged_elm = piece_elm.cloneNode(true);
      document.getElementById('ic_ui_board').appendChild(dragged_elm);
      piece_elm.classList.add('ic_drag_hidden');
      piece_elm.style.display = 'none';

      centered_top = initial_y - window.scrollY - piece_h / 2;
      centered_left = initial_x - window.scrollX - piece_w / 2;

      Object.assign(dragged_elm.style, {
        position: 'fixed',
        top: piece_offset.top + 'px',
        left: piece_offset.left + 'px',
        height: piece_h + 'px',
        width: piece_w + 'px',
        cursor: 'pointer',
        zIndex: 1020,
      });
      dragged_elm.classList.add('ic_drag_shown');

      _POS_Y = initial_y;
      _POS_X = initial_x;
      old_y = _POS_Y;
      old_x = _POS_X;

      _INTERVAL = setInterval(function () {
        var pos_y, pos_x;

        if (old_y !== _POS_Y || old_x !== _POS_X) {
          pos_y = centered_top - (initial_y - _POS_Y);
          pos_x = centered_left - (initial_x - _POS_X);

          if (pos_y < limit_top && limit) {
            pos_y = limit_top;
          } else if (pos_y + dragged_elm.clientHeight > limit_bottom && limit) {
            pos_y = limit_bottom - dragged_elm.offsetHeight;
          }

          if (pos_x < limit_left && limit) {
            pos_x = limit_left;
          } else if (pos_x + dragged_elm.clientWidth > limit_right && limit) {
            pos_x = limit_right - dragged_elm.offsetWidth;
          }

          Object.assign(dragged_elm.style, {
            top: pos_y + 'px',
            left: pos_x + 'px',
          });
        }

        old_y = _POS_Y;
        old_x = _POS_X;
      }, _CFG.draggingTime);
    }

    function _bindOnce() {
      if (!_RAN_ONCE) {
        _RAN_ONCE = true;

        window.addEventListener('resize', function () {
          _refreshMarkers();
        });

        document.addEventListener('contextmenu', function (e) {
          if (e.target.closest('#ic_ui_board')) {
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm;

          this_elm = e.target.closest('#ic_ui_fen');

          if (!this_elm) {
            return;
          }

          this_elm.select();
        });

        document.addEventListener('click', function (e) {
          var overlay_elm, opt_elm, piece_bal;

          overlay_elm = document.getElementById('ic_ui_promotion_overlay');

          if (!overlay_elm) {
            return;
          }

          opt_elm = e.target.closest('.ic_promotion_option');

          if (opt_elm) {
            piece_bal = opt_elm.dataset.piece || '';

            if (_PROMOTION_MODE && _PROMOTION_DATA && piece_bal) {
              _PROMOTION_DATA.pieceBal = piece_bal;

              _exitPromotionMode(false);
            }

            e.preventDefault();
            return;
          }

          if (overlay_elm.contains(e.target)) {
            _exitPromotionMode(true);
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, debug_elm;

          this_elm = e.target.closest('#ic_ui_debug_toggler');

          if (!this_elm) {
            return;
          }

          debug_elm = document.getElementById('ic_ui_debug');
          this_elm.textContent = 'Debug ' + (debug_elm && debug_elm.offsetParent !== null ? '▲' : '▼');

          if (debug_elm) {
            debug_elm.style.display = debug_elm.style.display === 'none' ? '' : 'none';
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('keydown', function (e) {
          var board, current_nav;

          block: {
            if (!_CFG.arrowKeysNavigation) {
              break block;
            }

            if (e.which < 37 || e.which > 40) {
              break block;
            }

            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[keydown]: board not found', _ALERT_ERROR);
              break block;
            }

            current_nav = ['left', 'up', 'right', 'down'][e.which - 37];

            switch (current_nav) {
              case 'up':
                board.navFirst();
                break;
              case 'left':
                board.navPrevious();
                break;
              case 'right':
                board.navNext();
                break;
              case 'down':
                board.navLast();
                break;
              default:
                Ic.utilityMisc.consoleLog('[keydown]: invalid case "' + current_nav + '"', _ALERT_ERROR);
            }

            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, alert_box, target_id, timeout_id;

          this_elm = e.target.closest('.ic_alert_close');

          if (!this_elm) {
            return;
          }

          target_id = this_elm.dataset.target;
          timeout_id = this_elm.dataset.timeout;
          alert_box = document.getElementById(target_id);

          if (alert_box) {
            alert_box.classList.add('ic_alert_hidden');
            alert_box.addEventListener(
              'transitionend',
              function () {
                alert_box.remove();
                clearTimeout(timeout_id);
              },
              { once: true }
            );
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, board;

          this_elm = e.target.closest('#ic_ui_nav_first');

          if (!this_elm) {
            return;
          }

          if (this_elm.classList.contains('ic_disabled')) {
            return;
          }

          block: {
            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[#ic_ui_nav_first]: board not found', _ALERT_ERROR);
              break block;
            }

            board.navFirst();
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, board;

          this_elm = e.target.closest('#ic_ui_nav_previous');

          if (!this_elm) {
            return;
          }

          if (this_elm.classList.contains('ic_disabled')) {
            return;
          }

          block: {
            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[#ic_ui_nav_previous]: board not found', _ALERT_ERROR);
              break block;
            }

            board.navPrevious();
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, board;

          this_elm = e.target.closest('#ic_ui_nav_next');

          if (!this_elm) {
            return;
          }

          if (this_elm.classList.contains('ic_disabled')) {
            return;
          }

          block: {
            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[#ic_ui_nav_next]: board not found', _ALERT_ERROR);
              break block;
            }

            board.navNext();
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, board;

          this_elm = e.target.closest('#ic_ui_nav_last');

          if (!this_elm) {
            return;
          }

          if (this_elm.classList.contains('ic_disabled')) {
            return;
          }

          block: {
            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[#ic_ui_nav_last]: board not found', _ALERT_ERROR);
              break block;
            }

            board.navLast();
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, board;

          this_elm = e.target.closest('#ic_ui_rotate');

          if (!this_elm) {
            return;
          }

          if (this_elm.classList.contains('ic_disabled')) {
            return;
          }

          block: {
            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[#ic_ui_rotate]: board not found', _ALERT_ERROR);
              break block;
            }

            board.toggleIsRotated();
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('change', function (e) {
          var this_elm, board;

          this_elm = e.target.closest('#ic_ui_promote');

          if (!this_elm) {
            return;
          }

          block: {
            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[#ic_ui_promote]: board not found', _ALERT_ERROR);
              break block;
            }

            board.setPromoteTo(this_elm.value);
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, board, board_name;

          this_elm = e.target.closest('.ic_changeboard');

          if (!this_elm) {
            return;
          }

          block: {
            board_name = this_elm.dataset.rebindboardname;

            if (!board_name) {
              Ic.utilityMisc.consoleLog('[.ic_changeboard]: missing data-rebindboardname', _ALERT_ERROR);
              break block;
            }

            board = Ic.getBoard(board_name);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[.ic_changeboard]: board not found', _ALERT_ERROR);
              break block;
            }

            refreshUi.apply(board, [0, false]);
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('click', function (e) {
          var this_elm, pgn_index, board;

          this_elm = e.target.closest('.ic_pgn_link');

          if (!this_elm) {
            return;
          }

          block: {
            pgn_index = this_elm.dataset.index;

            if (!pgn_index) {
              Ic.utilityMisc.consoleLog('[.ic_pgn_link]: missing data-index', _ALERT_ERROR);
              break block;
            }

            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[.ic_pgn_link]: board not found', _ALERT_ERROR);
              break block;
            }

            board.navLinkMove(pgn_index);
          }

          if (this_elm.tagName === 'A') {
            e.preventDefault();
          }
        });

        document.addEventListener('mousemove', function (e) {
          var temp, current_bos;

          block: {
            if (_CFG.pieceDragging && _DRAGGING_BOS) {
              _POS_Y = e.pageY;
              _POS_X = e.pageX;
            }

            if (_CFG.highlightMarkers && _RIGHT_DOWN_BOS) {
              temp = _getHoverElement(e.pageX, e.pageY);
              current_bos = temp ? temp.dataset.bos : '';

              if (current_bos !== _CURRENT_MARKER_BOS) {
                _CURRENT_MARKER_BOS = current_bos;
                _refreshMarkers();
              }
            }
          }
        });

        document.addEventListener('mouseup', function (e) {
          var i,
            len,
            temp,
            board,
            current_bos,
            old_drg,
            is_promotion_move,
            mock_move,
            is_legal_move,
            cached_move_uci,
            marker_found;

          old_drg = _DRAGGING_BOS;
          _cancelDragging();

          block: {
            if (_PROMOTION_MODE) {
              break block;
            }

            if (!_CFG.boardInteractions) {
              break block;
            }

            if (e.button === 2 && _RIGHT_DOWN_BOS) {
              current_bos = _CURRENT_MARKER_BOS;

              if (current_bos) {
                marker_found = false;

                for (i = 0, len = _MARKERS_LIST.length; i < len; i++) {
                  if (_MARKERS_LIST[i].from === _RIGHT_DOWN_BOS && _MARKERS_LIST[i].to === current_bos) {
                    _MARKERS_LIST.splice(i, 1);
                    marker_found = true;
                    break;
                  }
                }

                if (!marker_found) {
                  _MARKERS_LIST.push({ from: _RIGHT_DOWN_BOS, to: current_bos });
                }
              }

              _RIGHT_DOWN_BOS = '';
              _CURRENT_MARKER_BOS = '';
              _refreshMarkers();
              break block;
            }

            if (!old_drg) {
              break block;
            }

            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[mouseup]: board not found', _ALERT_ERROR);
              break block;
            }

            temp = _getHoverElement(e.pageX, e.pageY);

            if (!temp) {
              break block;
            }

            current_bos = temp.dataset.bos;

            if (!current_bos) {
              Ic.utilityMisc.consoleLog('[mouseup]: missing data-bos', _ALERT_ERROR);
              break block;
            }

            if (old_drg !== current_bos) {
              is_promotion_move = false;
              cached_move_uci = null;
              mock_move = board.playMove([old_drg, current_bos], { isMockMove: true });

              is_legal_move = mock_move !== null;

              if (is_legal_move) {
                cached_move_uci = mock_move.uci;
                is_promotion_move = !!mock_move.promotion;
              }

              if (is_promotion_move && is_legal_move && _CFG.interactivePromotion) {
                if (_enterPromotionMode(board, old_drg, current_bos, mock_move, cached_move_uci, false)) {
                  break block;
                }
              }

              if (
                !is_legal_move ||
                !board.playMove(cached_move_uci, { isLegalMove: true, isInanimated: true, playSounds: true })
              ) {
                _cancelSelected();
              }
            }
          }
        });

        document.addEventListener('mousedown', function (e) {
          var i,
            len,
            temp,
            legal_moves,
            board,
            square,
            current_bos,
            old_sel,
            is_promotion_move,
            mock_move,
            is_legal_move,
            cached_move_uci;

          old_sel = _SELECTED_BOS;
          _cancelSelected();
          _cancelDragging();

          block: {
            if (_PROMOTION_MODE) {
              break block;
            }

            if (!_CFG.boardInteractions) {
              break block;
            }

            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[mousedown]: board not found', _ALERT_ERROR);
              break block;
            }

            temp = _getHoverElement(e.pageX, e.pageY);

            if (!temp) {
              break block;
            }

            current_bos = temp.dataset.bos;

            if (!current_bos) {
              Ic.utilityMisc.consoleLog('[mousedown]: missing data-bos', _ALERT_ERROR);
              break block;
            }

            if (e.button === 2) {
              _RIGHT_DOWN_BOS = current_bos;
              _CURRENT_MARKER_BOS = current_bos;
              _refreshMarkers();
              break block;
            }

            if (_MARKERS_LIST.length) {
              _MARKERS_LIST = [];
              _refreshMarkers();
            }

            square = board.getSquare(current_bos);

            if (square === null) {
              Ic.utilityMisc.consoleLog('[mousedown]: square not found', _ALERT_ERROR);
              break block;
            }

            is_promotion_move = false;
            cached_move_uci = null;

            if (old_sel && old_sel !== current_bos) {
              mock_move = board.playMove([old_sel, current_bos], { isMockMove: true });

              is_legal_move = mock_move !== null;

              if (is_legal_move) {
                cached_move_uci = mock_move.uci;
                is_promotion_move = !!mock_move.promotion;
              }

              if (is_promotion_move && is_legal_move && _CFG.interactivePromotion) {
                if (_enterPromotionMode(board, old_sel, current_bos, mock_move, cached_move_uci, true)) {
                  break block;
                }
              }
            }

            if (
              !old_sel ||
              (old_sel !== current_bos &&
                (!is_legal_move || !board.playMove(cached_move_uci, { isLegalMove: true, playSounds: true })))
            ) {
              if (square.className) {
                _SELECTED_BOS = current_bos;

                if (_CFG.pieceDragging) {
                  _dragPiece(e.pageX, e.pageY, current_bos);
                }

                if (_CFG.highlightSelected) {
                  document.getElementById('ic_ui_' + current_bos).classList.add('ic_selected');
                }

                if (_CFG.highlightLegalMoves) {
                  legal_moves = board.legalMoves(current_bos);

                  for (i = 0, len = legal_moves.length; i < len; i++) {
                    square = board.getSquare(legal_moves[i]);
                    temp = 'ic_highlight';

                    if (!square.isEmptySquare && square.sign === board[board.nonActiveColor].sign) {
                      temp += ' ic_capture';
                    }

                    document.getElementById('ic_ui_' + square.bos).classList.add(...temp.split(' '));
                  }
                }
              }
            }
          }
        });

        document.addEventListener(
          'wheel',
          function (e) {
            var temp, board, is_reversed;

            block: {
              if (!_CFG.scrollNavigation) {
                break block;
              }

              if (!e.target.closest('#ic_ui_board')) {
                break block;
              }

              temp = e && e.deltaY ? e.deltaY : 0;

              if (!temp) {
                break block;
              }

              e.preventDefault();

              if (_SCROLLING_WAITING) {
                break block;
              }

              _SCROLLING_WAITING = true;

              setTimeout(function () {
                _SCROLLING_WAITING = false;
              }, _CFG.scrollingTime);

              is_reversed = temp < 0;

              board = Ic.getBoard(_BOARD_NAME);

              if (board === null) {
                Ic.utilityMisc.consoleLog('[wheel]: board not found', _ALERT_ERROR);
                break block;
              }

              if (is_reversed) {
                board.navPrevious();
              } else {
                board.navNext();
              }
            }
          },
          { passive: false }
        );

        document.addEventListener('mouseover', function (e) {
          var this_elm,
            i,
            j,
            temp,
            board_tooltip,
            pgn_index,
            move,
            squares,
            html,
            square_color,
            current_bos,
            current_square,
            last_move,
            in_check,
            square_class,
            tooltip_top,
            tooltip_left,
            board;

          this_elm = e.target.closest('.ic_pgn_link, .ic_pgn_active');

          if (!this_elm) {
            return;
          }

          clearTimeout(_BOARD_TOOLTIP_TIMEOUT);

          block: {
            if (!_CFG.moveTooltip) {
              break block;
            }

            if (!document.getElementById('ic_ui_move_tooltip')) {
              Ic.utilityMisc.consoleLog('[.ic_pgn_link|.ic_pgn_active]: missing move tooltip component', _ALERT_ERROR);
              break block;
            }

            board_tooltip = document.getElementById('ic_ui_move_tooltip');
            pgn_index = this_elm.dataset.index;

            if (!pgn_index) {
              Ic.utilityMisc.consoleLog('[.ic_pgn_link|.ic_pgn_active]: missing data-index', _ALERT_ERROR);
              break block;
            }

            board = Ic.getBoard(_BOARD_NAME);

            if (board === null) {
              Ic.utilityMisc.consoleLog('[.ic_pgn_link|.ic_pgn_active]: board not found', _ALERT_ERROR);
              break block;
            }

            move = board.moveList[pgn_index];
            squares = Ic.fenGet(move.fen, 'squares').squares;

            html = "<table cellpadding='0' cellspacing='0'>";

            for (i = 0; i < 8; i++) {
              html += '<tr>';

              for (j = 0; j < 8; j++) {
                square_color = (i + j) % 2 ? 'ic_bs' : 'ic_ws';

                current_bos = Ic.toBos(board.isRotated ? [7 - i, 7 - j] : [i, j]);

                current_square = squares[current_bos].className;
                current_square = current_square ? ' ic_' + current_square : '';

                last_move =
                  _CFG.highlightLastMove && (current_bos === move.fromBos || current_bos === move.toBos)
                    ? ' ic_lastmove'
                    : '';

                in_check =
                  _CFG.highlightChecks &&
                  squares[current_bos].isKing &&
                  (move.colorMoved === 'w' ? -1 : 1) === squares[current_bos].sign &&
                  /[+#]/.test(move.san)
                    ? ' ic_incheck'
                    : '';

                square_class = 'ic_piece_holder' + current_square;

                html += `<td class="${square_color + last_move + in_check}"><div class="${square_class}"></div></td>`;
              }

              html += '</tr>';
            }

            html += '</table>';

            board_tooltip.innerHTML = html;

            tooltip_top = this_elm.offsetTop + this_elm.offsetHeight + 20;
            tooltip_left = this_elm.offsetLeft + this_elm.offsetWidth / 2 - board_tooltip.offsetWidth / 2;

            temp = ['tooltip_visible'];
            temp.push('ic_font_' + _chessFontHelper(_CFG.chessFont));
            temp.push('ic_theme_' + _chessThemeHelper(_CFG.chessTheme));

            Object.assign(board_tooltip.style, {
              top: tooltip_top + 'px',
              left: tooltip_left + 'px',
              height: _CFG.moveTooltipSize + 'px',
              width: _CFG.moveTooltipSize + 'px',
            });
            board_tooltip.className = temp.join(' ');
          }
        });

        document.addEventListener('mouseout', function (e) {
          var this_elm;

          this_elm = e.target.closest('.ic_pgn_link, .ic_pgn_active');

          if (!this_elm || this_elm.contains(e.relatedTarget)) {
            return;
          }

          block: {
            if (!_CFG.moveTooltip) {
              break block;
            }

            if (!document.getElementById('ic_ui_move_tooltip')) {
              Ic.utilityMisc.consoleLog('[.ic_pgn_link|.ic_pgn_active]: missing move tooltip component', _ALERT_ERROR);
              break block;
            }

            _BOARD_TOOLTIP_TIMEOUT = setTimeout(function () {
              document.getElementById('ic_ui_move_tooltip').classList.remove('tooltip_visible');
            }, 150);
          }
        });
      }
    }

    function _refreshActiveDot(active_is_black) {
      document.querySelectorAll('#ic_ui_board .ic_w_color, #ic_ui_board .ic_b_color').forEach(function (elm) {
        elm.classList.remove('ic_w_color', 'ic_b_color');
      });
      document
        .querySelector('#ic_ui_board ' + (active_is_black ? '.ic_bside' : '.ic_wside'))
        .classList.add(active_is_black ? 'ic_b_color' : 'ic_w_color');
    }

    function _refreshBoardTabs(board_name) {
      var i, len, current_board, current_board_name, board_list, new_html;

      if (document.getElementById('ic_ui_board_tabs')) {
        board_list = Ic.getBoardNames();
        new_html = '<strong>Boards:</strong> ';

        for (i = 0, len = board_list.length; i < len; i++) {
          new_html += i ? ' | ' : '';
          current_board_name = board_list[i];
          current_board = Ic.getBoard(current_board_name);

          if (current_board === null) {
            Ic.utilityMisc.consoleLog('[_refreshBoardTabs]: board not found', _ALERT_WARNING);
            continue;
          }

          if (current_board.isHidden) {
            new_html += "<em class='ic_disabled'>" + current_board_name + '</em>';
          } else if (current_board_name === board_name) {
            new_html += '<em>' + current_board_name + '</em>';
          } else {
            new_html +=
              "<a href='#' class='ic_changeboard' data-rebindboardname='" +
              current_board_name +
              "'>" +
              current_board_name +
              '</a>';
          }
        }

        document.getElementById('ic_ui_board_tabs').innerHTML = new_html;
      }
    }

    function _refreshTable(is_rotated, is_labeled, is_interactive) {
      var i, j, temp, board_ref, rank_bos, current_bos, new_class, new_html;

      temp = [];

      if (is_rotated) {
        temp.push('ic_rotated');
      }

      if (!is_labeled) {
        temp.push('ic_unlabeled');
      }

      if (!is_interactive) {
        temp.push('ic_frozen');
      }

      temp.push('ic_font_' + _chessFontHelper(_CFG.chessFont));
      temp.push('ic_theme_' + _chessThemeHelper(_CFG.chessTheme));

      new_class = temp.join(' ');
      new_html = "<table cellpadding='0' cellspacing='0'>";

      if (is_labeled) {
        new_html +=
          "<tr><td class='ic_label'></td><td class='ic_label'><div class='ic_char'><span>" +
          (is_rotated ? 'HGFEDCBA' : 'ABCDEFGH')
            .split('')
            .join("</span></div></td><td class='ic_label'><div class='ic_char'><span>") +
          "</span></div></td><td class='" +
          ('ic_label ic_dot ' + (is_rotated ? 'ic_wside' : 'ic_bside')) +
          "'><div class='ic_char'><span>◘</span></div></td></tr>";
      }

      for (i = 0; i < 8; i++) {
        rank_bos = is_rotated ? i + 1 : 8 - i;
        new_html += '<tr>';

        if (is_labeled) {
          new_html += "<td class='ic_label'><div class='ic_char'><span>" + rank_bos + '</span></div></td>';
        }

        for (j = 0; j < 8; j++) {
          current_bos = Ic.toBos(is_rotated ? [7 - i, 7 - j] : [i, j]);
          new_html +=
            "<td id='" +
            ('ic_ui_' + current_bos) +
            "' class='" +
            ((i + j) % 2 ? 'ic_bs' : 'ic_ws') +
            "' data-bos='" +
            current_bos +
            "'><div class='ic_piece_holder'></div></td>";
        }

        if (is_labeled) {
          new_html += "<td class='ic_label'><div class='ic_char'><span>" + rank_bos + '</span></div></td>';
        }

        new_html += '</tr>';
      }

      if (is_labeled) {
        new_html +=
          "<tr><td class='ic_label'></td><td class='ic_label'><div class='ic_char'><span>" +
          (is_rotated ? 'HGFEDCBA' : 'ABCDEFGH')
            .split('')
            .join("</span></div></td><td class='ic_label'><div class='ic_char'><span>") +
          "</span></div></td><td class='" +
          ('ic_label ic_dot ' + (is_rotated ? 'ic_bside' : 'ic_wside')) +
          "'><div class='ic_char'><span>◘</span></div></td></tr>";
      }

      new_html += '</table>';

      if (_CFG.soundEffects) {
        new_html +=
          "<audio id='ic_ui_sound_move' src='./sounds/move.wav' preload='auto' style='display:none;'></audio>";
        new_html +=
          "<audio id='ic_ui_sound_capture' src='./sounds/capture.wav' preload='auto' style='display:none;'></audio>";
      }

      board_ref = document.getElementById('ic_ui_board');
      board_ref.className = new_class;
      board_ref.innerHTML = new_html;

      _refreshMarkers();
    }

    //!---------------- utilities (this=apply)

    function _animateCaller(is_reversed) {
      var that, temp, from_bos, to_bos, piece_class, promotion_class;

      that = this;

      if ((that.currentMove !== 0 || is_reversed) && (that.currentMove !== that.moveList.length - 1 || !is_reversed)) {
        temp = that.moveList[that.currentMove + is_reversed];
        from_bos = temp.fromBos;
        to_bos = temp.toBos;
        piece_class = Ic.toClassName(Ic.toAbsVal(temp.piece) * Ic.getSign(temp.colorMoved === 'b'));
        piece_class = piece_class ? ' ic_' + piece_class : '';

        if (is_reversed) {
          _animatePiece(to_bos, from_bos, piece_class);
        } else {
          promotion_class = Ic.toClassName(Ic.toAbsVal(temp.promotion) * Ic.getSign(temp.colorMoved === 'b'));
          promotion_class = promotion_class ? ' ic_' + promotion_class : '';
          _animatePiece(from_bos, to_bos, piece_class, promotion_class);
        }

        if (temp.san.slice(0, 2) === 'O-') {
          from_bos = Ic.toBos([Ic.getRankPos(temp.toBos), temp.san === 'O-O-O' ? 0 : 7]);
          to_bos = Ic.toBos([Ic.getRankPos(temp.toBos), temp.san === 'O-O-O' ? 3 : 5]);
          piece_class = Ic.toClassName(Ic.toAbsVal('r') * Ic.getSign(temp.colorMoved === 'b'));
          piece_class = piece_class ? ' ic_' + piece_class : '';

          if (is_reversed) {
            _animatePiece(to_bos, from_bos, piece_class);
          } else {
            _animatePiece(from_bos, to_bos, piece_class);
          }
        }
      }
    }

    function _refreshPieceClasses() {
      var i, j, that, reset_class, current_square, square_class, square_elm;

      that = this;

      for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
          reset_class = (i + j) % 2 ? 'ic_bs' : 'ic_ws';
          current_square = that.getSquare(that.isRotated ? [7 - i, 7 - j] : [i, j]);
          square_class = current_square.className;
          square_class = square_class ? ' ic_' + square_class : '';

          square_elm = document.getElementById('ic_ui_' + current_square.bos);
          square_elm.className = reset_class;
          square_elm.innerHTML = "<div class='" + ('ic_piece_holder' + square_class) + "'></div>";
        }
      }

      if (_CFG.highlightChecks && that.isCheck) {
        document.getElementById('ic_ui_' + that[that.activeColor].kingBos).classList.add('ic_incheck');
      }
    }

    function _refreshMaterialDifference() {
      var i, j, len, that, temp, current_side, img_obj, matdiff_html;

      that = this;

      if (document.getElementById('ic_ui_material_diff')) {
        matdiff_html = '';

        img_obj = {
          chessFont: _chessFontHelper(_CFG.chessFont),
          width: 20,
          height: 20,
        };

        for (i = 0; i < 2; i++) {
          current_side = that.isRotated === !i ? that.w : that.b;
          matdiff_html += i ? '<hr>' : '';
          temp = '';

          for (j = 0, len = current_side.materialDiff.length; j < len; j++) {
            temp +=
              "<img src='" +
              ('./css/images/chess-fonts/' +
                img_obj.chessFont +
                '/' +
                Ic.toClassName(current_side.materialDiff[j]) +
                '.png') +
              "' width='" +
              img_obj.width +
              "' height='" +
              img_obj.height +
              "'>";
          }

          matdiff_html += temp || '-';
        }

        document.getElementById('ic_ui_material_diff').innerHTML = matdiff_html;
      }
    }

    function _refreshMoveList() {
      var i, len, that, result_tag_ow, move_list, black_starts, initial_full_move, current_move, new_html;

      that = this;

      if (document.getElementById('ic_ui_move_list')) {
        move_list = that.moveList;
        black_starts = move_list[0].colorToPlay === 'b';

        initial_full_move =
          that.fullMove -
          Math.floor((that.currentMove + black_starts - 1) / 2) +
          (black_starts === !(that.currentMove % 2)) -
          1;

        result_tag_ow = '*';
        new_html = '';

        for (i = 0, len = move_list.length; i < len; i++) {
          if (i) {
            if (that.isPuzzleMode && i > that.currentMove) {
              continue;
            }

            current_move = initial_full_move + Math.floor((i + black_starts - 1) / 2);

            new_html += i !== 1 ? ' ' : '';
            new_html += move_list[i - 1].comment && black_starts === !!(i % 2) ? current_move + '...' : '';
            new_html += black_starts === !(i % 2) ? "<span class='ic_pgn_number'>" + current_move + '. </span>' : '';
            new_html +=
              "<span class='" +
              (i !== that.currentMove ? 'ic_pgn_link' : 'ic_pgn_active') +
              "' data-index='" +
              i +
              "'>" +
              move_list[i].san +
              '</span>';

            if (move_list[i].comment) {
              new_html +=
                "<span class='" +
                (i !== that.currentMove ? 'ic_pgn_comment' : 'ic_pgn_comment_active') +
                "'> " +
                move_list[i].comment +
                '</span>';
            }
          }

          if (move_list[i].moveResult) {
            result_tag_ow = move_list[i].moveResult;
          }
        }

        if (that.manualResult !== '*') {
          result_tag_ow = that.manualResult;
        }

        if (new_html) {
          if (black_starts) {
            new_html = "<span class='ic_pgn_number'>" + initial_full_move + '...</span>' + new_html;
          }

          if (result_tag_ow !== '*') {
            new_html += " <span class='ic_pgn_result'>" + result_tag_ow + '</span>';
          }
        } else {
          if (result_tag_ow !== '*') {
            new_html += "<span class='ic_pgn_result'>" + result_tag_ow + '</span>';
          }
        }

        if (that.isPuzzleMode) {
          if (that.currentMove === that.moveList.length - 1) {
            new_html += "<br><span class='ic_pgn_complete'>Puzzle complete!</span>";
          } else {
            new_html += " *<br><span class='ic_pgn_find'>Find the best move.</span>";
          }
        }

        new_html = new_html || '-';

        document.getElementById('ic_ui_move_list').innerHTML = new_html;
      }
    }

    function _refreshDebug() {
      var i, j, len, len2, that, temp, temp2, current_square, current_row, new_html;

      that = this;

      if (document.getElementById('ic_ui_debug')) {
        new_html = '<ul>';
        new_html += '<li><strong>Selected board:</strong> <span>' + that.boardName + '</span></li>';
        new_html += '<li><strong>Is rotated?:</strong> <span>' + that.isRotated + '</span></li>';
        new_html += '<li><strong>Number of checks:</strong> <span>' + that.checks + '</span></li>';
        new_html += '<li><strong>Is check?:</strong> <span>' + that.isCheck + '</span></li>';
        new_html += '<li><strong>Is checkmate?:</strong> <span>' + that.isCheckmate + '</span></li>';
        new_html += '<li><strong>Is stalemate?:</strong> <span>' + that.isStalemate + '</span></li>';
        new_html += '<li><strong>Is threefold repetition?:</strong> <span>' + that.isThreefold + '</span></li>';
        new_html +=
          '<li><strong>Is insufficient material?:</strong> <span>' + that.isInsufficientMaterial + '</span></li>';
        new_html += '<li><strong>Is fifty-move rule?:</strong> <span>' + that.isFiftyMove + '</span></li>';
        new_html += '<li><strong>In draw?:</strong> <span>' + that.inDraw + '</span></li>';
        new_html += '<li><strong>En Passant square:</strong> <span>' + (that.enPassantBos || '-') + '</span></li>';
        new_html += '<li><strong>Active color:</strong> <span>' + that.activeColor + '</span></li>';
        new_html += '<li><strong>Non active color:</strong> <span>' + that.nonActiveColor + '</span></li>';
        new_html += '<li>';
        new_html += '<strong>W</strong>';
        new_html += '<ul>';
        new_html += '<li><strong>king square:</strong> <span>' + that.w.kingBos + '</span></li>';
        new_html +=
          '<li><strong>castling rights:</strong> <span>' +
          (Ic.utilityMisc.castlingChars(that.w.castling).toUpperCase() || '-') +
          '</span></li>';
        new_html +=
          '<li><strong>material difference:</strong> <span>[' + that.w.materialDiff.join(', ') + ']</span></li>';
        new_html += '</ul>';
        new_html += '</li>';
        new_html += '<li>';
        new_html += '<strong>B</strong>';
        new_html += '<ul>';
        new_html += '<li><strong>king square:</strong> <span>' + that.b.kingBos + '</span></li>';
        new_html +=
          '<li><strong>castling rights:</strong> <span>' +
          (Ic.utilityMisc.castlingChars(that.b.castling) || '-') +
          '</span></li>';
        new_html +=
          '<li><strong>material difference:</strong> <span>[' + that.b.materialDiff.join(', ') + ']</span></li>';
        new_html += '</ul>';
        new_html += '</li>';
        new_html += '<li><strong>Half moves:</strong> <span>' + that.halfMove + '</span></li>';
        new_html += '<li><strong>Full moves:</strong> <span>' + that.fullMove + '</span></li>';
        new_html += '<li><strong>Current move:</strong> <span>' + that.currentMove + '</span></li>';
        new_html +=
          '<li><strong>Promote to:</strong> <span>' +
          Ic.toBal(that.promoteTo * that[that.activeColor].sign) +
          '</span></li>';
        new_html += '<li><strong>Manual result:</strong> <span>' + that.manualResult + '</span></li>';
        new_html += '<li>';
        new_html += '<strong>Squares</strong>';
        new_html += '<ul>';

        for (i = 0; i < 8; i++) {
          current_row = [];

          for (j = 0; j < 8; j++) {
            current_square = that.getSquare([i, j]);
            temp = '' + current_square.val;

            if (temp.length === 1) {
              temp = ' ' + temp;
            }

            current_row.push(
              "<span title='" +
                (current_square.bos.toUpperCase() + ' = ' + (current_square.className || 'empty')) +
                "'>" +
                temp +
                '</span>'
            );
          }

          new_html += '<li><strong>A' + (8 - i) + '-H' + (8 - i) + ':</strong> ' + current_row.join(' | ') + '</li>';
        }

        new_html += '</ul>';
        new_html += '</li>';
        new_html += '<li><strong>FEN:</strong> <span>' + that.fen + '</span></li>';
        temp = '';

        for (i = 0, len = that.legalUci.length; i < len; i++) {
          temp += (i ? ', ' : '') + (!i || i % 5 ? '' : '<br>') + that.legalUci[i];
        }

        new_html += '<li><strong>Legal UCI:</strong> <span>[' + temp + ']</span></li>';
        new_html += '<li>';
        new_html += '<strong>Legal UCI tree</strong>';
        new_html += '<ul>';
        temp = Object.keys(that.legalUciTree);

        for (i = 0, len = temp.length; i < len; i++) {
          new_html += '<li><strong>' + temp[i] + ':</strong> [' + that.legalUciTree[temp[i]].join(', ') + ']</li>';
        }

        new_html += '</ul>';
        new_html += '</li>';
        new_html += '<li>';
        new_html += '<strong>Legal reversed tree</strong>';
        new_html += '<ul>';

        temp = Object.keys(that.legalRevTree);

        for (i = 0, len = temp.length; i < len; i++) {
          new_html += '<li><strong>' + temp[i] + ':</strong>';
          new_html += ' {';
          temp2 = Object.keys(that.legalRevTree[temp[i]]);

          for (j = 0, len2 = temp2.length; j < len2; j++) {
            new_html +=
              (j ? ', ' : '') +
              '<strong>' +
              temp2[j] +
              ':</strong> [' +
              that.legalRevTree[temp[i]][temp2[j]].join(', ') +
              ']';
          }

          new_html += '}</li>';
        }

        new_html += '</ul>';
        new_html += '</li>';
        new_html += '<li><strong>Version:</strong> <span>[Ic_v' + Ic.version + '] [IcUi_v' + _VERSION + ']</span></li>';
        new_html += '</ul>';

        document.getElementById('ic_ui_debug').innerHTML = new_html;
      }
    }

    //!---------------- ic ui

    function setCfg(key, val) {
      var board, rtn_changed;

      rtn_changed = false;
      key = String(key);

      if (val !== _CFG[key]) {
        rtn_changed = true;
        _CFG[key] = val;
        board = Ic.getBoard(_BOARD_NAME);

        if (board !== null) {
          refreshUi.apply(board, [0, false]);
        }
      }

      return rtn_changed;
    }

    function pushAlert(alert_msg, class_name) {
      _pushAlertHelper(alert_msg, true, class_name);
      _pushAlertHelper(alert_msg, false, class_name);
    }

    //!---------------- board (this=apply)

    function refreshUi(animation_type, play_sounds) {
      var that, temp, board_elm;

      that = this;

      if (!that.isHidden) {
        _BOARD_NAME = that.boardName;

        Ic.utilityMisc.consoleLog('[refreshUi]: refreshed UI board = ' + that.boardName);

        _cancelSelected();
        _cancelDragging();
        _cancelAnimations();
        _abortPromotionMode();
        _bindOnce();

        board_elm = document.getElementById('ic_ui_board');

        if (board_elm) {
          if (
            !board_elm.innerHTML ||
            board_elm.classList.contains('ic_rotated') !== that.isRotated ||
            board_elm.classList.contains('ic_unlabeled') === _CFG.boardLabels ||
            board_elm.classList.contains('ic_frozen') === _CFG.boardInteractions ||
            !board_elm.classList.contains('ic_font_' + _chessFontHelper(_CFG.chessFont)) ||
            !board_elm.classList.contains('ic_theme_' + _chessThemeHelper(_CFG.chessTheme)) ||
            !!(document.getElementById('ic_ui_sound_move') || document.getElementById('ic_ui_sound_capture')) !==
              _CFG.soundEffects
          ) {
            _refreshTable(that.isRotated, _CFG.boardLabels, _CFG.boardInteractions);
          }
        }

        document.getElementById('ic_ui_fen').value = that.fen;
        document.getElementById('ic_ui_promote').value = that.promoteTo;

        _refreshDebug.apply(that, []);
        _refreshBoardTabs(that.boardName);
        _refreshMaterialDifference.apply(that, []);
        _refreshMoveList.apply(that, []);

        document
          .querySelectorAll(
            '#ic_ui_nav_first.ic_disabled, #ic_ui_nav_previous.ic_disabled, #ic_ui_nav_next.ic_disabled, #ic_ui_nav_last.ic_disabled'
          )
          .forEach(function (elm) {
            elm.classList.remove('ic_disabled');
          });

        if (that.isPuzzleMode || !that.currentMove) {
          document.querySelectorAll('#ic_ui_nav_first, #ic_ui_nav_previous').forEach(function (elm) {
            elm.classList.add('ic_disabled');
          });
        }

        if (that.isPuzzleMode || that.currentMove === that.moveList.length - 1) {
          document.querySelectorAll('#ic_ui_nav_next, #ic_ui_nav_last').forEach(function (elm) {
            elm.classList.add('ic_disabled');
          });
        }

        if (board_elm) {
          _refreshPieceClasses.apply(that, []);
          _refreshActiveDot(that[that.activeColor].isBlack);

          if (_CFG.pieceAnimations && animation_type) {
            _animateCaller.apply(that, [animation_type < 0]);
          }

          if (_CFG.soundEffects && play_sounds) {
            temp = that.moveList[that.currentMove].captured ? 'capture' : 'move';
            temp = document.getElementById('ic_ui_sound_' + temp);

            if (temp) {
              temp.pause();
              temp.currentTime = 0;
              temp.play();
            }
          }

          if (_CFG.highlightLastMove && that.currentMove !== 0) {
            document.getElementById('ic_ui_' + that.moveList[that.currentMove].fromBos).classList.add('ic_lastmove');
            document.getElementById('ic_ui_' + that.moveList[that.currentMove].toBos).classList.add('ic_lastmove');
          }

          if (animation_type) {
            _MARKERS_LIST = [];
          }

          _refreshMarkers();
        }
      }
    }

    return Ic !== null
      ? {
          version: _VERSION,
          setCfg: setCfg,
          pushAlert: pushAlert,
          refreshUi: refreshUi,
        }
      : null;
  })();

  if (windw !== null) {
    if (!windw.IcUi) {
      windw.IcUi = IcUi;
    }
  }
})(typeof window !== 'undefined' ? window : null, typeof Ic !== 'undefined' ? Ic : null);
