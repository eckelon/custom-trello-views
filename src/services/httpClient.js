export const doGetRequest = (url, data) => {
    let params = '';
    Object.keys(data).forEach(key => {
        params += params.length === 0 ? `?${key}=${data[key]}` : `&${key}=${data[key]}`
    });

    url += params;
    const request = new Request(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'default'
    });

    return fetch(request);
};