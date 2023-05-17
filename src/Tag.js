import { Tag as ChakraTag } from "@chakra-ui/react";

export default function Tag({ value, isActive, onClick }) {
    const style = { margin: '3px', cursor: 'pointer', display: 'block', overflow: 'auto', width: 'fit-content' };
    const colorScheme = isActive ? 'teal' : 'blackAlpha';
    function onClickHandler(event) {
        onClick(value);
        event.preventDefault();
    }
    return (
        <div style={style} 
             onClick={onClickHandler}>
            <ChakraTag colorScheme={ colorScheme } variant='outline' size='sm'>
                { value }
            </ChakraTag>
        </div>
    );
}