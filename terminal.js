// --- INITIALIZATION ---
let currentPath = "~"; 
const termInput = document.getElementById('cmd-input');
const termOutput = document.getElementById('term-out');

// Fungsi bantu untuk mencetak teks ke terminal
function printLog(msg, color = "#fff") {
    // Mencari pola IP (seperti 10.0.5.1) dan membuatnya bisa diklik
    const formattedMsg = msg.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, (ip) => {
        return `<span style="color:cyan; cursor:pointer; text-decoration:underline; font-weight:bold;" onclick="quickPaste('${ip}')">${ip}</span>`;
    });

    termOutput.innerHTML += `<div style="color:${color}">${formattedMsg}</div>`;
    termOutput.scrollTop = termOutput.scrollHeight;
}

// Tambahkan fungsi ini agar saat IP diklik, dia otomatis masuk ke kotak input
window.quickPaste = function(ip) {
    const input = document.getElementById('cmd-input');
    if (input) {
        const currentVal = input.value.trim();
        // Jika sudah ada perintah (misal: 'sqlmap'), tambahkan IP di belakangnya
        if (currentVal !== "") {
            const cmdOnly = currentVal.split(' ')[0];
            input.value = cmdOnly + " " + ip;
        } else {
            // Jika kosong, masukkan IP saja
            input.value = ip;
        }
        input.focus();
    }
};

termInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = termInput.value;
        if (val.trim() !== "") {
            // Mengambil nama user dari state (misal: "Anon" atau "Sam")
            const username = (window.CyberGame.state.user || "anon").toLowerCase();
            
            termOutput.innerHTML += `<div><span style="color:#0f0;">${username}@cyber-os</span>:<span style="color:#729fcf;">${currentPath}</span>$ ${val}</div>`;
            handleLinuxLogic(val);
        }
        termInput.value = "";
    }
});

function handleLinuxLogic(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const target = parts[1] ? parts[1].trim() : null;
    const core = window.CyberGame; // Panggil induk data

    switch(cmd) {
        case "help":
            printLog(`
            <div style="margin: 5px 0; border: 1px dashed #444; padding: 10px; font-size:11px;">
                <b style="color:white">--- NETWORK TOOLS ---</b><br>
                - nslookup [domain] : Trace IP target.<br>
                - nmap [ip] : Scan ports & vulnerability.<br>
                - sqlmap [ip] : Exploit SQL & dump database.<br>
                <b style="color:white">--- REMOTE ACCESS ---</b><br>
                - ssh [ip] : Login ke server target.<br>
                - upload payload.html : Deface server (Misi).<br>
                - rm -rf /logs : Hapus jejak.<br>
                - exit : Keluar remote.
            </div>`, "var(--neon)");
            break;

        case "nslookup":
            if (!target) return printErr("Usage: nslookup [domain]");
            printLog(`Resolving ${target}...`);
            setTimeout(() => {
                const found = core.databases.web.find(w => w.url.includes(target));
                if (found) {
                    printLog(`Address found: ${found.ip}`, "cyan");
                } else {
                    printErr("Host not found.");
                }
            }, 1000);
            break;

        case "nmap":
            if (!target) return printErr("Usage: nmap [ip]");
            startLoading(`Scanning vulnerabilities on ${target}...`, 3000, () => {
                const srv = core.databases.servers[target];
                if (srv) {
                    printLog(`PORT 80/tcp OPEN (http)<br>Vulnerability: SQL-Injection detected.`, "#0f0");
                } else {
                    printLog("Scan complete. No open ports found.", "gray");
                }
            });
            break;

                case 'sqlmap':
            // 1. Ambil data inventory
            const inv = window.CyberGame.state.inventory;
            
            // 2. Cek apakah ada License/Toolnya (ID: sql_injector)
            if (inv.includes('sql_injector')) {
                // PAKAI 'target' (karena di atas kamu sudah buat const target = parts[1])
                if (!target) {
                    printLog("<span style='color:yellow'>Usage: sqlmap [target_ip]</span>");
                    printLog("Contoh: sqlmap 10.0.5.1");
                } else {
                    // Gunakan startLoading biar ada animasinya seperti nmap
                    startLoading(`Launching SQLMAP v1.4 on ${target}...`, 2000, () => {
                        printLog("[+] Testing connection... [OK]");
                        printLog("[+] Finding injection points...");
                        printLog("<span style='color:#00ff41'>[SUCCESS] Vulnerability found! Database: db_bank_rakyat.</span>");
                        printLog("Status: <span style='color:cyan'>Ready to 'ssh' to this IP.</span>");
                        
                        // Opsional: Tandai server ini sudah bisa di-SSH
                        if (core.databases.servers && core.databases.servers[target]) {
                            core.databases.servers[target].isHacked = true;
                        }
                    });
                }
            } else {
                // Tampilan kalau belum beli di Market - Gunakan printLog bukan termPrint
                printLog("<span style='color:#ff3131'>Error: sqlmap command not found.</span>");
                printLog("Anda harus membeli 'SQLMAP License' di Black Market.");
            }
            break;



        case "ssh":
            if (!target) return printErr("Usage: ssh [ip]");
            const server = core.databases.servers[target];
            if (server && server.isHacked) {
                startLoading(`Connecting to ${target}...`, 2000, () => {
                    currentPath = target;
                    printLog("Session established. Remote access granted.", "cyan");
                });
            } else {
                printErr("Access Denied. Exploit with 'sqlmap' first.");
            }
            break;

        case "upload":
            if (currentPath === "~") return printErr("Connect to a server first via SSH.");
            if (target === "payload.html") {
                startLoading("Executing deface script...", 3000, () => {
                    const activeMission = core.state.activeMissions.find(m => m.ip === currentPath);
                    if (activeMission) {
                        core.state.btc += activeMission.reward;
                        core.state.activeMissions = core.state.activeMissions.filter(m => m.ip !== currentPath);
                        printLog(`[SUCCESS] Target Defaced! Reward: ${activeMission.reward} BTC received.`, "lime");
                    } else {
                        printLog("Payload uploaded, but no mission active for this IP.", "yellow");
                    }
                    core.save(); // Simpan otomatis saldo baru
                });
            } else { printErr("File not found."); }
            break;

        case "tasks":
            if (core.state.activeMissions.length === 0) {
                printLog("No active tasks.");
            } else {
                printLog("ACTIVE MISSIONS:", "cyan");
                core.state.activeMissions.forEach(m => {
                    printLog(`> ${m.target} : ${m.desc} (${m.reward} BTC)`);
                });
            }
            break;

        case "clear":
            termOutput.innerHTML = "";
            break;

        default:
            printLog(`bash: ${cmd}: command not found`, "gray");
    }
}

function printErr(text) {
    printLog("Error: " + text, "#ff5555");
}

function startLoading(message, duration, callback) {
    let div = document.createElement('div');
    termOutput.appendChild(div);
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        let bar = "[";
        for(let i=0; i<10; i++) bar += (i < progress/10) ? "#" : ".";
        bar += "]";
        div.innerHTML = `${message} <span style="color:cyan">${bar} ${progress}%</span>`;
        if (progress >= 100) {
            clearInterval(interval);
            callback();
        }
        termOutput.scrollTop = termOutput.scrollHeight;
    }, duration / 10);
}
