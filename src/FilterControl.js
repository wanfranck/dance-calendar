import { AiTwotoneFilter } from 'react-icons/ai';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Button, OverlayTrigger, Popover, Form } from 'react-bootstrap';

import Tag from './Tag';

import { isMobile } from 'react-device-detect';

export default function FilterControl({ tags, onChangeFilter }) {
    const popover = (
        <Popover
            className={`${isMobile ? '' : 'desktop-hack'}`}
            style={{
                maxWidth: '100%',
                width: isMobile ? '97%' : '30%',
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

    return (
        <OverlayTrigger
            rootClose
            trigger="click"
            placement="bottom"
            overlay={popover}
        >
            {({ ref, ...triggerHandler }) => (
                <Button
                    variant="light"
                    style={{ height: '40px', width: '45px' }}
                    {...triggerHandler}
                    ref={ref}
                >
                    <AiTwotoneFilter width="100%" height="100%" />
                </Button>
            )}
            {/* <Button variant="light" style={{ height: '40px', width: '45px' }}>
                <AiTwotoneFilter width="100%" height="100%" />
            </Button> */}
        </OverlayTrigger>
    );
}
