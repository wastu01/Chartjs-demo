// We make use of this 'server' variable to provide the address of the
// REST Janus API. By default, in this example we assume that Janus is
// co-located with the web server hosting the HTML pages but listening
// on a different port (8088, the default for HTTP in Janus), which is
// why we make use of the 'window.location.hostname' base address. Since
// Janus can also do HTTPS, and considering we don't really want to make
// use of HTTP for Janus if your demos are served on HTTPS, we also rely
// on the 'window.location.protocol' prefix to build the variable, in
// particular to also change the port used to contact Janus (8088 for
// HTTP and 8089 for HTTPS, if enabled).
// In case you place Janus behind an Apache frontend (as we did on the
// online demos at http://janus.conf.meetecho.com) you can just use a
// relative path for the variable, e.g.:
//
// 		var server = "/janus";
//
// which will take care of this on its own.
//
//
// If you want to use the WebSockets frontend to Janus, instead, you'll
// have to pass a different kind of address, e.g.:
//
// 		var server = "ws://" + window.location.hostname + ":8188";
//
// Of course this assumes that support for WebSockets has been built in
// when compiling the server. WebSockets support has not been tested
// as much as the REST API, so handle with care!
//
//
// If you have multiple options available, and want to let the library
// autodetect the best way to contact your server (or pool of servers),
// you can also pass an array of servers, e.g., to provide alternative
// means of access (e.g., try WebSockets first and, if that fails, fall
// back to plain HTTP) or just have failover servers:
//
//		var server = [
//			"ws://" + window.location.hostname + ":8188",
//			"/janus"
//		];
//
// This will tell the library to try connecting to each of the servers
// in the presented order. The first working server will be used for
// the whole session.
//
//var server = null;
var server = "/janus";
if (window.location.protocol === 'http:')
    server = "http://" + window.location.hostname + ":8088/janus";
else
    server = "https://" + window.location.hostname + ":8089/janus";

server = "http://211.73.81.36:8088/janus";

// console.log(server);

var janus = null;
var ping_times = {};
var rx_ping_times = {};
var total_ping_time = 0;
var total_jitter = 0;
var last_ping_time = 0;
var textroom = null;
var hovering = false;
var last_hover_time = 0;
var ping_to = null;
var ping_interval = 2000; //打 Ping 頻率
var pings_sent = 0;
var pings_received = 0;
var opaqueId = "pingtest-" + Janus.randomString(12); // 亂數生成 text
var NUM_MOVING_AVERAGE = 15; 

var EXCELLENT_JITTER = 50;
var GOOD_JITTER = 100;
var OK_JITTER = 150;

var meter = null; // optional canvas to draw quality meter

var myroom = new Date().getTime() % 10000000;
var myusername = Janus.randomString(12);
var myid = Janus.randomString(12);
var transactions = {}

$(document).ready(function () {

    //原專案圖表互動事件
    //當 user 滑鼠滑到圖表的區塊 (id=meter) 
    //才會更新原始(三角形)的圖表


    $('#meter').on('mouseover', function () {
        hovering = true;
        last_hover_time = performance.now();
        //console.log(last_hover_time);
    });

    $('#meter').on('mouseout', function () {
        hovering = false;
    });
    if ($('#meter').length > 0) {
        meter = $('#meter')[0].getContext('2d');

    }

    start_janus();
});

function start_janus() {
    // Initialize the library (all console debuggers enabled)
    Janus.init({
        debug: ["debug"], callback: function () {
            // debug: "all"，瀏覽器 console 可看到 Janus.log 輸出所有訊息
            $('#start').one('click', function () {
                start_pings();
                //後續可開發項目
                //點擊按鈕後才顯示圖表功能
            });
        }
    });
}

function start_pings() {
    //移除點擊功能
    $(this).attr('disabled', true).unbind('click');
    // Make sure the browser supports WebRTC
    if (!Janus.isWebrtcSupported()) {
        bootbox.alert("您的瀏覽器不支持 WebRTC... ");
        return;
    }
    // Create session
    janus = new Janus(
        {
            server: server,
            success: function () {
                // Attach to text room plugin
                janus.attach(
                    {
                        plugin: "janus.plugin.textroom",
                        opaqueId: opaqueId,
                        dataChannelOptions: { ordered: false, maxRetransmits: 0 },
                        success: function (pluginHandle) {
                            textroom = pluginHandle;
                            Janus.log("Plugin attached! (" + textroom.getPlugin() + ", id=" + textroom.getId() + ")");
                            // Setup the DataChannel
                            var body = { "request": "setup" };
                            Janus.debug("Sending message (" + JSON.stringify(body) + ")");
                            textroom.send({ "message": body });
                            setup_ping();
                        },
                        error: function (error) {
                            console.error("  -- Error attaching plugin...", error);
                            bootbox.alert("Error attaching plugin... " + error);
                        },
                        webrtcState: function (on) {
                            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                            if ($("#videoleft").length > 0) {
                                $("#videoleft").parent().unblock();
                            }
                        },
                        onmessage: function (msg, jsep) {
                            Janus.debug(" ::: Got a message :::");
                            Janus.debug(msg);
                            if (msg["error"] !== undefined && msg["error"] !== null) {
                                bootbox.alert(msg["error"]);
                            }
                            if (jsep !== undefined && jsep !== null) {
                                // Answer
                                textroom.createAnswer(
                                    {
                                        jsep: jsep,
                                        media: { audio: false, video: false, data: true },	// We only use datachannels
                                        success: function (jsep) {
                                            Janus.debug("Got SDP!");
                                            Janus.debug(jsep);
                                            var body = { "request": "ack" };
                                            textroom.send({ "message": body, "jsep": jsep });
                                        },
                                        error: function (error) {
                                            Janus.error("WebRTC error:", error);
                                            bootbox.alert("WebRTC error... " + JSON.stringify(error));
                                        }
                                    });
                            }
                        },
                        ondataopen: function (data) {
                            Janus.log("The DataChannel is available!");
                            // Prompt for a display name to join the default room
                            var m = { "request": "exists", "room": myroom };
                            textroom.send({ "message": m, "success": reply_exists });
                        },
                        ondata: function (data) {
                            Janus.debug("We got data from the DataChannel! " + data);
                            //~ $('#datarecv').val(data);
                            var json = JSON.parse(data);
                            var transaction = json["transaction"];
                            if (transactions[transaction]) {
                                // Someone was waiting for this
                                transactions[transaction](json);
                                delete transactions[transaction];
                                return;
                            }
                            var what = json["textroom"];
                            if (what === "message") {
                                var msg = json["text"];
                                received_ping(msg);
                                //第幾筆 Ping received 數量
                                console.log(msg);

                            } else if (what === "destroyed") {
                                if (json["room"] !== myroom)
                                    return;
                                // Room was destroyed, goodbye!
                                Janus.warn("The room has been destroyed!");
                                bootbox.alert("The room has been destroyed", function () {
                                    //window.location.reload();
                                    //請用戶自行重整頁面
                                });
                            }
                        },
                        oncleanup: function () {
                            Janus.log(" ::: Got a cleanup notification :::");
                            $('#datasend').attr('disabled', true);
                        }
                    });
            },
            error: function (error) {
                Janus.error(error);
                bootbox.alert(error, function () {
                    window.location.reload();
                    //請用戶自行重整頁面
                });
                // error錯誤訊息，並重整頁面
            },
            destroyed: function () {
                // window.location.reload();
                //請用戶自行重整頁面
            }
        });
}

function received_ping(msg) {

    var t2 = performance.now(); //收到 ping 的當下精準時間
    rx_ping_times[pings_received] = t2; //紀錄每組 ping 收到的 時間
    ++pings_received;
    console.log('收到第' + pings_received + '次的 Ping，時間為' + t2);

    var t1 = ping_times[msg];
    if (t1) {
        if (0 != last_ping_time) {
            total_jitter += Math.abs(last_ping_time - (t2 - t1));
            var avg_jitter = total_jitter / (pings_received - 1);
            $('#average_jitter').html(avg_jitter.toFixed(0));
        }
        last_ping_time = t2 - t1;
        total_ping_time += last_ping_time;
        console.log('最新一次 Ping RTT 時間：' + last_ping_time);
        //console.log(total_ping_time);

    }
    var avg = total_ping_time / pings_received;
    $('#chatroom').append("<p>發送: " + pings_sent);
    $('#chatroom').append("<p>獲得: " + pings_received);
    var packet_loss = (pings_sent - pings_received) / pings_sent * 100;
    $('#pings_sent').html(pings_sent); //發出多少封包
    $('#average_ping_time').html(avg.toFixed(0));
    $('#pings_received').html(pings_received);
    $('#packet_loss').html(packet_loss.toFixed(0));

    // calc_moving_average();專案本來的圖表計算函式

    updateChartData(pings_received, avg, last_ping_time);

}

function updateChartData(label, avgPingTime, lastPingTime) {
    if (typeof updateChart === 'function') {
        updateChart(label, avgPingTime, lastPingTime);
    }
}


function calc_moving_average() {
    if (pings_sent > NUM_MOVING_AVERAGE) {
        var packets_lost = 0;
        var tot_jitter = 0;
        var tot_ping = 0;
        var last_ping = 0;
        var pings_got = 0;

        // ignore very last ping sent, in case we haven't received a reply yet
        for (var i = pings_sent - NUM_MOVING_AVERAGE - 1; i < pings_sent - 1; ++i) {
            if (!rx_ping_times[i]) {
                ++packets_lost;
            }
            else {
                ++pings_got;

                var ping = rx_ping_times[i] - ping_times[i];
                if (last_ping == 0) {
                    if (i > 0 && rx_ping_times[i - 1]) {
                        last_ping = rx_ping_times[i - 1] - ping_times[i - 1];
                    }
                    else {
                        last_ping = ping;
                    }
                }
                tot_ping += ping;
                var jitter = Math.abs(ping - last_ping);
                tot_jitter += jitter;
                last_ping = ping;
            }
        }

        var avg_ping = 0;
        var avg_jitter = 0;
        if (pings_got > 0) {
            avg_ping = tot_ping / pings_got;
            avg_jitter = tot_jitter / pings_got;
        }

        // calculate link quality
        var qual = 0;
        if (avg_jitter < EXCELLENT_JITTER && packets_lost == 0) {
            qual = 100;
        }
        else if (avg_jitter < GOOD_JITTER && packets_lost == 0) {
            qual = 75;
        }
        else if (avg_jitter < OK_JITTER && packets_lost <= 1) {
            qual = 50;
        }
        else if (packets_lost < NUM_MOVING_AVERAGE / 4) {
            qual = 25;
        }
        else {
            qual = 0;
        }

        if (meter) {
            var m = $('#meter')[0];
            var w = m.width;
            var h = m.height;
            meter.clearRect(0, 0, w, h);
            if (qual >= 50) {
                meter.fillStyle = "rgb(0,255,0)"; // green
            }
            else {
                meter.fillStyle = "rgb(255,0,0)"; // red
            }
            meter.strokeStyle = "rgb(200,200,200)";
            meter.lineWidth = 0;
            // draw main meter
            meter.beginPath();
            meter.moveTo(0, h);
            meter.lineTo(w * qual / 100, h);
            meter.lineTo(w * qual / 100, h - h * qual / 100);
            meter.lineTo(0, h);
            meter.closePath();
            meter.fill();
            meter.stroke();
            meter.beginPath();
            meter.moveTo(w / 4 + 0.5, h);
            meter.lineTo(w / 4 + 0.5, h * 3 / 4);
            if (qual >= 50) {
                meter.moveTo(w / 2 + 0.5, h);
                meter.lineTo(w / 2 + 0.5, h / 2);
                if (qual >= 75) {
                    meter.moveTo(w * 3 / 4 + 0.5, h);
                    meter.lineTo(w * 3 / 4 + 0.5, h / 4);
                }
            }

            meter.closePath();
            meter.stroke();

            var loss = (packets_lost / NUM_MOVING_AVERAGE) * 100;

            var t1 = performance.now();
            if ((!hovering) || (t1 - last_hover_time > 2000)) {
                if (hovering) {
                    last_hover_time = t1;
                    console.log(last_hover_time);
                }

                m.title = "Jitter: " + avg_jitter.toFixed(0) + "ms, ping: " + avg_ping.toFixed(0) + "ms, packet loss: " + loss.toFixed(0) + "%";
                console.log(m);
                console.log(m.title);
            }
        }
    }
}

function reply_exists(msg) {
    if (typeof (msg["exists"]) != 'undefined') {
        var exists = msg["exists"];
        if (exists) {
            registerUsername();
            start_ping();
        }
        else {
            var msg = { "request": "create", "room": myroom };
            textroom.send({ "message": msg, "success": reply_create });
        }
    }
}

function reply_create(msg) {
    registerUsername();
    start_ping();
}

function setup_ping()
//開始 ping
{
    $('#start').removeAttr('disabled').html("Stop").unbind('click')
        .click(function () {
            if (null != ping_to) {
                console.log('點擊取消');
                clearInterval(ping_to);
                ping_to = null;

            }
            // 重置圖表
            if (myChart && typeof myChart.reset === 'function') {
                console.log('重置');
                resetChart();
             }
            
            //$(this).attr('disabled', true);
            //janus.destroy();
            //禁用點擊功能，並終止與 janus 的服務 

            $('#start').html("Start").unbind('click')
                .click(function () {
                    $('#start').html("Start")
                    // resetChart();
                    console.log('重置圖表，重新開始：');
                    setup_ping();
                    start_ping();
                });
        });
}

function start_ping() {
    total_ping_time = 0;
    pings_sent = 0;
    pings_received = 0;
    total_jitter = 0;
    last_ping_time = 0;
    ping_times = {};
    ping_to = setInterval(send_ping, ping_interval);
    console.log('開始計時');
}

function send_ping() {
    var message = {
        textroom: "message",
        transaction: randomString(12),
        ack: false,
        room: myroom,
        text: "" + pings_sent,
    };
    ping_times[pings_sent] = performance.now();

    console.log('送出第' + (pings_sent + 1) + '次的 Ping，時間為' + ping_times[pings_sent]);

    ++pings_sent;

    textroom.data({
        text: JSON.stringify(message),
        error: function (reason) { bootbox.alert(reason); },
        success: function () { $('#datasend').val(''); }
    });
}

function registerUsername() {
    // Try a registration
    var transaction = randomString(12);
    var register = {
        textroom: "join",
        transaction: transaction,
        room: myroom,
        username: myid,
        display: myusername
    };
    transactions[transaction] = function (response) {
        if (response["textroom"] === "error") {
            // Something went wrong
            if (response["error_code"] === 417) {
                // This is a "no such room" error: give a more meaningful description
                bootbox.alert(
                    "<p>Apparently room <code>" + myroom + "</code> (the one this demo uses as a test room) " +
                    "does not exist...</p><p>Do you have an updated <code>janus.plugin.textroom.cfg</code> " +
                    "configuration file? If not, make sure you copy the details of room <code>" + myroom + "</code> " +
                    "from that sample in your current configuration file, then restart Janus and try again."
                );
            } else {
                bootbox.alert(response["error"]);
            }
            return;
        }
        // We're in
    };
    textroom.data({
        text: JSON.stringify(register),
        error: function (reason) {
            bootbox.alert(reason);
        }
    });
}

// Just an helper to generate random usernames
function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
