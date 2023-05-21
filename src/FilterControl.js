import { AiTwotoneFilter, AiOutlineDollarCircle } from 'react-icons/ai';
import { Button, OverlayTrigger, Popover, Form } from 'react-bootstrap';

import Tag from './Tag';

export default function FilterControl({ tags, onChangeFilter }) {
    const popover = (
        <Popover style={{ maxWidth: '100%', width: '70%', inset: '15px 15px 15px 15px' }}>
          <Popover.Body>
            <div>
                <div style={{ display: 'flex', gap: '1%', height: '100%' }}>
                    <div style={{ height: '100%', width: '3%' }}>
                        <AiOutlineDollarCircle style={{ width: '100%' }} width='100%' />
                    </div>
                    <Form.Range style={{ width: '45%' }} />
                </div>

                <div style={{ display: 'flex', gap: '2%'}}>
                    <div style={{ display: 'flex' }}>
                        {tags.map((tag, idx) => 
                            <Tag key={`tag-${idx}`}
                                    value={tag.value}
                                    isActive={tag.isActive} 
                                    onClick={tagValue => onChangeFilter(tagValue)} />
                        )}
                    </div>
                </div>
            </div>
          </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
            <Button variant="light">
                <AiTwotoneFilter width='100%' height='100%' />
            </Button>
        </OverlayTrigger>
    );
}