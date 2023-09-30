document.addEventListener('DOMContentLoaded', () => { 
    const form = document.getElementById('genreform');
    form.addEventListener('submit', (event) => { 
        event.preventDefault();
        const userInputDomain = document.getElementById('domainName').value;
        const userInputGenre = document.getElementById('genre').value;

        chrome.storage.local.get(['moodlight_data'], (result) => { 
            let DomainList = result.moodlight_data || [];
            DomainList.push({'Domain': userInputDomain, 'Genre': userInputGenre});
            console.log(DomainList);
            chrome.storage.local.set({'moodlight_data': DomainList}, () => {
                console.log(DomainList);
                console.log("Added New website to watch");
            });
        });
    });
});

