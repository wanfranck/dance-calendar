import { Tag as ChakraTag } from "@chakra-ui/react";

export default function Tag({ value, isActive, onClick }) {
    const style = { cursor: 'pointer', display: 'block', overflow: 'auto' };
    function onClickHandler(event) {
        onClick(value);
        event.preventDefault();
    }
    return (
        <div style={style} 
             onClick={onClickHandler}>
            <ChakraTag colorScheme={isActive ? 'teal' : 'blackAlpha'}
                       variant='outline' size='sm' margin={'3px'}
                       float='left' >
                { value }
            </ChakraTag>
        </div>
    );
}