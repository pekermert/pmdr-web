
//var cd = new (newTimer('cd'));
function newTimer(cd_name,type) {
    if (type == 'SB'){
        var currentTime = 30000;
    }else if(type == 'LB'){
        var currentTime = 180000;
    }else if(type == 'ST'){
        var currentTime = 150000;
    }
    var $countdown,
        incrementTime = 100,

        updateTimer = function() {
            $countdown.html(formatTime(currentTime));
            if (currentTime == 0) {
                $countdown.html('IDLE');
                return;
            }
            currentTime -= incrementTime / 10;
            if (currentTime < 0) currentTime = 0;
        },
        init = function(cd_name) {
            $countdown = $('#'+ cd_name);
            $(cd_name).Timer = $.timer(updateTimer, incrementTime, true);
        };
    $(init(cd_name));
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60);
        //hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2); //+ ":" + hundredths;
}
