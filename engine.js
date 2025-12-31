function openWin(id) {
    document.getElementById(id).style.display = 'flex';
    if(id === 'win-terminal') document.getElementById('cmd-input').focus();
}

function closeWin(id) {
    document.getElementById(id).style.display = 'none';
}

function updateUI() {
    document.getElementById('os-wallet').innerText = gameData.btc.toFixed(4) + " BTC";
    document.getElementById('os-user').innerText = "USER: " + gameData.user;
    
    // Sinkronisasi bintang polisi
    for (let i = 1; i <= 3; i++) {
        const star = document.getElementById('star' + i);
        if (gameData.wanted >= i) {
            star.classList.add('star-active');
        } else {
            star.classList.remove('star-active');
        }
    }
}

function loadMarket() {
    const list = document.getElementById('market-list');
    list.innerHTML = "";
    shopItems.forEach(item => {
        list.innerHTML += `
            <div class="shop-card">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <button class="buy-btn" onclick="buyItem('${item.id}', ${item.price})">BELI (${item.price} BTC)</button>
            </div>
        `;
    });
}

function buyItem(id, price) {
    // 1. Pastikan harga adalah angka (float)
    const itemPrice = parseFloat(price);
    
    // 2. Cek Saldo
    if (gameData.btc >= itemPrice) {
        // Potong Saldo
        gameData.btc -= itemPrice;
        
        // 3. Tambahkan ke Inventory (Jika belum ada sistem inventory, kita buat)
        if (!gameData.inventory) gameData.inventory = [];
        gameData.inventory.push(id);
        
        // 4. Logika Khusus Item
        if (id === "cleaner") {
            if (gameData.wanted > 0) {
                gameData.wanted--;
                alert("SUCCESS: Log dihapus. Wanted level berkurang!");
            } else {
                alert("INFO: Kamu tidak memiliki bintang wanted, tapi item tetap dibeli.");
            }
        } else if (id === "cpu_v2") {
            alert("SUCCESS: Hardware diupgrade! Hashrate meningkat.");
            // Logika tambahan untuk mining bisa ditaruh di sini
        } else {
            alert("SUCCESS: Berhasil membeli " + id);
        }

        // 5. Simpan dan Refresh Tampilan
        saveProgress();
        updateUI(); 
        loadMarket(); // Refresh tampilan shop agar saldo terbaru muncul
    } else {
        alert("FAILED: Saldo BTC tidak cukup! Kamu butuh " + itemPrice + " BTC.");
    }
}


// Fungsi menyalakan/mematikan Mining
function toggleMining() {
    // Pastikan data hardware ada
    if (!gameData.hardware) {
        gameData.hardware = { isMining: false, temp: 30 };
    }

    gameData.hardware.isMining = !gameData.hardware.isMining;
    
    const btn = document.getElementById('mine-btn');
    const status = document.getElementById('miner-status');

    if (gameData.hardware.isMining) {
        btn.innerText = "STOP MINING";
        btn.style.background = "#ff003c"; // Merah saat nyala
        status.innerText = "MINING ACTIVE...";
        status.style.color = "var(--neon)";
    } else {
        btn.innerText = "START MINING";
        btn.style.background = "var(--neon)"; // Hijau saat mati
        status.innerText = "OFFLINE";
        status.style.color = "gray";
    }
    saveProgress();
}

// Loop Utama Game (Mining & Suhu) - Jalankan setiap 1 detik
setInterval(() => {
    if (gameData.hardware && gameData.hardware.isMining) {
        // 1. Tambah BTC pelan-pelan
        gameData.btc += 0.00005; 
        
        // 2. Naikkan Suhu
        gameData.hardware.temp += 0.8;
        
        // 3. Cek Overheat
        if (gameData.hardware.temp >= 90) {
            gameData.hardware.isMining = false;
            gameData.hardware.temp = 40; // Reset suhu karena rusak
            alert("⚠️ SYSTEM OVERHEAT! Mining dihentikan paksa untuk mencegah kerusakan hardware.");
            toggleMining(); // Update UI tombol
        }
        
        // Update Tampilan di Jendela Miner
        const tempEl = document.getElementById('cpu-temp');
        if(tempEl) {
            tempEl.innerText = gameData.hardware.temp.toFixed(1);
            tempEl.style.color = gameData.hardware.temp > 75 ? "red" : "var(--neon)";
        }
        
        const hashEl = document.getElementById('hash-rate');
        if(hashEl) hashEl.innerText = (Math.random() * (15.5 - 12.1) + 12.1).toFixed(1);
        
        updateUI();
        saveProgress();
    } else {
        // Pendinginan alami jika tidak mining
        if (gameData.hardware && gameData.hardware.temp > 30) {
            gameData.hardware.temp -= 0.3;
            const tempEl = document.getElementById('cpu-temp');
            if(tempEl) tempEl.innerText = gameData.hardware.temp.toFixed(1);
        }
    }
}, 1000);
// Loop interval untuk mining (jalankan setiap 2 detik)
setInterval(() => {
    if (gameData.hardware.isMining) {
        gameData.btc += 0.0001;
        gameData.hardware.temp += 0.5; // Suhu naik
        
        if (gameData.hardware.temp > 85) {
            alert("OVERHEAT! Hardware rusak.");
            toggleMining();
            gameData.hardware.temp = 30;
        }
        
        document.getElementById('cpu-temp').innerText = gameData.hardware.temp.toFixed(1);
        document.getElementById('cpu-temp').className = gameData.hardware.temp > 70 ? "temp-warning" : "";
        updateUI();
        saveProgress();
    } else if (gameData.hardware.temp > 30) {
        gameData.hardware.temp -= 0.2; // Suhu turun pelan-pelan
        document.getElementById('cpu-temp').innerText = gameData.hardware.temp.toFixed(1);
    }
}, 2000);

// Update openWin agar memuat market
function openWin(id) {
    document.getElementById(id).style.display = 'flex';
    if(id === 'win-market') loadMarket();
}
// Database Chat Bot
const botMessages = [
    { from: "Shadow", text: "Siapa yang bisa bantu hack database sekolah? Saya bayar 0.02 BTC." },
    { from: "Ghost_X", text: "Hati-hati, polisi cyber sedang patroli di sektor server pusat!" },
    { from: "Master_Bit", text: "Ada yang jual Proxy Tunnel v2? Market kehabisan stok." }
];

function loadSocial() {
    const feed = document.getElementById('social-feed');
    feed.innerHTML = "";
    botMessages.forEach(msg => {
        feed.innerHTML += `
            <div style="border-bottom: 1px solid #111; padding: 12px; margin-bottom: 5px; background: rgba(0,255,0,0.02);">
                <b style="color:var(--neon); font-size: 14px;">@${msg.from}</b>
                <p style="margin: 5px 0; color: #eee; font-size: 12px;">${msg.text}</p>
                <button onclick="acceptQuest('${msg.from}')" style="background:none; border: 1px solid #444; color: #888; font-size: 10px; border-radius: 3px;">Reply / Accept</button>
            </div>
        `;
    });
}

function acceptQuest(questId) {
    const quest = communityQuests[questId];
    
    // Cek apakah misi sudah ada
    const exists = gameData.activeMissions.find(m => m.target === quest.target);
    if (!exists) {
        gameData.activeMissions.push(quest);
        saveProgress();
        alert(`Misi Diterima: ${quest.objective}. Target IP: ${quest.target}. Cek Terminal!`);
    } else {
        alert("Misi ini sudah ada di daftar tugasmu.");
    }
}

// Update loadSocial agar tombol 'Accept' mengirimkan ID yang benar
function loadSocial() {
    const feed = document.getElementById('social-feed');
    feed.innerHTML = `
        <div style="background:rgba(0,255,65,0.1); padding:15px; border-radius:10px; margin-bottom:20px;">
            <h3 style="margin:0; color:white;">@${gameData.user}</h3>
            <p style="font-size:11px; margin:5px 0;">Rank: ${gameData.level > 5 ? 'Elite Hacker' : 'Script Kiddie'}</p>
            <div id="badges">
                ${gameData.btc > 0.5 ? '<span title="Rich" style="background:gold; color:black; padding:2px 5px; border-radius:3px; font-size:10px; margin-right:5px;">💰 RICH</span>' : ''}
                ${gameData.inventory.length > 2 ? '<span title="Tool-Guy" style="background:cyan; color:black; padding:2px 5px; border-radius:3px; font-size:10px;">🛠️ TOOL-GUY</span>' : ''}
            </div>
        </div>
        <h4 style="color:var(--neon)">Community Feed</h4>
    `;
    // Contoh pesan dari Shadow
    feed.innerHTML += `
        <div class="shop-card">
            <b style="color:var(--neon)">@Shadow:</b>
            <p>Butuh bantuan cepat nih di IP 192.168.1.10. Tenanang ada buat ngopi.</p>
            <button class="buy-btn" onclick="acceptQuest('shadow_task')">ACCEPT MISSION</button>
        </div>
    `;
    
    // Contoh pesan dari Ghost
    feed.innerHTML += `
        <div class="shop-card">
            <b style="color:var(--neon)">@Ghost_X:</b>
            <p>Target besar di 10.0.0.99. Siapa berani?</p>
            <button class="buy-btn" onclick="acceptQuest('ghost_task')">ACCEPT MISSION</button>
        </div>
    `;
}
// Letakkan di bagian paling atas atau paling bawah engine.js (di luar fungsi lain)
function acceptQuest(questId) {
    // 1. Ambil data misi dari database di data.js
    const quest = communityQuests[questId];
    
    if (!quest) {
        console.error("Data misi tidak ditemukan untuk ID:", questId);
        return;
    }

    // 2. Cek apakah activeMissions sudah ada (biar gak error)
    if (!gameData.activeMissions) {
        gameData.activeMissions = [];
    }

    // 3. Cek apakah misi sudah pernah diambil
    const sudahAda = gameData.activeMissions.find(m => m.target === quest.target);
    
    if (!sudahAda) {
        gameData.activeMissions.push(quest);
        saveProgress();
        alert(`✅ MISI DITERIMA!\nTarget: ${quest.target}\nObjective: ${quest.objective}\n\nCek terminal dan ketik 'tasks'`);
    } else {
        alert("⚠️ Kamu sudah mengambil misi ini.");
    }
}

// Pastikan openWin juga memanggil loadSocial dengan benar
function openWin(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'flex';
        if(id === 'win-terminal') document.getElementById('cmd-input').focus();
        if(id === 'win-social') loadSocial(); // Memuat chat bot saat dibuka
        if(id === 'win-market') loadMarket();
    }
}


// Update fungsi openWin agar memicu loadSocial
function openWin(id) {
    document.getElementById(id).style.display = 'flex';
    if(id === 'win-terminal') document.getElementById('cmd-input').focus();
    if(id === 'win-social') loadSocial();
    if(id === 'win-market') loadMarket();
}


function navigateWeb() {
    const url = document.getElementById('browser-url').value.toLowerCase();
    const display = document.getElementById('web-display');
// Tambahkan di dalam fungsi navigateWeb()
if (url === "hidden-market.onion") {
    display.innerHTML = `
        <div style="background:#111; color:#0f0; padding:15px; font-family:monospace;">
            <h3>--- ONION BLACK MARKET ---</h3>
            <p>Buy Stolen CC Data (0.01 BTC)</p>
            <button onclick="buyCC()" style="background:#0f0; border:none; padding:5px;">BUY DATA</button>
            <hr>
            <p>Buy 0-Day Exploit (0.08 BTC)</p>
        </div>
    `;
    return;
}

// Fungsi beli CC
function buyCC() {
    if (gameData.btc >= 0.01) {
        gameData.btc -= 0.01;
        let profit = Math.random() * (0.03 - 0.015) + 0.015; // Untung acak
        gameData.btc += profit;
        alert(`CC Data Cleaned! Kamu mendapat untung bersih ${profit.toFixed(4)} BTC`);
        updateUI();
    } else { alert("BTC tidak cukup!"); }
}

    
    if (webServers[url]) {
        const site = webServers[url];
        if (site.isDefaced) {
            display.innerHTML = `
                <div style="background:black; color:red; text-align:center; height:100%; padding-top:50px;">
                    <h1>HACKED BY ${gameData.user}</h1>
                    <p>Your security is a joke.</p>
                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueWJ3Z3B0bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/LLZ5N5CqhNpSb6Eclj/giphy.gif" width="200">
                </div>`;
        } else {
            display.innerHTML = `
                <div style="padding:20px;">
                    <h2 style="color:#003366">${site.title}</h2>
                    <hr>
                    <p>${site.content}</p>
                    <div style="margin-top:50px; font-size:10px; color:gray;">IP: ${site.ip} | Security: ${site.security}</div>
                </div>`;
        }
    } else {
        display.innerHTML = "<center><h1>404 Not Found</h1></center>";
    }
}
// Pastikan variabel ini ada di data.js atau bagian atas engine.js
function searchEngine() {
    const searchInput = document.getElementById('browser-search');
    const display = document.getElementById('web-content');
    
    if (!searchInput || !display) return; // Proteksi error

    const query = searchInput.value.trim().toLowerCase();
    
    // Tampilan loading pencarian biar lebih nyata
    display.innerHTML = `<div class="blink">Searching database for "${query}"...</div>`;

    setTimeout(() => {
        display.innerHTML = ""; // Bersihkan loading

        // Filter database berdasarkan query
        const results = webDatabase.filter(web => 
            web.category.toLowerCase().includes(query) || 
            web.title.toLowerCase().includes(query) || 
            web.url.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            display.innerHTML = `<p style="color:gray; font-size:12px; margin-bottom:15px;">Ditemukan ${results.length} situs terkait.</p>`;
            
            results.forEach(web => {
                display.innerHTML += `
                    <div style="margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;">
                        <a href="#" onclick="openWeb('${web.url}')" style="color:#1a0dab; font-size:18px; text-decoration:none; display:block;"><b>${web.title}</b></a>
                        <div style="color:#006621; font-size:14px;">${web.url}</div>
                        <div style="color:#545454; font-size:13px;">${web.desc}</div>
                    </div>
                `;
            });
        } else {
            display.innerHTML = `
                <center style="margin-top:50px;">
                    <h3 style="color:#555;">Hasil tidak ditemukan.</h3>
                    <p style="color:gray;">Coba kata kunci lain seperti: <b>bank, shop, pemerintah, crypto</b></p>
                </center>`;
        }
    }, 500); // Delay 0.5 detik untuk efek loading
}

// Tambahkan listener agar bisa tekan 'Enter' di search bar
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('browser-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchEngine();
        });
    }
});
function updateNews(headline) {
    const display = document.getElementById('web-content');
    // Jika sedang di halaman utama search engine, tampilkan berita
    if (document.getElementById('browser-search').value === "") {
        display.innerHTML += `
            <div style="margin-top:20px; padding:15px; background:#fff3cd; border-left:5px solid #ffecb5; color:#856404;">
                <small><b>BREAKING NEWS:</b></small><br>
                ${headline}
            </div>
        `;
    }
}
// Pastikan gameData kamu punya properti user
if (!window.gameData) window.gameData = { user: "anon", btc: 0 };

function startSession() {
    const nameInput = document.getElementById('username-input').value;
    const loginScreen = document.getElementById('login-screen');
    const bgm = document.getElementById('bgm');

    // 1. Ambil nama (default 'anon' jika kosong)
    const user = nameInput.trim() !== "" ? nameInput : "anon";
    
    // 2. Simpan secara Global agar terminal.js bisa baca
    window.gameData = {
        user: user,
        btc: 0
    };

    // 3. Putar Musik (Berhasil karena dipicu klik tombol)
    if (bgm) {
        bgm.volume = 0.3;
        bgm.play().catch(e => console.log("Musik tertunda"));
    }

    // 4. Tutup Layar Login
    loginScreen.style.display = 'none';
    
    console.log("System Initialized for user: " + user);
}

      
