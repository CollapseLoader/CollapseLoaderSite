import { CountUp } from '/files/js/libraries/countUp.min.js';
import { Odometer } from '/files/js/libraries/odometer.min.js';

export async function load() {
    document.OSName = "Unknown";
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Windows")) document.OSName = "Windows";
    if (userAgent.includes("Mac")) document.OSName = "Mac/iOS";
    if (userAgent.includes("X11")) document.OSName = "UNIX";
    if (userAgent.includes("Linux")) document.OSName = "Linux";

    const lenis = new Lenis()

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    var countUp = new CountUp('discord-online',
        await getDiscordOnline(),

        {
            plugin: new Odometer({ duration: 1.5, lastDigitDelay: 1 })
        }
    );

    countUp.start();

    getLatestRelease().then(version => {
        document.querySelector('#stable').innerText = `Version: ${version}`
    });

    getLatestCommit().then(commit => {
        document.querySelector('#dev').innerText = `Commit: ${commit}`
    });


    getCodeName().then(codename => {
        document.codename = codename
        document.getElementById('codename').innerText = codename
        fadeInText('codename');
    });

    var stars = document.querySelector('.stars')
    Array(15).keys().forEach((e) => {
        let div = document.createElement('div');
        div.className = 'star';

        let topOffset = Math.random() * 100 + 'vh';
        let fallDelay = Math.random() * 5 + 's';

        div.style.setProperty('--top-offset', topOffset);
        div.style.setProperty('--fall-delay', fallDelay);

        stars.appendChild(div);
    })
}

export async function fetchJSON(url) {
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

async function getDiscordOnline() {
    const data = await fetchJSON('https://discord.com/api/guilds/1231330785852653568/widget.json');
    if (data && data.presence_count !== undefined) {
        return await data.presence_count

    } else {
        console.log('Invalid data received from Discord API.');
        return 0
    }
}

async function getLatestCommit() {
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits");
    if (data && data.length > 0) {
        const latest_commit = data[0];
        return latest_commit.sha.slice(0, 7);
    } else {
        return '???'
    }
}

async function getLatestRelease() {
    const data = await fetchJSON('https://api.github.com/repos/dest4590/CollapseLoader/releases');
    if (data && data.length > 0) {
        const releases = data.filter(release => !release.prerelease && !release.draft);
        if (releases.length > 0) {
            const latestRelease = releases[0];
            return latestRelease.tag_name
        } else {
            console.log('No stable releases found.');
        }
    } else {
        console.log('No releases found.');
    }
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

function onVisible(element, callback) {
    new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                callback(element);
                observer.disconnect();
            }
        });
    }).observe(element);
    if (!callback) return new Promise(r => callback = r);
}

async function getCodeName() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/dest4590/CollapseLoader/main/collapse/static.py");
        const data = await response.text();
        const codenameMatch = data.match(/CODENAME\s*=\s*['"](.+?)['"]/);
        return codenameMatch ? codenameMatch[1] : 'Unknown';
    } catch (error) {
        console.error('Error fetching codename:', error);
        return 'Unknown';
    }
}

function fadeInText(elementId) {
    var elem = document.getElementById(elementId);

    setTimeout(() => {
        elem.style.height = '33px'
    }, 1000);

    setTimeout(() => {
        elem.style.opacity = 1
    }, 1500);
}

async function showVersion(hover, e) {
    const version = e.querySelector('p');
    if (hover) {
        version.style.opacity = 1
    }
    else {
        version.style.opacity = 0
    }
}
onVisible(document.querySelector(".footer"), async () => {
    fetch("https://api.github.com/repos/dest4590/CollapseLoader/commits")
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                document.querySelector('.footer h1').innerHTML = `CollapseLoader <a href="https://github.com/dest4590/CollapseLoader/commit/${data[0].sha}" target="_blank">(${data[0].sha.slice(0, 7)})`
            } else {
                document.querySelector('.footer h1').innerText = `CollapseLoader (???)`
            }
        })
        .catch(error => {
            console.error('Error fetching commits:', error);
        });
});

document.loader = load
document.downloadLatestRelease = downloadLatestRelease
document.downloadDev = downloadDev
document.showVersion = showVersion