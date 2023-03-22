import { useRef, useEffect } from "react";

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export const useHasChanged = (val) => {
    const prevVal = usePrevious(val)
    return prevVal !== val
}
