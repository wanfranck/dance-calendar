import ViewMode from "./ViewMode";

import { AiOutlineCalendar, AiOutlineUnorderedList } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';

import { Button } from "@chakra-ui/react";

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

function ViewController({ views, setViewMode }) {
    return (
        <div className='Horizontal ViewController'>
            { views.map(v => ViewSwitcherMap[v]({ setViewMode })) }
        </div>
    );
}

export default ViewController;