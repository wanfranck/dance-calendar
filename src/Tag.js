import { Tag as ChakraTag } from "@chakra-ui/react";

export default function Tag({ value, isActive, onClick }) {
    const style = { cursor: 'pointer' };
    return (
        <div>
            <ChakraTag onClick={() => onClick(value)}
                       colorScheme={isActive ? 'teal' : 'blackAlpha'}
                       variant='outline' size='sm' margin={'3px'}
                       float='left' style={style}>
                { value }
            </ChakraTag>
        </div>
    );
}