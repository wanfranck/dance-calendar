//import Instagram from 'instagram-web-api'
//const Instagram = require('instagram-web-api');

export const getInstaImageLink = async (item) => {
    // const client = Instagram();
    // console.log(client);
    // const url = `https://instagram28.p.rapidapi.com/media_info?short_code=${shortCode}`;
    const options = {
        method: 'GET',
        // headers: {
        //     'X-RapidAPI-Key':
        //         '96d8957edcmshc2c34cef48ca8d8p1ad4e5jsn5dc66164d3d1',
        //     'X-RapidAPI-Host': 'instagram28.p.rapidapi.com',
        // },
    };
    const getImage = async (url) => {
        return await fetch(url).then(res => res.url)
      }

    try {

        // const response = await fetch(`${item.link}media/`, options);
        // const result = await response.json();
        console.log(getImage(`${item.link}media/`), item);
    } catch (error) {
        console.error(error);
    }
};
