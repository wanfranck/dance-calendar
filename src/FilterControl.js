import { AiTwotoneFilter } from 'react-icons/ai';
import { Button, Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton, Input,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb, } from '@chakra-ui/react';

import { format, parse } from 'date-fns';

import Tag from './Tag';

export default function FilterControl({date, tags, onChangeDate, onChangeFilter}) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button colorScheme='blue' style={{ height: '90%' }}>
                    <AiTwotoneFilter width='100%' height='100%' />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>What events are you looking for? <br/> The one that...</PopoverHeader>
                <PopoverBody>
                    <div>
                        <div>
                            <p>Starts from: </p>
                            <Input defaultValue={format(date, "yyyy-MM-dd")}
                                   onChange={(event) => 
                                    onChangeDate(parse(event.target.value, "yyyy-MM-dd", new Date()))
                                   } size="md" type="date" />
                        </div>

                        <div style={{ display: 'none' }}>
                            <p>Costs between: </p>
                            <RangeSlider>
                                <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb index={0} />
                                <RangeSliderThumb index={1} />
                            </RangeSlider>
                        </div>

                        <div>
                        <p>Relates to: </p>
                            {tags.map((tag, idx) => 
                                <Tag key={`tag-${idx}`}
                                     value={tag.value}
                                     isActive={tag.isActive} 
                                     onClick={tagValue => onChangeFilter(tagValue)} />
                            )}
                        </div>
                    </div>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}