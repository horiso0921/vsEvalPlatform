// Userの名前とidからoutputファイル名作成
var param = location.search;
var id = decodeURI(param.split('=')[1])

var parDiv = document.getElementById("parent");
parDiv.scrollTo(0, parDiv.scrollHeight);

var dialogues = [];
var evaluation = [];
var index = 0;

function start() {
    var uname = document.getElementById("userName");
    if (uname.value === '') {
        return
    }

    var send_info = {"id": id};
    var name_field = document.getElementById("userNamefield");
    name_field.remove();

    parDiv.appendChild(createProgressBar());
    
    fetch('/start', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(send_info)
    }).then(response => response.json()).then(data => {
        data.forEach(element => {
            dialogues.push(element);
            evaluation.push("None");
        });

        setOneEvalSetElement(index);

        var mainDiv = document.getElementById("main");
        mainDiv.appendChild(createMoveButtonParent([["", ""],["次へ","moveNext();"]]));
        
        updateProgressBar();
    })
}

// Parentに評価セットをつける
// 評価対話と評価ラベルの欄がつく
function setOneEvalSetElement(index) {
    oneEvalSet = dialogues[index];
    var evalField = document.createElement("div");
    evalField.id = "evalField"
    evalField.appendChild(createOneEvalSetElement(oneEvalSet));
    var parDiv = document.getElementById("parent");
    parDiv.appendChild(evalField);

    parDiv.scrollTo(0, evalField.top);
    
}

// 「次へ」ボタンが押された時に動くやつ
// 次へ進める状態なら次の評価セットを出す
function moveNext() {
    
    // 状態を持ってくる
    var isDoneOneSet = saveOneEvalSetResult();
    console.log(index);

    if (isDoneOneSet) {
        // 今あるEvalSetを削除
        document.getElementById("evalField").remove();
        
        // 次のやつを表示
        index += 1;
        setOneEvalSetElement(index)
        
        var moveButton = [["前へ","movePre();"], ["次へ","moveNext();"]]
        if (index == dialogues.length - 1){
            updateMoveButtons([moveButton[0],["", ""],["終わり", "end();"]]);
        } else {
            updateMoveButtons(moveButton);
        }
        
        updateProgressBar();

    } else {
        alert("評価を入力してからしか，次へはいけません");
    }
}

// 終了時に動くやつ
function end() {
    // 何らかの処理
}

// 「前へ」ボタンが押された時に動くやつ
// 前の評価セットを出す
function movePre() {
    
    // 状態を持ってくる
    saveOneEvalSetResult();

    console.log(index)
    // 今あるEvalSetを削除
    document.getElementById("evalField").remove();
    
    // 次のやつを表示
    index-=1;
    setOneEvalSetElement(index)
    var moveButton = [["前へ","movePre();"], ["次へ","moveNext();"]]
    if (index == 0){
        updateMoveButtons([["", ""], moveButton[1]]);
    } else {
        updateMoveButtons(moveButton);
    }

    updateProgressBar();
}

// 現在のラベルの状態を保存する
// 無ラベルならFalseを返す
// ブラウザ上にラベルの状態は保持されている
function saveOneEvalSetResult() {
    var evalRadio = document.getElementsByName('eval');
    var checkValue = '';
    var len = evalRadio.length;
    for (var i = 0; i < len; i++){
        if (evalRadio.item(i).checked){
            checkValue = evalRadio.item(i).value;
        }
    }
    if (checkValue === '') {
        return false
    }
    evaluation[index] = checkValue;
    return true
}

// 進行度を表すバーを作るやつ
function createProgressBar(){
    var para = document.createElement("p");
    para.id = "progressCont";
    
    var progress = document.createElement("progress");
    progress.className = "progress is-primary"
    progress.value = "0";
    progress.max = "100";
    progress.id = "progress"
    
    var div = document.createElement("div");
    div.appendChild(para);
    div.appendChild(progress);

    return div;
}

// 進行度を表すバーを更新するやつ
// indexのところの値を出すので注意（既に終わっている奴ではない）
function updateProgressBar(){
    var progress = document.getElementById("progress");
    progress.value = (index + 1) / dialogues.length * 100;
    var parDiv = document.getElementById("parent");
    var progressCont = document.getElementById("progressCont");
    progressCont.textContent = (index + 1) +  " / " + dialogues.length;
}

// 対話と評価ラベルのセットのelementを作るやつ
// 右と左に対話
// その下にラベルが付く
function createOneEvalSetElement(oneEvalSet){
    var oneSetDiv = document.createElement("div");
    oneSetDiv.id = "oneEvalSet"
            
    oneSetDiv.appendChild(createSystemInfo("所定の質問：「" + oneEvalSet["question"] + "」"))
    
    var twoDialog = document.createElement("div");
    twoDialog.className = "columns"
    twoDialog.appendChild(createHalfColumnDialogueHistory(oneEvalSet["dialogue-a"]));
    twoDialog.appendChild(createHalfColumnDialogueHistory(oneEvalSet["dialogue-b"]));
    
    oneSetDiv.appendChild(twoDialog);
    oneSetDiv.appendChild(createEvalRadio());
    
    return oneSetDiv;
}

// mainの下に置かれる進行するためのボタンを更新するやつ
// eval_metricsは[[label, 表示名],...]とすること
function updateMoveButtons(eval_metrics){
    var moveButton = document.getElementById("moveButtonDiv");
    document.getElementById("moveButtonCol").remove();
    
    moveButton.appendChild(createMoveButtons(eval_metrics));
}

// 進行ボタン作るやつ
function createMoveButtons(eval_metrics){
    
    var div_columns = document.createElement("div");
    div_columns.className = "columns";
    div_columns.id = "moveButtonCol";
    
    eval_metrics.forEach(element => {

        var button = document.createElement("button");
        button.className = "button column is-half";
        button.type = "button";
        button.setAttribute('onclick', element[1]);
        var buttonText = document.createTextNode(element[0]);
        button.appendChild(buttonText);
        
        div_columns.appendChild(button)
    });


    return div_columns
}


// mainの下に置かれる進行するためのボタンを作るところのスペースの中身つくるやつ
function createMoveButtonParent(eval_metrics){
    var div = document.createElement("div");
    div.className = "hero-foot column is-half is-offset-one-quarter";
    div.style = "height: 76px"; 
    div.id = "moveButtonDiv";
    
    div_columns = createMoveButtons(eval_metrics);

    div.appendChild(div_columns);

    return div
}

/* <div class="control">
    <p> 自然に対象質問を行えているのはどちらですか？ </p>
    <label class="radio">
        <input type="radio" name="eval" value="left"> 
        左の対話
    </label>
    <label class="radio">
        <input type="radio" name="eval" value="tie"> 
        どちらでもない
    </label>
    <label class="radio">
        <input type="radio" name="eval" value="right"> 
        右の対話
    </label>
</div> */
function createEvalRadio() {
    var div = document.createElement("div");
    div.className = "column is-10 is-offset-1";
    div.style = "height: 100px"

    var para = document.createElement("Strong");
    para.innerText = "所定の質問を自然に行っているシステムはどちらですか？";
    div.appendChild(para);
    
    var div_columns = document.createElement("div");
    div_columns.className = "columns";

    var eval_metrics = [["left", "左のシステム"], ["tie", "どちらとも言えない"], ["right", "右のシステム"]];
    eval_metrics.forEach(element => {

        var label = document.createElement("label");
        label.className = "radio column is-one-third"
        
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "eval";
        if (evaluation[index] === element[0]){
            input.checked = true;
        } 
        input.value = element[0];
        label.appendChild(input);
        var labelText = document.createTextNode(element[1]);
        label.appendChild(labelText);
        
        div_columns.appendChild(label)
    });

    div.appendChild(div_columns)

    return div
}

function createSystemInfo(text) {
    var article = document.createElement("article");
    article.className = "message column is-10 is-offset-1";

    var div = document.createElement("div");
    div.className = "message-body";
    
    var divText = document.createTextNode(text);
    div.appendChild(divText);

    article.appendChild(div);
    
    return article;
}

function createHalfColumnDialogueHistory(dialogue){

    var contents = document.createElement("div");
    contents.className = "content";
    contents.style = "height: calc(100%-100px); overflow: auto";

    dialogue.forEach(response => {
        talker = response.talker
        data = response.data
        var article = createChatRow(talker, data)
        contents.appendChild(article)
    });
    
    return exchangeHalfColumnContent(contents);
}
function exchangeHalfColumnContent(content) {

    var card_content = document.createElement("div");
    card_content.className = "card-content";
    card_content.appendChild(content);
    
    var card = document.createElement("div");
    card.className = "card";
    card.appendChild(card_content)
    
    var halfColumnContent = document.createElement("div");
    halfColumnContent.className = "column is-half";
    halfColumnContent.appendChild(card)

    return halfColumnContent;
}



function createChatRow(agent, text) {
    var article = document.createElement("article");
    article.className = "media"

    var figure = document.createElement("figure");
    figure.className = "media" + (agent === "User" ? "-right" : agent === "Model" ? "-left" : agent === "Announce" ? "-center" : "");
    figure.style = "margin-bottom: 0;"

    var span = document.createElement("span");
    span.className = "icon is-large";
    var icon = document.createElement("i");
    icon.className = "fas fas fa-2x" + (agent === "User" ? " fa-user " : agent === "Model" ? " fa-robot" : agent === "Announce" ? " fa-info-circle" : "");
    
    var media = document.createElement("div");
    media.className = "media-content" + (agent === "User" ? "-right" : agent === "Model" ? "-left" : agent === "Announce" ? "-center" : "");

    var content = document.createElement("div");
    content.className = "content";

    var para2 = document.createElement("p");
    var paraText = document.createTextNode(text);
    para2.className = "balloon1" + (agent === "User" ? "-right" : agent === "Model" ? "-left" : "")

    // var para1 = document.createElement("p");
    // var strong = document.createElement("strong");
    // strong.innerHTML = (agent === "User" ? "ユーザー" : agent === "Model" ? "システム" : agent === "Announce" ? "" : agent);

    // para1.appendChild(strong);
    // content.appendChild(para1);
    para2.appendChild(paraText);
    content.appendChild(para2);
    media.appendChild(content);

    if (agent === "User") {
        article.appendChild(media);
        span.appendChild(icon);
        figure.appendChild(span);
        article.appendChild(figure);
    } else {
        if (agent != "System") {
            span.appendChild(icon);
            figure.appendChild(span);
        }
        if (agent !== "Instructions") {
            article.appendChild(figure);
        };
        article.appendChild(media);
    }

    return article;
}
