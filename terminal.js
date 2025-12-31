// Pastikan Event Listener memanggil fungsi yang benar
const termInput = document.getElementById('cmd-input');
const termOutput = document.getElementById('term-out');

termInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = termInput.value;
        if (val.trim() !== "") {
            // Tampilkan apa yang diketik user di layar
            termOutput.innerHTML += `<div style="color:#0f0;">root@cyber-os:~$ ${val}</div>`;
            // PANGGIL FUNGSI LOGIKA
            handleLinuxLogic(val);
        }
        termInput.value = "";
        termOutput.scrollTop = termOutput.scrollHeight;
    }
});

function handleLinuxLogic(input) {
    // Membersihkan input dari spasi ganda (masalah umum di HP)
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const target = parts[1] ? parts[1].trim() : null;

    switch(cmd) {
        case "help":
            termOutput.innerHTML += `<div>
                <b style="color:white">--- LINUX TERMINAL GUIDE v3.0 ---</b><br>
                1. <b>nslookup [domain]</b> : Mendapatkan IP dari URL.<br>
                2. <b>ping [target]</b> : Tes koneksi ke IP/Domain.<br>
                3. <b>nmap [ip]</b> : Scan port target.<br>
                4. <b>sqlmap [ip]</b> : Injeksi database (Dapatkan password).<br>
                5. <b>ssh [ip]</b> : Remote login (Butuh SQL access).<br>
                6. <b>ls</b> : Lihat file di server.<br>
                7. <b>./run_exploit</b> : Eksekusi misi akhir.<br>
                8. <b>exit</b> : Kembali ke localhost.<br>
                9. <b>clear</b> : Bersihkan layar.
            </div>`;
            break;

        case "nslookup":
            if (!target) {
                termOutput.innerHTML += "<div>Usage: nslookup [domain]</div>";
                break;
            }
            
            const cleanTarget = target.replace(/\s+/g, '').toLowerCase();

            // Efek loading supaya nyata
            termOutput.innerHTML += `<div>Resolving ${cleanTarget}...</div>`;
            
            setTimeout(() => {
                // Ambil data dari window.webDatabase (data.js)
                const db = window.webDatabase || [];
                const found = db.find(w => w.url.toLowerCase() === cleanTarget);
                
                if (found) {
                    termOutput.innerHTML += `
                        <div style="color:cyan; margin-top:5px; border-left: 3px solid cyan; padding-left: 10px;">
                            <b>Server:</b> DNS-Root-Global<br>
                            <b>Name:</b>   ${found.url}<br>
                            <b>Address:</b> <span style="color:yellow; font-weight:bold;">${found.ip}</span>
                        </div>`;
                } else {
                    termOutput.innerHTML += `<div style="color:#ff5555;">** NXDOMAIN: '${cleanTarget}' tidak ditemukan.</div>`;
                }
                termOutput.scrollTop = termOutput.scrollHeight;
            }, 1000);
            break;

        case "ping":
            if (!target) {
                termOutput.innerHTML += "<div>Usage: ping [target]</div>";
                break;
            }
            let count = 0;
            const pingInt = setInterval(() => {
                if (count < 4) {
                    termOutput.innerHTML += `<div>Reply from ${target}: bytes=64 time=${Math.floor(Math.random()*40)+10}ms</div>`;
                    count++;
                } else {
                    clearInterval(pingInt);
                    termOutput.innerHTML += `<div>Ping statistics for ${target}: Sent = 4, Received = 4</div>`;
                }
                termOutput.scrollTop = termOutput.scrollHeight;
            }, 600);
            break;

case "nmap":
    if (!target) return termOutput.innerHTML += "<div>Usage: nmap [ip]</div>";
    
    // Simulasi scanning port
    startLoading(`Scanning ports on ${target}...`, 3000, () => {
        termOutput.innerHTML += `
            <div style="color:#0f0; margin: 10px 0;">
                Starting Nmap 7.80 ( https://nmap.org ) at 2025-12-30<br>
                Nmap scan report for ${target}<br>
                Host is up (0.002s latency).<br><br>
                PORT     STATE    SERVICE<br>
                22/tcp   open     ssh<br>
                80/tcp   open     http<br>
                3306/tcp open     mysql<br><br>
                <span style="color:yellow">Nmap done: 1 IP address scanned (1 host up)</span>
            </div>`;
        termOutput.scrollTop = termOutput.scrollHeight;
    });
    break;


case "ssh":
    if (!target) return termOutput.innerHTML += "<div>Usage: ssh [ip]</div>";
    startLoading(`Connecting to ${target}...`, 2000, () => {
        // Mengubah tampilan prompt agar terasa seperti pindah server
        termOutput.innerHTML += `<div style="color:cyan">Welcome to Remote Server ${target}. Type 'ls' to see files.</div>`;
        // Kamu bisa menambahkan variabel status 'isLoggedIn = true' di sini
    });
    break;


        case "sqlmap":
    if (!target) return termOutput.innerHTML += "<div>Usage: sqlmap [ip]</div>";

    startLoading(`Searching for SQL vulnerabilities on ${target}...`, 4000, () => {
        // Ambil data server berdasarkan IP
        const server = window.webServers[target];

        if (server) {
            termOutput.innerHTML += `
                <div style="color:yellow; margin: 10px 0;">
                    [!] Vulnerability detected: Boolean-based blind SQL injection<br>
                    [+] Database: '${server.db_name}' identified<br>
                    [+] Fetching tables from '${server.db_name}'...<br>
                    [+] Found table: 'users_credentials'<br><br>
                    <span style="color:#0f0">SUCCESS: Data dump complete!</span><br>
                    -----------------------------------<br>
                    <b>USER:</b> ${server.user}<br>
                    <b>PASS:</b> ${server.pass}<br>
                    -----------------------------------
                </div>`;
        } else {
            termOutput.innerHTML += `
                <div style="color:#ff5555; margin-top:5px;">
                    [!] Error: Target ${target} is not responding or not vulnerable.<br>
                    <small style="color:gray">Pastikan IP benar dan server sedang online.</small>
                </div>`;
        }
        termOutput.scrollTop = termOutput.scrollHeight;
    });
    break;


        case "ssh":
            if (!target) return termOutput.innerHTML += "<div>Usage: ssh [target_ip]</div>";
            if (misi && misi.isHacked) {
                startLoading(`Establishing encrypted tunnel to ${target}...`, 2000, () => {
                    currentPath = target; // Simulasi masuk ke server
                    termOutput.innerHTML += `<div style="background:blue; color:white;">Welcome to Remote Root Shell. Type 'ls' to see files.</div>`;
                });
            } else {
                termOutput.innerHTML += "<div style='color:red'>Permission Denied. (SQL exploit required)</div>";
            }
            break;

        case "ls":
    // Menampilkan file rahasia hanya jika sudah login via SSH
    termOutput.innerHTML += `
        <div style="color:#fff; margin: 5px 0;">
            bin/ &nbsp;&nbsp; config/ &nbsp;&nbsp; logs/ &nbsp;&nbsp; <span style="color:lime">run_exploit*</span> &nbsp;&nbsp; database.db
        </div>`;
    break;

        case "cat":
    if (!target) return termOutput.innerHTML += "<div>Usage: cat [filename]</div>";
    
    let content = "";
    if (target === "database.db") {
        content = "<span style='color:cyan'>[DECRYPTED] Contains user hashes and transaction logs...</span>";
    } else if (target === "config.json") {
        content = "{ 'admin_access': true, 'server_loc': 'Jakarta' }";
    } else {
        content = `cat: ${target}: No such file or directory`;
    }
    
    termOutput.innerHTML += `<div style="margin: 5px 0;">${content}</div>`;
    break;


case "./run_exploit":
    startLoading("Executing payload...", 3000, () => {
        // Menambah saldo BTC di gameData
        gameData.btc += 0.05; 
        
        termOutput.innerHTML += `
            <div style="color:#0f0; background:rgba(0,255,0,0.1); padding:10px; border:1px solid #0f0; margin-top:10px;">
                [SUCCESS] Exploit completed.<br>
                [REWARD] 0.05 BTC has been transferred to your wallet.<br>
                [WARNING] Connection traced by admin! Type 'exit' immediately!
            </div>`;
            
        // Update tampilan saldo di layar (pastikan fungsi ini ada di engine.js)
        if (typeof updateUI === "function") updateUI();
    });
    break;


        case "./run_exploit":
            if (currentPath === "~") {
                termOutput.innerHTML += "<div>bash: ./run_exploit: No such file or directory</div>";
            } else {
                startLoading("Executing payload in target filesystem...", 5000, () => {
                    const activeIdx = gameData.activeMissions.findIndex(m => m.target === currentPath);
                    if (activeIdx !== -1) {
                        const m = gameData.activeMissions[activeIdx];
                        gameData.btc += m.reward;
                        termOutput.innerHTML += `<div style="color:var(--neon)">[OK] Data exfiltrated. +${m.reward} BTC added to wallet.</div>`;
                        gameData.activeMissions.splice(activeIdx, 1);
                        updateUI(); saveProgress();
                    }
                });
// Di dalam case "./run_exploit" (terminal.js)
startLoading("Running exploit payload...", 4000, () => {
    gameData.btc += 0.05;
    gameData.wanted += 1;
    termOutput.innerHTML += "<div style='color:lime'>[SUCCESS] Data breached.</div>";
    
    // Kirim berita ke browser
    updateNews("Laporan terbaru: Terjadi aktivitas ilegal pada server " + currentSession);
    
    updateUI();
});

            }
          
            break;

        case "exit":
            currentPath = "~";
            termOutput.innerHTML += "<div>Connection closed. Back to local machine.</div>";
            break;

        case "clear":
            termOutput.innerHTML = "";
            break;

        default:
            termOutput.innerHTML += `<div style="color:gray">bash: ${cmd}: command not found.</div>`;
    }
}
function startLoading(message, duration, callback) {
    termOutput.innerHTML += `<div>${message}</div>`;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress > 100) {
            clearInterval(interval);
            callback();
        }
    }, duration / 10);
}
