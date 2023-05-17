import reader from 'g-sheets-api';

import fallbackEvents from './FallbackEvents';

const readerOptions = {
  apiKey: 'AIzaSyBIfuDqf6o-AX1TE8NWixCvaDtqGq_0vX0',
  sheetId: '1Wbf4smpI89PxlxTjrzxa_dPBwHMikIXkoL9gJKtIxYw',
  returnAllResults: true
};

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.`;

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
            results => resolve(results.map((item, idx) => ({ 
                ...item, description: [item.description, loremIpsum].join('\n'), 
                link: "https://www.instagram.com/e.s.d.a/",
                tags: parseTags(item), coordinates: parseCoords(item), id: idx }))),
            _ => resolve(fallbackEvents.map((item, idx) => ({ 
                ...item, 
                tags: parseTags(item), coordinates: parseCoords(item), id: idx })))
        );
    });

    return events;
}

export default getEvents;