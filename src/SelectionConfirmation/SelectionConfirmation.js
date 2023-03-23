import './SelectionConfirmation.css';

import { 
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';

import { HiMagnifyingGlass } from 'react-icons/hi2';
import { AiOutlineClose } from 'react-icons/ai';

function SelectionConfirmation({ position, selection, onConfirm, onClose }) {
    const style = position && selection.length ? {top: position[1], left: position[0]} : {};
    return (
      <Box borderWidth='1px' borderRadius='lg' padding='1px' className={`SelectionConfirmation ${ position ? '' : 'Hidden' }`} style={style}>
        <ButtonGroup justifyContent={'left'} gap='1px'>
          <Button size='xs' onClick={() => onConfirm()}>
            <HiMagnifyingGlass height='100%' />
          </Button>
          <Button size='xs' onClick={() => onClose()}>
            <AiOutlineClose height='100%' />
          </Button>
        </ButtonGroup>
      </Box>
    );
}

export default SelectionConfirmation;