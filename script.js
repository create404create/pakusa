// Country selection
document.getElementById('pakistan-btn').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('usa-btn').classList.remove('active');
    document.getElementById('pakistan-input').style.display = 'block';
    document.getElementById('usa-input').style.display = 'none';
    document.getElementById('result').style.display = 'none';
});

document.getElementById('usa-btn').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('pakistan-btn').classList.remove('active');
    document.getElementById('pakistan-input').style.display = 'none';
    document.getElementById('usa-input').style.display = 'block';
    document.getElementById('result').style.display = 'none';
});

// Pakistan search
document.getElementById('pak-search').addEventListener('click', function() {
    const number = document.getElementById('pak-number').value.trim();
    
    if (!number || (number.length !== 10 && number.length !== 13)) {
        alert('Please enter a valid 10-digit phone number or 13-digit CNIC');
        return;
    }
    
    searchPakistan(number);
});

// USA search
document.getElementById('usa-search').addEventListener('click', function() {
    const number = document.getElementById('usa-number').value.trim();
    
    if (!number || number.length !== 10) {
        alert('Please enter a valid 10-digit USA phone number (without +1)');
        return;
    }
    
    searchUSA(number);
});

// Copy results button
document.getElementById('copy-btn').addEventListener('click', function() {
    const resultContent = document.getElementById('result-content').textContent;
    navigator.clipboard.writeText(resultContent)
        .then(() => {
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});

function searchPakistan(number) {
    showLoading();
    
    const apiUrl = `https://api.nexoracle.com/details/pak-sim-database-free?apikey=free_key@maher_apis&q=${number}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Format the data with owner information
            const formattedData = {
                ...data,
                owner: "AYAN AHMAD",
                apiProvider: "NexOracle"
            };
            displayResult(formattedData);
        })
        .catch(error => {
            displayResult({ 
                error: "Failed to fetch data",
                message: error.message,
                owner: "AYAN AHMAD"
            });
        })
        .finally(() => {
            hideLoading();
        });
}

function searchUSA(number) {
    showLoading();
    
    // USA API endpoints
    const endpoints = {
        user: "https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=",
        id: "https://person.api.uspeoplesearch.net/person/v3?x=",
        id1: "https://premium_lookup-1-h4761841.deta.app/person?x=",
        _rt: "https://tcpa.api.uspeoplesearch.net/tcpa/report?x="
    };
    
    // Using the main endpoint
    fetch(`${endpoints.user}${number}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Format the data with owner information
            const formattedData = {
                ...data,
                owner: "AYAN AHMAD",
                apiProvider: "USPeopleSearch"
            };
            displayResult(formattedData);
        })
        .catch(error => {
            // If main endpoint fails, try the backup endpoint
            fetch(`${endpoints.id1}${number}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const formattedData = {
                        ...data,
                        owner: "AYAN AHMAD",
                        apiProvider: "USPeopleSearch (Backup)"
                    };
                    displayResult(formattedData);
                })
                .catch(error => {
                    displayResult({ 
                        error: "Failed to fetch USA data",
                        message: error.message,
                        owner: "AYAN AHMAD"
                    });
                })
                .finally(() => {
                    hideLoading();
                });
        });
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function displayResult(data) {
    const resultElement = document.getElementById('result-content');
    
    // Format the data with proper spacing and colors in the JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Apply syntax highlighting (simple version)
    const highlightedJson = jsonString
        .replace(/("[\w]+":)/g, '<span style="color: #d35400;">$1</span>')
        .replace(/: ("[^"]+")/g, ': <span style="color: #27ae60;">$1</span>')
        .replace(/: (\d+)/g, ': <span style="color: #2980b9;">$1</span>');
    
    resultElement.innerHTML = highlightedJson;
    document.getElementById('result').style.display = 'block';
    
    // Scroll to results
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}
