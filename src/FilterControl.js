import { AiTwotoneFilter } from 'react-icons/ai';
import { Button, OverlayTrigger, Popover, Form } from 'react-bootstrap';

import Tag from './Tag';

export default function FilterControl({tags, onChangeFilter }) {
    const popover = (
        <Popover style={{ maxWidth: '100%', width: '70%' }}>
          <Popover.Body>
            <div>
                <div style={{display: 'flex'}}>
                    <div>Costs: </div>
                    <Form.Range />
                </div>

                <div style={{display: 'flex'}}>
                    <div>Relates to: </div>
                    {tags.map((tag, idx) => 
                        <Tag key={`tag-${idx}`}
                                value={tag.value}
                                isActive={tag.isActive} 
                                onClick={tagValue => onChangeFilter(tagValue)} />
                    )}
                </div>
            </div>
          </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button variant="light">
                <AiTwotoneFilter width='100%' height='100%' />
            </Button>
        </OverlayTrigger>
    );
}