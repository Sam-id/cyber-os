let gameData = JSON.parse(localStorage.getItem('cyberOS_save')) || {
    user: "Anon",
    btc: 0.0000,
    xp: 0,
    level: 1,
    wanted: 0,
    activeMissions: [], // Tempat menyimpan misi yang diterima
    hardware: { isMining: false, temp: 30 }
};

// Daftar database misi komunitas
const communityQuests = {
    "shadow_task": {
        target: "192.168.1.10",
        objective: "Hack Database Sekolah",
        reward: 0.02,
        desc: "Shadow butuh nilai ujiannya diubah."
    },
    "ghost_task": {
        target: "10.0.0.99",
        objective: "Curi Data Crypto",
        reward: 0.1,
        desc: "Ghost ingin saldo exchange kompetitornya bocor."
    }
};

const shopItems = [
    { id: "proxy_v1", name: "Proxy Tunnel v1", price: 0.02, desc: "Kurangi risiko tertangkap 15%" },
    
    { id: "cpu_v2", name: "Multi-Core CPU", price: 0.05, desc: "Hasil mining +50% lebih cepat" },
    
    { id: "exploit_kit", name: "Exploit Kit", price: 0.04, type: "tool", desc: "Bruteforce 2x lebih cepat."},
    { id: "cleaner", name: "Log Cleaner", price: 0.01, desc: "Hapus 1 bintang Wanted Level" }
];

function saveProgress() {
    localStorage.setItem('cyberOS_save', JSON.stringify(gameData));
}

// Gunakan window. agar pasti bisa dibaca oleh terminal.js
window.webDatabase = [
    // Kategori Bank & Finansial
    { url: "bank-rakyat.com", ip: "10.0.5.1", title: "Bank Rakyat Virtual", category: "bank" },
    { url: "crypto-ex.net", ip: "10.0.8.22", title: "Cyber Crypto Exchange", category: "bank" },
    { url: "global-bank.id", ip: "10.0.1.50", title: "Global Central Bank", category: "bank" },

    // Kategori Pemerintah & Militer (High Security)
    { url: "gov.go.id", ip: "202.10.1.5", title: "Portal Pusat Pemerintah", category: "pemerintah" },
    { url: "defense.mil.cy", ip: "202.50.9.11", title: "Defense Network System", category: "pemerintah" },
    { url: "police.cyber.os", ip: "202.20.2.1", title: "Cyber Police Department", category: "pemerintah" },

    // Kategori E-Commerce & Bisnis
    { url: "shopee-virtual.id", ip: "192.168.2.5", title: "Virtual Shop", category: "shop" },
    { url: "megacorp.com", ip: "192.168.5.10", title: "MegaCorp Industries", category: "shop" },
    { url: "food-delivery.cy", ip: "192.168.1.15", title: "Cyber Foodies", category: "shop" },

    // Kategori Berita & Media Sosial
    { url: "cyber-news.com", ip: "45.10.1.1", title: "Cyber City News", category: "media" },
    { url: "chirper.io", ip: "45.20.5.9", title: "Chirper - Social Media", category: "media" },
    { url: "dark-forum.onion", ip: "6.6.6.1", title: "The Hidden Forum", category: "darkweb" }
];
window.webServers = {
    // Bank
    "10.0.5.1": { db: "bank_db", user: "admin_br", pass: "Bnk_772" },
    "10.0.8.22": { db: "crypto_vault", user: "wallet_master", pass: "bitc0in_2025" },
    "10.0.1.50": { db: "global_finance", user: "super_admin", pass: "global_secure" },

    // Gov
    "202.10.1.5": { db: "gov_data", user: "admin_gov", pass: "gov_990" },
    "202.50.9.11": { db: "military_net", user: "general_x", pass: "nuclear_launch_00" },
    "202.20.2.1": { db: "police_records", user: "detective_01", pass: "arrest_now" },

    // Shop & Corp
    "192.168.2.5": { db: "shop_db", user: "root_shopee", pass: "shp_881" },
    "192.168.5.10": { db: "mega_core", user: "ceo_corp", pass: "money_is_power" },

    // Dark Web
    "6.6.6.1": { db: "anonymous_db", user: "ghost_user", pass: "you_cant_see_me" }
};




// Pastikan gameData mendukung level hacking
if (!gameData.hackingSkill) gameData.hackingSkill = 1;
