window.CyberGame = {
    state: JSON.parse(localStorage.getItem('cyberOS_save')) || {
        user: "Sam",
        btc: 10.0168,
        xp: 0,
        level: 1,
        wanted: 0,
        inventory: [],
        activeMissions: [],
        hardware: { isMining: false, temp: 30, hashrate: 1.5 },
        hackingSkill: 1,
        // --- TAMBAHAN BARU ---
        userProfile: {
            username: "Sam", // Sinkronkan dengan state.user
            bio: "Digital Ghost | System Breaker",
            badges: ["Seed_Member"]
        }
    },
    // ... sisa kode databases ...
itemGraphics: {
       'sql-injector': 'https://cdn-icons-png.flaticon.com/512/2165/2165031.png',
        'cpu_v2': 'https://cdn-icons-png.flaticon.com/512/2091/2091665.png', // Ikon CPU
        'cleaner': 'https://cdn-icons-png.flaticon.com/512/750/750537.png', // Ikon pembersih
},
    databases: {
        web: [
            { url: "bank-rakyat.com", ip: "10.0.5.1", title: "Bank Rakyat Indonesia", category: "bank", security: "High" },
            { url: "dark-forum.onion", ip: "6.6.6.1", title: "Shadow Market", category: "dark", security: "Low" }
        ],
        servers: {
            "10.0.5.1": { isHacked: false },
            "6.6.6.1": { isHacked: false }
        },
        shop: [
          {
    id: "sql_injector", // ID ini harus sama dengan yang di-check di terminal
    name: "SQLMAP License",
    desc: "Membuka akses perintah 'sqlmap' di terminal untuk eksploitasi database.",
    price: 0.045
},

          
            { id: "cleaner", name: "Log Cleaner", price: 0.01, desc: "Hapus 1 bintang Wanted Level." },
            { id: "cpu_v2", name: "Multi-Core CPU", price: 0.05, desc: "Hashrate mining naik 50%." }
        ]
    },

    save: function() {
        localStorage.setItem('cyberOS_save', JSON.stringify(this.state));
        this.syncUI();
    },

    syncUI: function() {
        // 1. Sinkronisasi Wallet
        const btcEl = document.getElementById('os-wallet');
        if (btcEl && this.state.btc !== undefined) {
            this.state.btc = Number(this.state.btc); 
            btcEl.innerText = this.state.btc.toFixed(4) + " BTC";
        }

        // 2. Sinkronisasi Nama User di Header
        const userHeader = document.querySelector('.header-user-name'); 
        if (userHeader) {
            userHeader.innerText = "USER: " + this.state.user.toUpperCase();
        }
        
        // 3. Update XP/Level di Header
        const xpEl = document.getElementById('os-xp');
        if (xpEl) {
            xpEl.innerText = "XP: " + this.state.xp;
        }
    }
}; // Pastikan ini adalah penutup dari window.CyberGame


// Fungsi Logika (Bukan Tampilan)
function buyItem(id, price) {
    const game = window.CyberGame;
    
    if (game.state.btc >= price) {
        // 1. Potong saldo
        game.state.btc -= price;
        
        // 2. Masukkan ke inventory
        game.state.inventory.push(id);

        // --- TAMBAHKAN LOGIKA INI ---
        // Jika yang dibeli adalah CPU, langsung naikkan hashrate-nya
        if (id === 'cpu_v2') {
            // Kita tambah 5.0 MH/s (atau sesuaikan keinginanmu)
            game.state.hardware.hashrate += 5.0; 
            showAlert("HARDWARE", "Hashrate naik menjadi " + game.state.hardware.hashrate + " MH/s");
        }
        // -----------------------------

        // 3. Simpan dan Update
        game.save();
        
        // Refresh tampilan market dan miner
        if (typeof renderMarket === 'function') renderMarket();
        if (typeof renderMiner === 'function') renderMiner();
        
        showAlert("SYSTEM", "Pembelian Berhasil!");
    } else {
        showAlert("ERROR", "BTC Tidak Cukup!", true);
    }
}


// --- LOGIKA MINING (TAMBAHKAN INI) ---
function toggleMining() {
    const state = window.CyberGame.state;
    // Balikkan status true <-> false
    state.hardware.isMining = !state.hardware.isMining;
    
    // Simpan ke LocalStorage
    window.CyberGame.save();
    
    // Update tampilan di engine.js jika fungsi render ada
    if (typeof renderMiner === 'function') renderMiner();
    
    const status = state.hardware.isMining ? "STARTED" : "STOPPED";
    showAlert("MINER", "Mining " + status);
}
// Fungsi untuk menjual item
function sellItem(id, sellPrice) {
    const game = window.CyberGame;
    const index = game.state.inventory.indexOf(id);

    if (index > -1) {
        game.state.inventory.splice(index, 1); // Hapus 1 item dari inventory
        game.state.btc += Number(sellPrice); // Tambah saldo dari penjualan
        
        game.save();
        game.syncUI();
        if (typeof renderInventory === 'function') renderInventory(); // Refresh Inventory
        showAlert("SYSTEM", `Item ${id} terjual seharga ${sellPrice} BTC.`);
    } else {
        showAlert("ERROR", "Item tidak ditemukan di inventory.", true);
    }
}

// Fungsi untuk menggunakan item (Contoh: Log Cleaner)
function useItem(id) {
    const game = window.CyberGame;
    const index = game.state.inventory.indexOf(id);

    if (index > -1) {
        game.state.inventory.splice(index, 1); // Hapus 1 item setelah digunakan
        
        if (id === 'cleaner') {
            game.state.wanted = Math.max(0, game.state.wanted - 1); // Kurangi 1 bintang wanted
            showAlert("SYSTEM", "Log Cleaner digunakan! Wanted level berkurang.");
            // Panggil fungsi untuk refresh tampilan wanted level jika ada
        }
        
        game.save();
        game.syncUI();
        if (typeof renderInventory === 'function') renderInventory(); // Refresh Inventory
    } else {
        showAlert("ERROR", "Item tidak ditemukan di inventory.", true);
    }
}

// Daftarkan ke Global agar bisa dipanggil tombol HTML
window.buyItem = buyItem;
window.toggleMining = toggleMining;
window.sellItem = sellItem;
window.useItem = useItem;
