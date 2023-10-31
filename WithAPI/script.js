const download = document.querySelector("#download-button");
const shareBtn = document.querySelector("#share-button");
const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector("#conteudo");
const generateBtn = document.querySelector("#generate-button");
const sizes = document.querySelector(".main__select");

const config = {
  colorLight: "#fff",
  colorDark: "#000",
  text: "Hello, world!",
  size: 300,
};

generateBtn.addEventListener("click", handleQRText);
sizes.addEventListener("change", handleSize);
shareBtn.addEventListener("click", handleShare);

function handleQRText(e) {
    const value = qrText.value;
    config.text = value || "Hello, world!";
    generateQRCode();
}

async function generateQRCode() {
    qrContainer.innerHTML = "";
    new QRCode("qr-code", {
        text: config.text,
        height: config.size,
        width: config.size,
        colorLight: config.colorLight,
        colorDark: config.colorDark,
    });
    download.href = await resolveDataUrl();
}

async function handleShare() {
    setTimeout(async () => {
        try {
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: config.text,
            });
        } catch (error) {
            alert("Your browser doesn't support sharing or an error occurred.");
        }
    }, 100);
}

function handleSize(e) {
    config.size = e.target.value;
    generateQRCode();
}

function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qr-code img");
            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }   
            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    });
}

generateQRCode();