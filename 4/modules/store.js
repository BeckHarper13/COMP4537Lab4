// Partially generated by ChatGPT
class DefinitionAdder {
    constructor() {
        // Bind the form submission event to the handleFormSubmit method
        document.getElementById('addForm').addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // Method to handle form submission
    handleFormSubmit(e) {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get the word and definition from the form inputs
        const word = document.getElementById('word').value;
        const definition = document.getElementById('def').value;

        // Send a POST request to the API endpoint
        fetch('https://seahorse-app-satp2.ondigitalocean.app/api/definitions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word, definition }) // Convert the data to JSON format
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            // Get the element where the response will be displayed
            const responseElement = document.getElementById('response');

            // Check if the request was successful (statusCode 201)
            if (data.statusCode === 201) {
                // Display the success message and details
                responseElement.innerHTML = `
                    <p><strong>Message:</strong> ${data.message}</p>
                    <p><strong>Word:</strong> ${data.word}</p>
                    <p><strong>Definition:</strong> ${data.definition}</p>
                    <p><strong>Total Entries:</strong> ${data.totalEntries}</p>
                `;
            } else {
                // Display the error message
                responseElement.innerHTML = `<p><strong>Error:</strong> ${data.message}</p>`;
            }
        })
        .catch(error => {
            // Log any errors to the console
            console.error('Error:', error);
        });
    }
}

// Instantiate the DefinitionAdder class to set up the event listener
const definitionAdder = new DefinitionAdder();