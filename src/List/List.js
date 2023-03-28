import './List.css';

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'

import Tag from '../Tag';

function List({ prefix, events, isActive }) {
    return (
        <div key={`list-${prefix}`} className={`List ${isActive ? '' : 'Hidden'}`}>
            <Accordion width={'100%'} height={'100%'} allowToggle>
                {events.map((item, idx) => 
                    <AccordionItem key={`list-item-${idx}`} className='Item Element'>
                        <div style={{ height: '100%', display:'flex', gap: '2%', flexDirection:'row', justifyContent: 'stretch' }}>
                            <img alt="Item" style={{ height: '100%', objectFit: 'contain' }} src={item.image} />
                            <Box padding={'10px'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} height='100%' width='100%' key={`list-item-${idx}`}>
                                <div style={{ height: '100%', width: '100%', display:'flex', flexDirection:'column', justifyContent: 'space-between'}}>
                                    <p> {item.title} <b>{item.date}</b> </p>
                                    <div>
                                        { item.tags.map((t, idx) => <Tag key={`tag-${idx}`} value={t} />) 
                                        }
                                    </div>
                                </div>
                            </Box>
                            <AccordionButton style={{width: 'fit-content'}}>
                                <AccordionIcon />
                            </AccordionButton>
                        </div>
                        <AccordionPanel pb={4}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                        </AccordionPanel>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
}

export default List;
