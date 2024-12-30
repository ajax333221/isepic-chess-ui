<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>

<h1 align="center">Ic Ui methods</h1>

Isepic Chess UI library `isepic-chess-ui.js` has the following available methods:

<ul>
<li>IcUi.setCfg()</li>
<li>IcUi.pushAlert()</li>
</ul>

#### Table `IcUi.<methods>(...)`:

Function | Parameters | Return | UI refresh? | Description
-------- | ---------- | ------ | ----------- | -----------
**setCfg**(<br>*option*,<br>*value*<br>) | <ul><li>option (String)</li><li>value (mixed types)</li></ul> | Boolean | Yes | Overwrites a configuration option with a new value.<br><br>Valid options are:<ul><li>**chessFont**<ul><li>Default: `"merida" (String)`</li></ul></li><li>**chessTheme**<ul><li>Default: `"wood" (String)`</li></ul></li><li>**boardLabels**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**boardInteractions**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**soundEffects**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**pieceAnimations**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**pieceDragging**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**highlightChecks**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**highlightLastMove**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**highlightLegalMoves**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**highlightSelected**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**scrollNavigation**<ul><li>Default: `true (Boolean)`</li></ul></li><li>**arrowKeysNavigation**<ul><li>Default: `false (Boolean)`</li></ul></li><li>**animationTime**<ul><li>Default: `300 (Number)`</li></ul></li><li>**draggingTime**<ul><li>Default: `50 (Number)`</li></ul></li><li>**scrollingTime**<ul><li>Default: `60 (Number)`</li></ul></li><li>**pushAlertsTime**<ul><li>Default: `5000 (Number)`</li></ul></li></ul><hr>Examples:<ul><li>`IcUi.setCfg("arrowKeysNavigation", true)`</li><li>`IcUi.setCfg("soundEffects", false)`</li></ul>
**pushAlert**(<br>*message*,<br>*className*<br>) | <ul><li>:eight_pointed_black_star:message (String)</li><li>:eight_pointed_black_star:className (String)</li></ul><hr>:eight_pointed_black_star:Optional Parameter | - | No | Pushes an alert directly to **#ic_ui_push_alerts_top** and **#ic_ui_push_alerts_bottom** components.<br><br>Valid options for **className** are:<ul><li>"light" (default)</li><li>"dark"</li><li>"success"</li><li>"warning"</li><li>"error"</li></ul><br><br>:zap:**Tip:** to both push the alert to the UI and to the console (`console.log()`, `console.warn()` or `console.error()` depending on the **className**) you can use `Ic.utilityMisc.consoleLog(...)` instead, just make sure **silent mode** is not on (you can disable it with `Ic.setSilentMode(false)`)<hr>Examples:<ul><li>`IcUi.pushAlert("Simple alert")`</li><li>`IcUi.pushAlert("[Header]: simple alert with header")`</li><li>`IcUi.pushAlert("Alert with light style", "light")`</li><li>`IcUi.pushAlert("Alert with dark style", "dark")`</li><li>`IcUi.pushAlert("Alert with success style", "success")`</li><li>`IcUi.pushAlert("Alert with warning style", "warning")`</li><li>`IcUi.pushAlert("Alert with error style", "error")`</li></ul>

<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>
