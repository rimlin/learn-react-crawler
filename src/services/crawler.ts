import { SiteInfo } from 'types/Crawler';

const getSiteInfo = async (siteIndex: number): Promise<SiteInfo> => {
  const req = await fetch(`/api/info?index=${siteIndex}`);
  const res = await req.json();

  return res;
};

export const parseSites = async (
  limit = 3,
  onProcess: (res: SiteInfo[]) => void
) => {
  const resCount = await (await fetch(`/api/count`)).json();
  const count: number = resCount.count;
  const res: SiteInfo[] = new Array(count);

  let nextIndex = 0;
  let allocated = 0;

  const fetchSite = async () => {
    if (nextIndex >= count) {
      return;
    }

    if (allocated >= limit) {
      nextIndex--;
      return;
    }

    const currIndex = nextIndex;
    const siteInfo = getSiteInfo(currIndex);
    
    allocated++;
    nextIndex++;
    fetchSite();

    res[currIndex] = await siteInfo;
    onProcess(res);

    allocated--;
    nextIndex++;
    fetchSite();
  };

  fetchSite();

  return count;
};
