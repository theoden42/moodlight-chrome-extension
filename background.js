chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    sendData(tab.url);
  });
});

chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.tabs.get(details.tabId, (tab) => {
    sendData(tab.url);
  });
});

const getDomainData = () => { 
    return new Promise((resolve, reject) => { 
        chrome.storage.local.get(['moodlight_data'], (result) => {
            if(chrome.runtime.lastError) { 
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.moodlight_data || []);
            }
        });
    });
};

const getTheGenre = async (url) => {
    const urlObject = new URL(url);
    const domainName = urlObject.hostname;
    const DomainList = await getDomainData();
    
    let genreName = "default";
    DomainList.forEach((domainGenrePair) => { 
        if(domainGenrePair['Domain'] == domainName) 
            genreName = domainGenrePair['Genre'];
    });
    return genreName;
}

const sendData = async (url) => {
    const apiKey =  'ADDYOURKEY';
    const genre = await getTheGenre(url);
    
    if(genre == "default") 
        return;

    const apiUrl = `https://api.thingspeak.com/update?api_key=${apiKey}&field1=${genre}`;

    fetch(apiUrl, { method: 'POST' })
    .then((response) => { 
        if(response.ok) { 
            console.log('Tab change communicated successfuly')
        } else {
            console.log(response);
            console.error('Tab Change communicated Unsuccesfully', response.statusText);
        }
    })
    .catch((error) => { 
        console.log('Error Logging URL:', error);
    });
}

