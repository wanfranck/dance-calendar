// const https = require('https');
// const fs = require('fs');
//require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const doIt = async (description, location) => {
    const messages = [
        {
            role: 'user',
            content: `parse this description of event and reply in json format, where "title" - the name of event, "start_date" - start date of event in DD-MM-YYYY format, "end_date" - end date of event, "location" - object, where name - the name of ${location}, x - coordinates of latitude of ${location}, y - coordinates of longtitude of ${location};  ${description}`,
        },
    ];

    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
        });
        console.log(completion.data.choices[0].message.content);
        return JSON.parse(completion.data.choices[0].message.content);
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
        }
    }
};

//////////////
export const parseLink = async (link) => {
    const short_code = link.slice(-12, -1);
    console.log(short_code);
    if (!short_code || !link) return;

    const url = `https://instagram28.p.rapidapi.com/media_info?short_code=${short_code}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key':
                '96d8957edcmshc2c34cef48ca8d8p1ad4e5jsn5dc66164d3d1',
            'X-RapidAPI-Host': 'instagram28.p.rapidapi.com',
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(link, short_code, response, result);
        const imageUrl = result.data.shortcode_media.display_url;
        const imageName = `${result.data.shortcode_media.owner.full_name}_${short_code}.jpg`;
        const data = await doIt(
            result.data.shortcode_media.edge_media_to_caption.edges[0].node
                .text,
            result.data.shortcode_media.location?.name
        );

        // const file = fs.createWriteStream(imageName);
        // https
        //     .get(imageUrl, (response) => {
        //         response.pipe(file);

        //         file.on('finish', () => {
        //             file.close();
        //             console.log(`Image downloaded as ${imageName}`);
        //         });
        //     })
        //     .on('error', (err) => {
        //         fs.unlink(imageName);
        //         console.error(`Error downloading image: ${err.message}`);
        //     });
            return {data, imageUrl}
    } catch (error) {
        console.log(error);
    }
};
