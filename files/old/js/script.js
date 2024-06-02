async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

async function preloader() {
    if (location.pathname === '/old/') {
        await Promise.all([getDiscordOnline(), getLatestCommit(), getLatestRelease()]);

        const app = document.getElementById("text");
        const typewriter_line = new Typewriter(app, { loop: true, delay: 40 });

        const animationContainer = document.getElementById('container-animation');
        let animation = loadInitialAnimation(animationContainer);

        document.OSName = "Unknown";
        const userAgent = window.navigator.userAgent;
        if (userAgent.includes("Windows")) document.OSName = "Windows";
        if (userAgent.includes("Mac")) document.OSName = "Mac/iOS";
        if (userAgent.includes("X11")) document.OSName = "UNIX";
        if (userAgent.includes("Linux")) document.OSName = "Linux";

        setTimeout(() => {
            document.getElementById("preloader_div").style.opacity = 0;
            typewriter_line
                .typeString("Simple and powerful loader for Minecraft")
                .pauseFor(2000)
                .deleteAll(20)
                .typeString("Click on <strong>Download</strong> button")
                .pauseFor(2500)
                .deleteAll(20)
                .typeString("Join our <strong>Discord</strong> community")
                .pauseFor(2500)
                .start();
        }, 1000);

        setTimeout(() => {
            document.getElementById("preloader_div").remove();
        }, 1200);

        setTimeout(() => {
            animationContainer.style.opacity = 1
            animation.play();
        }, 1000);
    }

    else {
        setTimeout(() => {
            document.getElementById("preloader_div").style.opacity = 0;
        }, 1000);
        setTimeout(() => {
            document.getElementById("preloader_div").remove();
        }, 1200);
    }
}

function loadInitialAnimation(container) {
    return lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: '../files/old/animation/loop.json'
    });
}

async function getLatestCommit() {
    const typewriter_line = new Typewriter(document.getElementById("logo_text"), { loop: false, delay: 40, cursor: '' })
        .changeDelay(30)
        .typeString('Collapse Loader')
        .changeDelay(40);

    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits");
    if (data && data.length > 0) {
        const latest_commit = data[0];
        typewriter_line
            .typeString(` (<a href="${latest_commit.html_url}" target="_blank">${latest_commit.sha.slice(0, 7)}</a>)`)
            .start();
    } else {
        typewriter_line.start();
    }
}

async function getLatestRelease() {
    const data = await fetchJSON('https://api.github.com/repos/dest4590/CollapseLoader/releases');
    if (data && data.length > 0) {
        const releases = data.filter(release => !release.prerelease && !release.draft);
        if (releases.length > 0) {
            const latestRelease = releases[0];
            document.getElementById('download').innerText = `download ${latestRelease.tag_name}`;
        } else {
            console.log('No stable releases found.');
        }
    } else {
        console.log('No releases found.');
    }
}

async function getDiscordOnline() {
    const data = await fetchJSON('https://discord.com/api/guilds/1231330785852653568/widget.json');
    if (data && data.presence_count !== undefined) {
        document.getElementById('discord').innerText = `discord (${data.presence_count} online)`;
    } else {
        console.log('Invalid data received from Discord API.');
    }
}

const player = new Audio();
let blockVideo = false;

function on1337(callback) {
    let input = "";
    const key = "49515155";
    document.addEventListener("keydown", (e) => {
        input += e.keyCode.toString();
        if (input === key) {
            callback();
        }
        if (!key.startsWith(input)) {
            input = e.keyCode.toString();
        }
    });
}

on1337(() => {
    if (!blockVideo) {
        const video = document.getElementById("video");
        video.play();
        setTimeout(() => {
            video.style.opacity = 0.2;
        }, 700);

        document.title = "верисмаумаинд";
        const logo = document.getElementById("logo");
        logo.style.transform = "scale(1.2)";
        logo.style.marginBottom = "3rem";

        player.src = "files/where_is_my_mind.mp3";
        player.play();
        player.volume = 0.5;
        blockVideo = true;
    }
});

function revertChanges() {
    player.pause();
    const logo = document.getElementById("logo");
    logo.style.transform = "scale(1)";
    logo.style.marginBottom = "1rem";
    document.getElementById("video").style.opacity = 0;
    document.title = "CollapseLoader";
}

function alertCompatibility() {
    if (document.OSName !== "Windows") {
        alert("Loader is not supported on Unix or Mac");
    }
}

async function downloadLatestRelease() {
    alertCompatibility();

    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases/latest");
    if (data && data.assets && data.assets.length > 0) {
        window.open(data.assets[0].browser_download_url, "_blank");
    } else {
        console.log('No assets found in the latest release.');
    }
}

async function downloadDev() {
    alertCompatibility();

    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases");
    if (data) {
        const latestPrerelease = data.find(release => release.prerelease);
        if (latestPrerelease && latestPrerelease.assets && latestPrerelease.assets.length > 0) {
            window.open(latestPrerelease.assets[0].browser_download_url, "_blank");
        } else {
            console.log('No pre-release assets found.');
        }
    }
}

function copyCrypto(crypto) {
    const walletAddresses = {
        'ton': "UQAIAReD2gT6KaXyf88qOPiXh8jqL01bPMJ3TVy_S5DriAEe",
        'usdt': "TMnSnK2cCXhppLES4uaMKTXMNhwDBhgAcR"
    };

    const walletAddress = walletAddresses[crypto];
    if (!walletAddress) {
        alert('Invalid cryptocurrency selected');
        return;
    }

    navigator.clipboard.writeText(walletAddress)
        .then(() => {
            alert('Crypto wallet copied to clipboard');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text to clipboard');
        });
}


function switchimg() {
    img = document.getElementById('blank-space')
    svg = document.getElementById('container-animation')

    if (img.style.display == 'none') {
        img.style.display = 'flex'
        svg.style.display = 'none'
    }

    else {
        img.style.display = 'none'
        svg.style.display = 'flex'
    }
}