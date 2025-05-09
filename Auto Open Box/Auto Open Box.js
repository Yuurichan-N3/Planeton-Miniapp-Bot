// Fungsi untuk menunggu elemen muncul sebelum diklik
async function waitAndClick(selector, timeout = 30000, interval = 500) {
    let elapsed = 0;
    while (elapsed < timeout) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            console.log("Clicked: " + selector);
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval)); // Tunggu 500ms
        elapsed += interval;
        console.log(`Waiting for ${selector}, elapsed: ${elapsed}ms`);
    }
    console.log("Timeout waiting for element: " + selector);
    return false;
}

// Fungsi utama
async function autoOpenLoop(selectedBox) {
    const interval = setInterval(async () => {
        // Pilih box
        let boxSelector;
        if (selectedBox === "purple") {
            boxSelector = "#app > div > div > div > div > div > div > div.MuiBox-root.css-hlh5cj > div > div > div:nth-child(3) > div > div > div.MuiBox-root.css-1ubufro > div:nth-child(1) > img";
        } else if (selectedBox === "green") {
            boxSelector = "#app > div > div > div > div > div > div > div.MuiBox-root.css-hlh5cj > div > div > div > div > div > div.MuiBox-root.css-1ubufro > div:nth-child(1) > img";
        } else if (selectedBox === "blue") {
            boxSelector = "#app > div > div > div > div > div > div > div.MuiBox-root.css-hlh5cj > div > div > div:nth-child(2) > div > div > div.MuiBox-root.css-1ubufro > div:nth-child(1) > img";
        } else {
            console.log("Box type not recognized, stopping loop.");
            clearInterval(interval);
            return;
        }

        // Langkah 1: Klik box yang dipilih
        if (!await waitAndClick(boxSelector)) {
            clearInterval(interval);
            return;
        }

        // Tunggu 1 detik setelah klik box
        await new Promise(resolve => setTimeout(resolve, 1000)); // Sesuikan delay device mu yg kent*ng itu hh (becanda heheh)

        // Lan  gkah 2: Klik tombol "Open lootbox"
        if (!await waitAndClick("body > div.css-45bwlv > div.css-17g48ia > div > div.MuiBox-root.css-78r4mf > div > div > button")) {
            clearInterval(interval);
            return;
        }

        // Tunggu 2 detik setelah klik "Open lootbox"
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Langkah 3: Klik tombol "Great"
        if (!await waitAndClick("body > div.css-ams81t > div.css-17g48ia > div.MuiBox-root.css-1md1idp > div:nth-child(2) > button")) {
            clearInterval(interval);
            return;
        }

        // Tunggu 2 detik setelah klik "Great" sebelum ulang
        await new Promise(resolve => setTimeout(resolve, 2000));
    }, 12000); // Total delay per loop (3 + 3 + 2 + waktu eksekusi = ~12 detik)

    return interval; // Mengembalikan interval agar bisa dihentikan
}

// Tombol Play, Stop, dan dropdown untuk memilih box
function createControlButtons() {
    // Hapus tombol lama jika ada
    const existingButtons = document.getElementById("controlButtons");
    if (existingButtons) existingButtons.remove();

    // Untuk menampung tombol dan dropdown
    const controlDiv = document.createElement("div");
    controlDiv.id = "controlButtons";
    controlDiv.style.position = "fixed";
    controlDiv.style.top = "10px";
    controlDiv.style.right = "10px";
    controlDiv.style.zIndex = "1000";
    controlDiv.style.backgroundColor = "#fff";
    controlDiv.style.padding = "10px";
    controlDiv.style.border = "1px solid #ccc";
    controlDiv.style.borderRadius = "5px";
    controlDiv.style.display = "flex";
    controlDiv.style.alignItems = "center";

    // Untuk memilih box
    const boxSelect = document.createElement("select");
    boxSelect.style.marginRight = "10px";
    boxSelect.innerHTML = `
        <option value="purple">Purple Box</option>
        <option value="green">Green Box</option>
        <option value="blue">Blue Box</option>
    `;
    boxSelect.id = "boxSelect";

    // Tombol Play atau bermain
    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.style.marginRight = "10px";
    playButton.style.padding = "5px 10px";
    playButton.addEventListener("click", async () => {
        const selectedBox = document.getElementById("boxSelect").value;
        playButton.disabled = true;
        const interval = await autoOpenLoop(selectedBox);
        stopButton.disabled = false;
        stopButton.interval = interval; // Simpan interval untuk stop
        console.log("Auto-open loop started for " + selectedBox + " box. Use Stop button to halt.");
    });

    // Tombol Stop atau berhenti
    const stopButton = document.createElement("button");
    stopButton.textContent = "Stop";
    stopButton.disabled = true;
    stopButton.style.padding = "5px 10px";
    stopButton.addEventListener("click", () => {
        clearInterval(stopButton.interval);
        playButton.disabled = false;
        stopButton.disabled = true;
        console.log("Auto-open loop stopped.");
    });

    // Tambahkan dropdown dan tombol ke div
    controlDiv.appendChild(boxSelect);
    controlDiv.appendChild(playButton);
    controlDiv.appendChild(stopButton);

    // Tambahkan div ke body
    document.body.appendChild(controlDiv);
}

// Jalankan fungsi
createControlButtons();