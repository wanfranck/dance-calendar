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
                <div style={{ display: 'inline-block', marginBottom: '15px' }}>
                    {tags.map((tag, idx) => (
                        <Tag
                            key={`tag-${idx}`}
                            value={tag.value}
                            isActive={tag.isActive}
                            onClick={(tagValue) => onChangeFilter(tagValue)}
                        />
                    ))}
                </div>

                <div
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        border: 'solid #d3d4d5 1px',
                        borderRadius: '4px',
                        padding: '2px',
                        cursor: 'not-allowed',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            fontSize: '20px',
                            textAlign: 'center',
                            top: '40%',
                            fontWeight: '600',
                            cursor: 'not-allowed',
                        }}
                    >
                        <div>Coming Soon</div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            gap: '1%',
                            height: '100%',
                            marginBottom: '15px',
                            opacity: '0.3',
                            cursor: 'not-allowed',
                        }}
                    >
                        <div style={{ height: '100%', cursor: 'not-allowed' }}>
                            <BsCurrencyDollar width="100%" height="100%" />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: '100%',
                                cursor: 'not-allowed',
                            }}
                        >
                            <Form.Range
                                style={{ width: '93%', cursor: 'not-allowed' }}
                                disabled
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'inline-block',
                            opacity: '0.3',
                            cursor: 'not-allowed',
                        }}
                    >
                        {[
                            'Marcin Rebilas',
                            'Diana Matos',
                            'Caetlyn Watson',
                            'Kerrie Milne',
                            'Maniek Kotarski',
                            'Nikita Litvichenko',
                            'Daniel Asamoah',
                            'Łukasz Ludwiczak',
                            'Lee Daniel',
                            'Miss Andye J',
                            'Denzel Chisolm',
                        ].map((name, idx) => (
                            <Tag
                                key={`tag-${idx}`}
                                value={name}
                                isDisabled={true}
                                onClick={(_) => {}}
                            />
                        ))}
                    </div>
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
