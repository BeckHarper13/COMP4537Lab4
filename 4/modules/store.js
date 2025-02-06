document.getElementById('addForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const word = document.getElementById('word').value;
    const definition = document.getElementById('def').value;

    fetch('https://seahorse-app-satp2.ondigitalocean.app/api/definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, definition })
    })
        .then(response => response.json())
        .then(data => {
            const responseElement = document.getElementById('response');
            if (data.statusCode === 201) {
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