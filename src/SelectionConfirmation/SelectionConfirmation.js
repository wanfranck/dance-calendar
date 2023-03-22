import './SelectionConfirmation.css';

import { 
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';

import { BiShowAlt } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

function SelectionConfirmation({ position, onConfirm, onClose }) {
    const style = position ? {top: position[1], left: position[0]} : {};
    return (
      <Box borderWidth='1px' borderRadius='lg' padding='1px' className={`SelectionConfirmation ${ position ? '' : 'Hidden' }`} style={style}>
        <ButtonGroup justifyContent={'left'} gap='1px'>
          <Button size='xs' onClick={() => onConfirm()}>
            <BiShowAlt height='100%' />
          </Button>
          <Button size='xs' onClick={() => onClose()}>
            <AiOutlineClose height='100%' />
          </Button>
        </ButtonGroup>
      </Box>
    );
}

export default SelectionConfirmation;