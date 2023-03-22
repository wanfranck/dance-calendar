import './SelectionConfirmation.css';

import { 
  Button,
  Box,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react';



function SelectionConfirmation({ position, onConfirm, onClose }) {
    const style = position ? {top: position[1], left: position[0]} : {};
    return (
      <Box className={`SelectionConfirmation ${ position ? '' : 'Hidden' }`} style={style}>
        <ButtonGroup>
          <Button colorScheme='blue' size='xs' onClick={() => onConfirm()}> Show </Button>
          <Button colorScheme='blue' size='xs' onClick={() => onClose()}> X </Button>
        </ButtonGroup>
      </Box>
    );
}

export default SelectionConfirmation;