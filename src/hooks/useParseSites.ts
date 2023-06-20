import { useEffect, useState } from 'react';
import { parseSites } from 'services/crawler';
import { SiteInfo } from 'types/Crawler';

export const useParseSites = (): [SiteInfo[], number] => {
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<SiteInfo[]>([]);

  useEffect(() => {
    const load = async () => {
      const total = await parseSites(5, res => {
        setData(res.filter(item => Boolean(item)));
      });

      setTotal(total);
    };

    load();
  }, []);

  return [data, total];
};
