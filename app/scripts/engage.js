String.prototype.shuffle = function () {
  var a = this.split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  // return a.join("");
  return a;
}

$(window).load(function () {
  //Initialize Text Twist

  var engageApp = function (data) {
    var stateMap = {
      currShuf: "",
      answerFillIndex: 0,
      buttonFillIndex: 0,
      dt: data
    };

    var challenges = stateMap.dt.challenges[1],
      scram = challenges.word.shuffle(),
      answer = [],
      blank = "", // Answer
      buttons = "", // Clickable letters
      textLen = scram.length;

    // Method Start -- genLetters
    // Purpose -- Generate box for each letter depending on mode (i.e, buttons, blank)
    var genLetters = function (mode) {
      var html = "",
        mode = mode || "blank";
      html += "<ul class='" + mode + "'>";

      var refArray = (mode == "buttons") ? scram : answer;

      for (var mb in refArray) {
        html += "<li><a href='#' class='" + mode + "' data-index='" + mb + "' data-text='" + refArray[mb] + "'>" + ((refArray[mb] != "_") ? refArray[mb] : "") + "</a></li>";
      }

      html += "</ul>";

      return html;
    };
    // Method End -- genLetters

    var generateElements = function () {
      $('.blank-answer').html(genLetters());
      $('.btn-answer').html(genLetters('buttons'));
      bind();
    };

    var correctAnswer = function () {
      var text = "<h1 class='success'>Good Job!</h1>";
      $('.btn-answer').html(text);
    };

    // Method Start -- bind
    // Purpose -- Bind element features
    var bind = function () {

      $('a.buttons').click(function () {
        var buttonElem = $(this);
        var answerElem = $('a.blank[data-text="_"]').first();
        var index = $('a.buttons').index(buttonElem);
        var text = buttonElem.attr('data-text');

        if (buttonElem.attr('data-text') != "_") {
          // console.log('button clicked');

          buttonElem.attr('data-text', '_').html('');
          answerElem.attr('data-text', text).html(text)

          answer.splice(answer.indexOf("_"), 1, text);
          scram.splice(index, 1, '_');

          // for(var a in answer){
          // 	if(answer[a] == "_"){
          // 		answer.splice(a, 1, text);
          // generateElements();
          // 		break;
          // 	}
          // }

          if (answer.indexOf("_") == -1) {
            var word = challenges.word;
            var ans = answer.join("");
            if (word == ans) {
              // Display good job
              correctAnswer();
            } else {
              // display red
              $('a.blank').addClass('incorrect');
            }
            // console.log(word, ans);
          }

        }

        // console.log('button --->', answer, scram);
      });

      $('a.blank').click(function () {
        var answerElem = $(this);
        var buttonElem = $('a.buttons[data-text="_"]').first();
        var index = $('a.blank').index(answerElem);
        var text = answerElem.attr('data-text');

        if (answerElem.attr('data-text') != "_") {
          // console.log('blank clicked');
          answerElem.attr('data-text', '_').html('');
          buttonElem.attr('data-text', text).html(text)
            // for(var a in scram){
            // 	if(scram[a] == "_"){
          scram.splice(scram.indexOf("_"), 1, text);
          answer.splice(index, 1, '_');
          // 		generateElements();
          // 		break;
          // 	}
          // }
        }

        $('a.blank').removeClass('incorrect');
        // console.log('blank ----->', answer, scram);
      });

      answerFillIndex = answer.indexOf("_");
      buttonFillIndex = scram.indexOf("_");
    };
    // Method End -- bind

    // Create Blank -- Start
    for (var b = 0; b < textLen; b++) {
      answer.push("_"); // Insert blank answer
    }
    // Create Blank -- End

    $('img.ePhoto').attr('src', challenges.photo);
    generateElements();
  };


  $.getJSON("../vendor/engage.json", function (data) {
    engageApp(data);
  });
});