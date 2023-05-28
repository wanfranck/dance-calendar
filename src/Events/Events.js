import reader from 'g-sheets-api';

import fallbackEvents from './FallbackEvents';

const readerOptions = {
    apiKey: 'AIzaSyBIfuDqf6o-AX1TE8NWixCvaDtqGq_0vX0',
    sheetId: '1Wbf4smpI89PxlxTjrzxa_dPBwHMikIXkoL9gJKtIxYw',
    returnAllResults: true,
};

const parseTags = (event) => {
    return Array.from(
        event.tags.split(',').reduce((tags, tag) => {
            tags.add(tag);
            return tags;
        }, new Set())
    );
};

const parseCoords = (event) => {
    return event.coordinates
        .split(',')
        .map((c) => parseFloat(c))
        .reverse();
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

export const imageLink = (id) =>
    `https://drive.google.com/uc?export=view&id=${id}`;

const getImagePlaceholder = () => {
    const index = getRandomInt(4);
    const placeholders = [
        '1u8q9VhXfhGyrcDPinY-Iu8SlQkTg1tdX',
        '1xk5GVbU1gr_V4Sl4jK1Djy39s-LJnYOY',
        '1s1cLZlxO4GZB6mte7zNCJ2QC3_S85afy',
        '1crKPyFC4oTP-wk99cb4yXtQcLRZ3sqGo',
    ];

    return imageLink(placeholders[index]);
};

const getEventType = (tags) => {
    if (tags.indexOf('#battle') !== -1) {
        return 'battle';
    } else if (tags.indexOf('#camp') !== -1) {
        return 'camp';
    } else if (tags.indexOf('#lab') !== -1) {
        return 'lab';
    }

    return 'unknown';
};

async function getEvents() {
    let events = await new Promise((resolve, _) => {
        reader(readerOptions, (results) =>
            resolve(
                results.map((item, id) => {
                    const tags = parseTags(item);
                    const coordinates = parseCoords(item);
                    const type = getEventType(tags);

                    return {
                        ...item,
                        image: item.image
                            ? imageLink(item.image)
                            : getImagePlaceholder(),
                        tags,
                        coordinates,
                        id,
                        type,
                    };
                }),
                (_) => resolve(fallbackEvents)
            )
        );
    });

    return events;
}

export default getEvents;
