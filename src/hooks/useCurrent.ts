import  { useEffect, useState } from 'react'

function useCurrent<T>(data: T[], query: Function) {

  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    const res = query() as T;
    setResult(res)
  }, [data])

  return { result };

}

export default useCurrent