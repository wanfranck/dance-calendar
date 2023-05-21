import reader from 'g-sheets-api'

import fallbackEvents from './FallbackEvents'

const readerOptions = {
    apiKey: 'AIzaSyBIfuDqf6o-AX1TE8NWixCvaDtqGq_0vX0',
    sheetId: '1Wbf4smpI89PxlxTjrzxa_dPBwHMikIXkoL9gJKtIxYw',
    returnAllResults: true,
}

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.`

const parseTags = (event) => {
    return Array.from(
        event.tags.split(',').reduce((tags, tag) => {
            tags.add(tag)
            return tags
        }, new Set())
    )
}

const parseCoords = (event) => {
    return event.coordinates
        .split(',')
        .map((c) => parseFloat(c))
        .reverse()
}

async function getEvents() {
    let events = await new Promise((resolve, _) => {
        reader(readerOptions, (results) =>
            resolve(
                results.map((item, id) => {
                    const tags = parseTags(item)
                    const coordinates = parseCoords(item)

                    const getType = (tags) => {
                        if (tags.indexOf('#battle') !== -1) {
                            return 'battle'
                        } else if (tags.indexOf('#camp') !== -1) {
                            return 'camp'
                        } else if (tags.indexOf('#lab') !== -1) {
                            return 'lab'
                        }

                        return 'unknown'
                    }

                    const type = getType(tags)

                    return {
                        ...item,
                        description: [item.description, loremIpsum].join('\n'),
                        link: 'https://www.instagram.com/e.s.d.a/',
                        tags,
                        coordinates,
                        id,
                        type,
                    }
                }),
                (_) => resolve(fallbackEvents)
            )
        )
    })

    return events
}

export default getEvents
