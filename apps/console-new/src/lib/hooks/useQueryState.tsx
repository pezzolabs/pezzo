import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryState(key, defaultValue = undefined) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    const paramValue = searchParams.get(key);
    // If there's a value in the URL, use it; otherwise, use defaultValue if provided.
    return paramValue !== null ? paramValue : defaultValue;
  });

  // Set the default value in the URL if it's provided and doesn't exist.
  useEffect(() => {
    if (defaultValue !== undefined && !searchParams.has(key)) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, defaultValue);
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [key, defaultValue, searchParams, setSearchParams]);

  // Update the state when the URL changes.
  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue !== value) {
      // Only set the value if it's not null, which indicates that it's present in the URL.
      setValue(paramValue !== null ? paramValue : defaultValue);
    }
  }, [key, defaultValue, value, searchParams]);

  // Function to update both the state and the URL search params.
  const setQueryState = useCallback(
    (newValue) => {
      setValue(newValue);
      const newSearchParams = new URLSearchParams(searchParams);
      // If newValue is undefined, delete the search param; otherwise, set the new value.
      if (newValue === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, newValue);
      }
      setSearchParams(newSearchParams, { replace: true });
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setQueryState];
}
