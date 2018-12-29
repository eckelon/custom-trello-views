const httpRequest = (url, data) => {
    return fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
};


const apiClient = {
    httpRequest
}

export default apiClient;