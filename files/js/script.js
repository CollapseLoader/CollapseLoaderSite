import { CountUp } from '/files/js/libraries/countUp.min.js';
import { Odometer } from '/files/js/libraries/odometer.min.js';

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

        // init download buttons
        const latestRelease = await fetchLatestRelease();
        if (latestRelease !== '') {
            document.getElementById('download-latest').link = latestRelease;
            document.getElementById('download-latest').classList.remove('disabled');
        }

        const updaterRelease = await fetchUpdaterRelease();
        if (updaterRelease !== '') {
            document.getElementById('download-updater').link = updaterRelease;
            document.getElementById('download-updater').classList.remove('disabled');
        }

        const latestPrerelease = await fetchLatestPrerelease();
        if (latestPrerelease !== '') {
            document.getElementById('download-prerelease').link = latestPrerelease;
            document.getElementById('download-prerelease').classList.remove('disabled');
        }
        // =====================

        const discordOnline = Number(await getDiscordOnline());

        new CountUp('discord-online', discordOnline, {
            plugin: new Odometer({ duration: 1.5, lastDigitDelay: 1 })
        }).start();

        // init analytics
        const startValue = Number(await getAnalyticsType(await getAnalytics(), 'start'));
        const clientValue = Number(await getAnalyticsType(await getAnalytics(), 'client'));
        const startContainer = document.querySelector('div.content.analytics > h1:nth-child(1)');
        const clientContainer = document.querySelector('div.content.analytics > h1:nth-child(2)');

        if (startValue != 0) {
            startContainer.style.opacity = 1;
            new CountUp('loader-starts', startValue, {
                plugin: new Odometer({ duration: 0.5, lastDigitDelay: 0.5 })
            }).start();
        } else {
            startContainer.style.opacity = 1;
            clientContainer.innerHTML = 'Cannot fetch analytics';
        }

        if (clientValue != 0) {
            clientContainer.style.opacity = 1;
            new CountUp('loader-clients', clientValue, {
                plugin: new Odometer({ duration: 0.5, lastDigitDelay: 0.5 })
            }).start();
        } else {
            clientContainer.style.opacity = 1;
            clientContainer.innerHTML = 'Cannot fetch analytics';
        }


        // =====================

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

async function getAnalyticsType(dataPromise, type) {
    const data = await dataPromise;
    return data.find(endpoint => endpoint.endpoint === `api/analytics/${type}`)?.count || 0;
}

async function getAnalytics() {
    return await fetchJSON('https://web.collapseloader.org/api/counter');
}

function alertCompatibility() {
    if (document.OSName !== "Windows") {
        alert("Loader is not supported on Unix or Mac");
    }
}

async function fetchLatestRelease() {
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases/latest");
    return data?.assets?.[0]?.browser_download_url ?? '';
}

async function fetchLatestPrerelease() {
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseLoader/releases");
    const latestPrerelease = data?.find(release => release.prerelease);
    return latestPrerelease?.assets?.[0]?.browser_download_url ?? ''
}

async function fetchUpdaterRelease() {
    const data = await fetchJSON("https://api.github.com/repos/dest4590/CollapseUpdater/releases/latest");
    return data?.assets?.[0]?.browser_download_url ?? ''
}

async function openDownloadPage(self) {
    alertCompatibility();
    if (self.classList.contains('disabled')) return;
    window.open(self.link, '_blank');
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
document.openDownloadPage = openDownloadPage;
document.showVersion = showVersion;
document.copyCrypto = copyCrypto;