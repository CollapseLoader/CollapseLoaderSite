function preloader() {
    getLatestCommit()

    var app = document.getElementById("text")

    var typewriter_line = new Typewriter(app, {
        loop: true,
        delay: 40
    })

    setTimeout(() => {

        document.getElementById("preloader_div").style.opacity = 0

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
    }, 1000)

    setTimeout(() => {
        document.getElementById("preloader_div").remove()
    }, 1200)


}

function returnJSON(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            callback(jsonData);
        }
    };
    
    xhttp.open("GET", url);
    xhttp.send();
}

function getLatestCommit() {
    returnJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits", function(data) {        
        latest_commit = data[0]
    
        var typewriter_line = new Typewriter(document.getElementById("logo_text"), {
            loop: false,
            delay: 40,
            cursor: ''
        })
    
    
        typewriter_line
            .changeDelay(30)
            .typeString('Collapse Loader')
            .changeDelay(40)
            .typeString(` (<a href="${latest_commit['html_url']}" target="_blank">${latest_commit['sha'].slice(0, 7)}</a>)`)
            .start()
    });
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


function downloadLatestRelease() {
    returnJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases/latest", function(data) {
        window.open(data["assets"][0]["browser_download_url"], "_blank")
    });
}
function downloadDev() {
    returnJSON("https://api.github.com/repos/dest4590/CollapseLoader/actions/workflows/main.yml/runs?per_page=1&branch=dev&event=push&status=success", function(artifact_data) {
        returnJSON(artifact_data['workflow_runs'][0]['artifacts_url'], function (data) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", data['artifacts'][0]['archive_download_url']);
            xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
            xhr.setRequestHeader('Authorization', `Bearer ${atob('Z2l0aHViX3BhdF8xMUFUSEVWSVEwdDJuQ1h3VUNKS1pKX29FRzFIaUVBaWdSaVVKT2ZFQXk2TTgxYnB6Q1FqUmVCSHZCMkpYNk9VamxYNklOVTJONVJtcTZQYkRS')}`);
            xhr.responseType = "blob";
            
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var blob = xhr.response;
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');

                    a.href = url;
                    a.download = data['artifacts'][0].name;
                    document.body.appendChild(a);
                    
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a)
                }
            };

            xhr.send();            
        })
    });
}
