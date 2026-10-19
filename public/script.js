
const uploadForm = document.getElementById("file-upload-form");

uploadForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.querySelector('input[type="file"]');
    const selectedFile = fileInput.files[0];

    if (!selectedFile) {
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Upload failed.");
        }

        document.getElementById("upload-result").hidden = false;
        document.getElementById("share-link").value = data.url;

    } catch (error) {
        alert(error.message);
    }
});


const copyButton = document.getElementById("copy-link-button");

copyButton.addEventListener("click", async function () {
    const shareLink = document.getElementById("share-link");

    await navigator.clipboard.writeText(shareLink.value);

    copyButton.textContent = "Copied!";
});

