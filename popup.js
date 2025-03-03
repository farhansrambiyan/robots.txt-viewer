document.addEventListener("DOMContentLoaded", function () {
    fetchRobotsTxt();
});

function fetchRobotsTxt() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var url = new URL(activeTab.url);
        var domain = url.protocol + "//" + url.host;
        var robotsTxtUrl = domain + "/robots.txt";

        fetch(robotsTxtUrl)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                const content = lines.join('\n');
                document.getElementById("robotsTxtContent").innerText = content;

                const lineNumbers = document.querySelector('.line-numbers');
                lineNumbers.innerHTML = '';
                lines.forEach((line, index) => {
                    const lineNumber = document.createElement('div');
                    lineNumber.innerText = index + 1;
                    lineNumbers.appendChild(lineNumber);
                });

                // Sync scroll
                const editorContent = document.getElementById("robotsTxtContent");
                lineNumbers.scrollTop = editorContent.scrollTop;
                editorContent.addEventListener("scroll", () => {
                    lineNumbers.scrollTop = editorContent.scrollTop;
                });
                lineNumbers.addEventListener("scroll", () => {
                    editorContent.scrollTop = lineNumbers.scrollTop;
                });
            })
            .catch(error => {
                document.getElementById("robotsTxtContent").innerText = "Failed to load robots.txt";
            });
    });
}
