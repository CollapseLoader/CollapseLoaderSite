import { CountUp } from '/files/js/libraries/countUp.min.js';
import { Odometer } from '/files/js/libraries/odometer.min.js';

async function getAnalyticsType(dataPromise, type) {
    const data = await dataPromise;
    return data.find(endpoint => endpoint.endpoint === `api/analytics/${type}`)?.count || 0;
}

export async function load() {
    setOSName();

    addStars('.stars', 15);

    if (location.pathname === '/') {
        const lenis = new Lenis();

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        VanillaTilt.init(document.querySelector('.showcase'), {
            max: 20,
            speed: 400,
            perspective: 600,
            scale: 1.03,
        });

        const discordOnline = await getDiscordOnline();
        const startValue = Number(await getAnalyticsType(await getAnalytics(), 'start'));
        const clientValue = Number(await getAnalyticsType(await getAnalytics(), 'client'));

        new CountUp('discord-online', discordOnline, {
            plugin: new Odometer({ duration: 1.5, lastDigitDelay: 1 })
        }).start();

        const startElement = document.getElementById('loader-starts');
        const clientElement = document.getElementById('loader-clients');

        new CountUp('loader-starts', startValue, {
            plugin: new Odometer({ duration: 0.5, lastDigitDelay: 0.5 })
        }).start();
        
        startElement.setAttribute('data-current-value', startValue);

        new CountUp('loader-clients', clientValue, {
            plugin: new Odometer({ duration: 0.5, lastDigitDelay: 0.5 })
        }).start();

        clientElement.setAttribute('data-current-value', clientValue);

        onVisible(document.querySelector(".footer"), async () => {
            const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits");
            const commitSha = data?.[0]?.sha.slice(0, 7) ?? '???';
            document.querySelector('.footer h1').innerHTML = `CollapseLoader <a href="https://github.com/dest4590/CollapseLoader/commit/${commitSha}" target="_blank">(${commitSha})</a>`;
        });
    }
}

function setOSName() {
    const userAgent = window.navigator.userAgent;
    document.OSName = /Windows/.test(userAgent) ? "Windows" :
        /Mac/.test(userAgent) ? "Mac/iOS" :
            /X11/.test(userAgent) ? "UNIX" :
                /Linux/.test(userAgent) ? "Linux" : "Unknown";
}

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

async function getDiscordOnline() {
    const data = await fetchJSON('https://discord.com/api/guilds/1231330785852653568/widget.json');
    return data?.presence_count ?? 0;
}

async function getLatestCommit() {
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/commits");
    return data?.[0]?.sha.slice(0, 7) ?? '???';
}

async function getLatestRelease() {
    const data = await fetchJSON('https://api.github.com/repos/dest4590/CollapseLoader/releases');
    const releases = data?.filter(release => !release.prerelease && !release.draft) ?? [];
    return releases?.[0]?.tag_name ?? '???';
}

async function getAnalytics(type) {
    const data = await fetchJSON('https://web.collapseloader.org/api/counter');

    return data;
}

function alertCompatibility() {
    if (document.OSName !== "Windows") {
        alert("Loader is not supported on Unix or Mac");
    }
}

async function downloadLatestRelease() {
    alertCompatibility();
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases/latest");
    window.open(data?.assets?.[0]?.browser_download_url ?? '', "_blank");
}

async function downloadDev() {
    alertCompatibility();
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases");
    const latestPrerelease = data?.find(release => release.prerelease);
    window.open(latestPrerelease?.assets?.[0]?.browser_download_url ?? '', "_blank");
}

async function downloadUpdater() {
    alertCompatibility();
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseUpdater/releases/latest");
    window.open(data?.assets?.[0]?.browser_download_url ?? '', "_blank");
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
}

async function showVersion(hover, e) {
    const version = e.querySelector('p');
    version.style.opacity = hover ? 1 : 0;
}

function addStars(containerSelector, count) {
    const container = document.querySelector(containerSelector);
    Array.from({ length: count }).forEach(() => {
        const div = document.createElement('div');
        div.className = 'star';
        div.style.setProperty('--top-offset', `${Math.random() * 100}vh`);
        div.style.setProperty('--fall-delay', `${Math.random() * 5}s`);
        container.appendChild(div);
    });
}

function updateElementText(selector, text, callback) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerText = text;
        if (callback) callback(selector);
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

document.loader = load;
document.downloadLatestRelease = downloadLatestRelease;
document.downloadDev = downloadDev;
document.downloadUpdater = downloadUpdater;
document.showVersion = showVersion;
document.copyCrypto = copyCrypto;