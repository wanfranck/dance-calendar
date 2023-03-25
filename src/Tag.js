import { Tag as ChakraTag } from "@chakra-ui/react";

export default function Tag({ value }) {
    const style = { cursor: 'pointer' };
    return (
        <div>
            <ChakraTag colorScheme='blackAlpha' variant='outline' size='sm' margin={'3px'} float='left' style={style}>
                { value }
            </ChakraTag>
        </div>
    );
}