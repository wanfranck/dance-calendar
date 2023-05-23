import { AiTwotoneFilter } from 'react-icons/ai';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Button, OverlayTrigger, Popover, Form } from 'react-bootstrap';

import Tag from './Tag';

import { isMobile } from 'react-device-detect';

export default function FilterControl({ tags, onChangeFilter }) {
    const popover = (
        <Popover
            style={{
                maxWidth: '100%',
                width: isMobile ? '70%' : '30%',
                inset: '15px 15px 15px 15px',
            }}
        >
            <Popover.Body>
                <div>
                    <div style={{ display: 'flex', gap: '1%', height: '100%' }}>
                        <div style={{ height: '100%' }}>
                            <BsCurrencyDollar width="100%" height="100%" />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Form.Range style={{ width: '93%' }} />
                        </div>
                    </div>

                    <div style={{ display: 'inline-block' }}>
                        {tags.map((tag, idx) => (
                            <Tag
                                key={`tag-${idx}`}
                                value={tag.value}
                                isActive={tag.isActive}
                                onClick={(tagValue) => onChangeFilter(tagValue)}
                            />
                        ))}
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement={isMobile ? "bottom" : "right"} overlay={popover}>
            <Button variant="light">
                <AiTwotoneFilter width="100%" height="100%" />
            </Button>
        </OverlayTrigger>
    );
}
