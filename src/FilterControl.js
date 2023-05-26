import { AiTwotoneFilter } from 'react-icons/ai';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Button, OverlayTrigger, Popover, Form } from 'react-bootstrap';

import Tag from './Tag';

import { isMobile } from 'react-device-detect';

export default function FilterControl({ tags, onChangeFilter, width }) {
    const popover = (
        <Popover
            style={{
                maxWidth: '100%',
                width: isMobile ? '97%' : width,
            }}
            body
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '1%',
                        height: '100%',
                        marginBottom: '15px',
                    }}
                >
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
        </Popover>
    );

    const isFilterApplied = tags.some((t) => t.isActive);
    return (
        <OverlayTrigger
            rootClose
            trigger="click"
            placement="bottom"
            overlay={popover}
        >
            <Button variant="light" style={{ height: '40px', width: '45px' }}>
                {isFilterApplied ? (
                    <div
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#E8AA42',
                            position: 'absolute',
                            left: '5px',
                            top: '7px',
                            zIndex: 3,
                        }}
                    ></div>
                ) : (
                    <div></div>
                )}
                <AiTwotoneFilter width="100%" height="100%" />
            </Button>
        </OverlayTrigger>
    );
}
