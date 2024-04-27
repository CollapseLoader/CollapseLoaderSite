function preloader() {
    
    if (location.pathname == '/') {
        getDiscordOnline()
        getLatestCommit()
        
        var app = document.getElementById("text")
        
        var typewriter_line = new Typewriter(app, {
            loop: true,
            delay: 40
        })

        document.OSName = "Unknown";
        if (window.navigator.userAgent.indexOf("Windows")!= -1) document.OSName="Windows";
        if (window.navigator.userAgent.indexOf("Mac")    != -1) document.OSName="Mac/iOS";
        if (window.navigator.userAgent.indexOf("X11")    != -1) document.OSName="UNIX";
        if (window.navigator.userAgent.indexOf("Linux")  != -1) document.OSName="Linux";
    }

    setTimeout(() => {

        document.getElementById("preloader_div").style.opacity = 0
        if (location.pathname == '/') {
            typewriter_line
                .typeString("Simple and powerful loader for minecraft")
                .pauseFor(2000)
                .deleteAll(20)
                .typeString("Click on <strong>Download</strong> button")
                .pauseFor(2500)
                .deleteAll(20)
                .typeString("Join our <strong>Discord</strong> community")
                .pauseFor(2500)
                .start()
        }
    }, 1000)

    setTimeout(() => {
        document.getElementById("preloader_div").remove()
    }, 1200)
}

function returnJSON(url, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var jsonData = JSON.parse(this.responseText);
                callback(jsonData);
            } else {
                callback(false)
            }
        }
    };

    xhttp.open("GET", url);
    xhttp.send();
  
}

function getLatestCommit() {
    var typewriter_line = new Typewriter(document.getElementById("logo_text"), {
        loop: false,
        delay: 40,
        cursor: ''
    })

    typewriter_line
        .changeDelay(30)
        .typeString('Collapse Loader')
        .changeDelay(40)

    returnJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits", function (data) {
        if (data != false) {
            latest_commit = data[0]

            typewriter_line
                .typeString(` (<a href="${latest_commit['html_url']}" target="_blank">${latest_commit['sha'].slice(0, 7)}</a>)`)
                .start()
        }
        else {
            typewriter_line
                .start()
        }
    });
}

function getDiscordOnline() {
    returnJSON('https://discord.com/api/guilds/1231330785852653568/widget.json', function (data) {
        document.getElementById('discord').innerText = `Discord (${data.presence_count} online)`
    })
}


// Easter egg
const player = new Audio()
var blockVideo = false

function on1337(cb) {
    var input = ""
    var key = "49515155"
    document.addEventListener("keydown", function (e) {
        input += ("" + e.keyCode)
        if (input === key) {
            return cb()
        }
        if (!key.indexOf(input)) return
        input = ("" + e.keyCode)
    })
}

on1337(function () {
    if (!blockVideo) {
        document.getElementById("video").play()

        setTimeout(() => {
            document.getElementById("video").style.opacity = 0.2
        }, 700)

        document.title = "верисмаумаинд"
        document.getElementById("logo").style.transform = "scale(1.2)"
        document.getElementById("logo").style.marginBottom = "3rem"


        player.src = "files/where_is_my_mind.mp3"
        player.play()
        player.volume = 0.5
        blockVideo = true
    }
})

function revertChanges() {
    player.pause()
    document.getElementById("logo").style.transform = "scale(1)"
    document.getElementById("logo").style.marginBottom = "1rem"
    document.getElementById("video").style.opacity = 0
    document.title = "CollapseLoader"
}
// ---------

function alertCompatibility() {
    if (document.OSName != "Windows") {
        alert("Loader is not supported on Unix or Mac")
    }
}

function downloadLatestRelease() {
    alertCompatibility()

    returnJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases/latest", function (data) {
        window.open(data["assets"][0]["browser_download_url"], "_blank")
    });
}
function downloadDev() {
    alertCompatibility()
    
    returnJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits/dev", function (data) {
        latest_commit = data

        window.open(`https://cdn.collapseloader.org/builds/CollapseLoader_${latest_commit['sha'].slice(0, 7)}.exe`)
    })
}

// DONATE PAGE $$$

function copyCrypto(crypto) {
    if (crypto == 'ton') {
        navigator.clipboard.writeText("UQAIAReD2gT6KaXyf88qOPiXh8jqL01bPMJ3TVy_S5DriAEe")
    }
    else if (crypto == 'usdt') {
        navigator.clipboard.writeText("TMnSnK2cCXhppLES4uaMKTXMNhwDBhgAcR")
    }

    alert('Crypto wallet copied to clipboard')
}