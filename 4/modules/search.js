document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const word = document.getElementById('searchWord').value;

    fetch(`https://seahorse-app-satp2.ondigitalocean.app/api/definitions?word=${encodeURIComponent(word)}`)
        .then(response => response.json())
        .then(data => {
            const responseElement = document.getElementById('response');
            if (data.statusCode === 200) {
                responseElement.innerHTML = `
                <p><strong>Message:</strong> ${data.message}</p>
                <p><strong>Word:</strong> ${data.word}</p>
                <p><strong>Definition:</strong> ${data.definition}</p>
                <p><strong>Total Entries:</strong> ${data.totalEntries}</p>
            `;
            } else {
                responseElement.innerHTML = `<p><strong>Error:</strong> ${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});