import { useSearchParams } from '@remix-run/react';

const useSimpleQueryState = (query: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get(query);

  const toggle = () => {
    if (!param) {
      searchParams.set(query, 'true');
    } else {
      searchParams.delete(query);
    }

    setSearchParams(searchParams);
  };

  return { state: param === 'true', toggle };
};

const useCompositeQueryState = (query: string, value: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get(query)?.split(',');

  const toggle = () => {
    if (!param) {
      searchParams.set(query, value);
    } else {
      if (param.includes(value)) {
        const newParam = param.filter(p => p !== value);
        if (newParam.length === 0) {
          searchParams.delete(query);
        } else {
          searchParams.set(query, newParam.join(','));
        }
      } else {
        searchParams.set(query, param.concat(value).join(','));
      }
    }
    setSearchParams(searchParams);
  };

  return { state: param?.includes(value), toggle };
};

export function useQueryState(query: string): ReturnType<typeof useSimpleQueryState>;
export function useQueryState(query: string, value: string): ReturnType<typeof useCompositeQueryState>;
export function useQueryState(query: string, value?: string) {
  if (!value) { return useSimpleQueryState(query); }

  return useCompositeQueryState(query, value);
}; 