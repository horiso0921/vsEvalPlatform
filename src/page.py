STYLE_SHEET = "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.css"
FONT_AWESOME = "https://use.fontawesome.com/releases/v5.3.1/js/all.js"
with open("../css/page.css", "r") as t:
  CSS = t.read()
with open("../js/page.js", "r") as t:
  JS = t.read()
WEB_HTML = """<html>
    <link rel="stylesheet" href={} />
    <style>
    {}
    </style>
    <script defer src={}></script>
    <head><title> Interactive Run </title></head>
    
    <body>
        <div class="columns" style="height: 100%">
            <div class="column is-10 is-offset-1">
              <section id="main" class="hero is-info has-background-white has-text-grey-dark" style="height: 100%">
                <div id="parent" class="hero-body" style="overflow: auto; height: calc(100% - 76px); padding-top: 1em;">
                  <article class="message is-info" id="Inst">
                    <div class="message-header">
                      <p>対話評価</p>
                    </div>
                    <div class="message-body">
                      <strong>所定の質問を自然に行っているシステムがどちらかを判定していただきます．</strong><br><br>
                      「所定の質問を自然に行っているシステム」とはユーザが所定の質問に自然に答えられるように発話をするシステムを指し，以下の条件を満たします．<br>
                        ・ 所定の質問の前の発話で，所定の質問に関する話題や単語に言及する．<br>
                        ・ 所定の質問がしやすいように，発話ごとに話題を寄せていく．<br>
                        ・ 所定の質問を行っている発話だけで所定の質問を行おうとしない．
                    </div>
                  </article>
                  <div class="field" id="userNamefield">
                    <label class="label">評価者の名前</label>
                    <div class="control is-expanded">
                      <input class="input" type="text" id="userName" placeholder="評価者の名前を入れてください">
                    </div>
                    <p class="control">
                      <button id="respond" type="button" onclick="start();" class="button has-text-white-ter has-background-grey-dark">
                        評価を開始する
                      </button>
                    </p>
                  </div>
                </div>
              </section>
            </div>
        </div>
        <script>
        {}
        </script>
    </style>
    </body>
</html>
"""  # noqa: E501