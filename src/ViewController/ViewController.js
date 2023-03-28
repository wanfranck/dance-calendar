import ViewMode from "./ViewMode";

import { AiOutlineCalendar, AiOutlineUnorderedList } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';

import { Button } from "@chakra-ui/react";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Portal
  } from '@chakra-ui/react'

const ViewSwitcherMap = {
    [ViewMode.Calendar]: ({ setViewMode }) => {
        return (
            <Button key="view-calendar" height='90%' colorScheme='blue' onClick={() => setViewMode(ViewMode.Calendar)}>
                <AiOutlineCalendar width='100%' height='100%' />
            </Button>
        );
    },
    [ViewMode.List]: ({ setViewMode }) => {
        return (
            <Button key="view-list" height='90%' colorScheme='blue' onClick={() => setViewMode(ViewMode.List)}>
                <AiOutlineUnorderedList width='100%' height='100%' />
            </Button>
        );
    },
    [ViewMode.Map]: ({ setViewMode }) => {
        return (
            <Button key="view-map" height='90%' colorScheme='blue' onClick={() => setViewMode(ViewMode.Map)}>
                <MdLocationOn width='100%' height='100%' />
            </Button>
        );
    }
}

const ViewImageMap = {
    [ViewMode.Calendar]: <AiOutlineCalendar width='100%' height='100%' />,
    [ViewMode.List]: <AiOutlineUnorderedList width='100%' height='100%' />,
    [ViewMode.Map]: <MdLocationOn width='100%' height='100%' />
}

function ViewController({ mode, views, setViewMode }) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button height='90%' colorScheme='blue'>{ ViewImageMap[mode] }</Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent width='fit-content'>
                    <PopoverArrow />
                    <PopoverBody>
                        <div className='Horizontal ViewController'>
                            { views.map(v => ViewSwitcherMap[v]({ setViewMode })) }
                        </div>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
}

export default ViewController;