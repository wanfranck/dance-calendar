import { AiTwotoneFilter, AiOutlineClear } from 'react-icons/ai';
import { Button, OverlayTrigger, Popover, Form } from 'react-bootstrap';

import Tag from './Tag';

export default function FilterControl({tags, onChangeFilter, onClearSelection}) {
    const popover = (
        <Popover id="popover-basic">
          <Popover.Body>
            <div>
                <div>
                    <div>Costs: </div>
                    <Form.Range />
                </div>

                <div>
                    <div>Relates to: </div>
                    {tags.map((tag, idx) => 
                        <Tag key={`tag-${idx}`}
                                value={tag.value}
                                isActive={tag.isActive} 
                                onClick={tagValue => onChangeFilter(tagValue)} />
                    )}
                </div>

                <div>
                    <Button variant="light"  onClick={event => onClearSelection(event)}>
                        <AiOutlineClear width='100%' height='100%' />
                    </Button>
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