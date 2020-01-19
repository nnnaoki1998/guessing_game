$(function () {
    var digits = 3;
    function setNum(place, checkNum) {
        var num;
        var funcEnd = true;
        while (true) {
            num = Math.floor(Math.random() * 10);
            for (var i = 0; i < comHaveNum.length; i++) {
                if (place != i && num == checkNum[i]) {
                    funcEnd = false;
                    break;
                } else {
                    funcEnd = true;
                }
            }
            if (funcEnd) {
                break;
            }
        }
        return num;
    }

    // コンピュータが持つ数字を生成
    var comHaveNum = [];
    for (var i = 0; i < digits; i++) {
        comHaveNum[i] = setNum(i, comHaveNum);
    }

    var usrHaveNum = [];
    var comAnsNum = [];
    var comAnswer = '';
    var dontUseBox = [];
    var dontUse = '';
    var dontUseNumBox = [];
    var eachDontUseNumBox = [[], [], [], [], [], [], [], [], [], []];
    var numHistory = [];
    var comAnswerTimes = 1;
    var roop = true;
    var doPush = true;

    function push_permutation(q, ans) {
        if (q.length <= 1) {
            doPush = true;
            for (var i; i < dontUseBox.length; i++) {
                if (dontUseBox[i] == ans + q) {
                    doPush = false;
                    break;
                }
            }
            if (doPush) {
                dontUseBox.push(ans + q);
            }
        }
        else {
            for (var i = 0; i < q.length; i++) {
                push_permutation(q.substring(0, i) + q.substring(i + 1), ans + q.charAt(i));
            }
        }
    }

    function machCount(num1, num2) {
        var count = 0;
        for (var i = 0; i < digits; i++) {
            for (var j = 0; j < digits; j++) {
                if (num1.slice(i, i + 1) == num2.slice(j, j + 1)) {
                    count++;
                }
            }
        }
        return count;
    }
    // ユーザが持つ数字を生成
    $('#decision_btn').click(function () {
        var usrNum = $('#input_usr_num').val();
        if (!usrNum.match('^[0-9]{' + digits + '}$')) {
            alert(digits + '桁の異なる半角数字を入力してくだい');
            return;
        }
        for (var i = 0; i < digits; i++) {
            usrHaveNum[i] = Number(usrNum.slice(i, i + 1));
        }
        for (var i = 0; i < digits; i++) {
            for (var j = 0; j < digits; j++) {
                if (i != j && usrHaveNum[i] == usrHaveNum[j]) {
                    alert(digits + '桁の異なる半角数字を入力してくだい');
                    return;
                }
            }
        }
        dontUseBox = [];
        dontUseNumBox = [];
        eachDontUseNumBox = [[], [], [], [], [], [], [], [], [], []];
        numHistory = [];
        $('#com_answer_history').empty();
        while (true) {
            // 解答の生成
            roop = true;
            while (roop) {
                comAnswer = '';
                roop = false;
                for (var i = 0; i < digits; i++) {
                    comAnsNum[i] = -1;
                }
                for (var i = 0; i < digits; i++) {
                    comAnsNum[i] = setNum(i, comAnsNum);
                    comAnswer += String(comAnsNum[i]);
                }
                for (var i = 0; i < digits; i++) {
                    for (var j = 0; j < dontUseNumBox.length; j++) {
                        if (comAnsNum[i] == dontUseNumBox[j]) {
                            roop = true;
                            break;
                        }
                    }
                }
                for (var i = 0; i < dontUseBox.length; i++) {
                    if (dontUseBox[i] == comAnswer) {
                        roop = true;
                        break;
                    }
                }
                for (var i = 0; i < digits; i++) {
                    for (var j = 0; j < eachDontUseNumBox[i].length; j++) {
                        if (comAnsNum[i] == eachDontUseNumBox[i][j]) {
                            roop = true;
                            break;
                        }
                    }
                }
                for (var i = 0; i < numHistory.length; i++) {
                    if (machCount(comAnswer, numHistory[i][0]) != (numHistory[i][1] + numHistory[i][2])) {
                        roop = true;
                        break;
                    }
                }
            }
            // 解凍後の処理
            var eatCount = eatCountCheck(usrHaveNum, comAnsNum);
            var biteCount = biteCountCheck(usrHaveNum, comAnsNum);
            numHistory.push([comAnswer, eatCount, biteCount]);
            var result = eatCount + 'EAT - ' + biteCount + 'BITE';
            $('#com_answer_history').removeClass('hide');
            $('#com_answer_history').prepend('<tr><td>' + comAnswerTimes + '回目</td><td>' + comAnswer + '</td><td>' + result + '</td></tr>');
            doPush = true;
            if (eatCount == 3) {
                break;
            } else {
                if (eatCount == 0 && biteCount == 0) {
                    for (var i = 0; i < digits; i++) {
                        doPush = true;
                        for (var j = 0; j < dontUseNumBox.length; j++) {
                            if (comAnsNum[i] == dontUseNumBox[j]) {
                                doPush = false;
                                break;
                            }
                        }
                        if (doPush) {
                            dontUseNumBox.push(comAnsNum[i]);
                        }
                    }
                } else {
                    for (var i = 0; i < digits; i++) {
                        dontUse += String(comAnsNum[i]);
                    }
                    dontUseBox.push(dontUse);
                    if (eatCount + biteCount == digits) {
                        for (var i = 0; i < 10; i++) {
                            doPush = true;
                            for (var j = 0; j < digits; j++) {
                                if (i == comAnsNum[j]) {
                                    doPush = false;
                                    break;
                                }
                            }
                            if (doPush) {
                                dontUseNumBox.push(i);
                            }
                        }
                    } else {
                        push_permutation(dontUse, '');
                    }
                    dontUse = '';
                    if (eatCount == 0) {
                        for (var i = 0; i < digits; i++) {
                            doPush = true;
                            for (var j = 0; j < eachDontUseNumBox[i].length; j++) {
                                if (eachDontUseNumBox[i][j] == comAnsNum[i]) {
                                    doPush = false;
                                    break;
                                }
                            }
                            if (doPush) {
                                eachDontUseNumBox[i][eachDontUseNumBox[i].length] = comAnsNum[i];
                            }
                        }
                    }
                    if (biteCount == 0) {
                        for (var i = 0; i < digits; i++) {
                            for (var j = 0; j < digits; j++) {
                                if (i != j) {
                                    doPush = true;
                                    for (var k = 0; k < eachDontUseNumBox[i].length; k++) {
                                        if (eachDontUseNumBox[j][k] == comAnsNum[i]) {
                                            doPush = false;
                                            break;
                                        }
                                    }
                                    if (doPush) {
                                        eachDontUseNumBox[j][eachDontUseNumBox[j].length] = comAnsNum[i];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            comAnswerTimes++;
        }
        comAnswerTimes = 1;
    });

    function eatCountCheck(haveNum, ansNum) {
        var eatCount = 0;
        for (var i = 0; i < digits; i++) {
            if (haveNum[i] == ansNum[i]) {
                eatCount++;
            }
        }
        return eatCount;
    }

    function biteCountCheck(haveNum, ansNum) {
        var biteCount = 0;
        for (var i = 0; i < digits; i++) {
            for (var j = 0; j < digits; j++) {
                if (i != j && haveNum[i] == ansNum[j]) {
                    biteCount++;
                }
            }
        }
        return biteCount;
    }

    // ユーザの解答
    var usrAnswerTimes = 1;

    $('#answer_btn').click(function () {
        var usrAnswer = $('#input_answer').val();
        if (!usrAnswer.match('^[0-9]{' + digits + '}$')) {
            alert(digits + '桁の異なる半角数字で解答してくだい');
            return;
        }
        var usrAnsNum = [];
        for (var i = 0; i < digits; i++) {
            usrAnsNum[i] = Number(usrAnswer.slice(i, i + 1));
        }
        for (var i = 0; i < digits; i++) {
            for (var j = 0; j < digits; j++) {
                if (i != j && usrAnsNum[i] == usrAnsNum[j]) {
                    alert(digits + '桁の異なる半角数字で解答してくだい');
                    return;
                }
            }
        }
        var eatCount = eatCountCheck(comHaveNum, usrAnsNum);
        var biteCount = biteCountCheck(comHaveNum, usrAnsNum);
        var result = eatCount + 'EAT - ' + biteCount + 'BITE';
        $('#usr_answer_history').removeClass('hide');
        $('#usr_answer_history').prepend('<tr><td>' + usrAnswerTimes + '回目</td><td>' + usrAnswer + '</td><td>' + result + '</td></tr>');
        $('#input_answer').val('');
        usrAnswerTimes++;
    });
});