import reader from 'g-sheets-api';

import fallbackEvents from './FallbackEvents';

const readerOptions = {
  apiKey: 'AIzaSyBIfuDqf6o-AX1TE8NWixCvaDtqGq_0vX0',
  sheetId: '1Wbf4smpI89PxlxTjrzxa_dPBwHMikIXkoL9gJKtIxYw',
  returnAllResults: true
};

const parseTags = (event) => {
    return Array.from(event.tags.split(',').reduce((tags, tag) => {
        tags.add(tag);
        return tags;
    }, new Set()));
}

const parseCoords = (event) => {
    return event.coordinates.split(',').map(c => parseFloat(c)).reverse();
}

async function getEvents() {
    let events = await new Promise((resolve, _) => {
        reader(
            readerOptions, 
            results => resolve(results.map(item => ({ ...item, tags: parseTags(item), coordinates: parseCoords(item) }))),
            error => {
                resolve(fallbackEvents.map(item => ({ ...item, tags: parseTags(item), coordinates: parseCoords(item) })));
            }
        );
    });

    return events;
}

export default getEvents;