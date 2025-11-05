import { useQuery } from 'react-query';
import { fetchStats } from '../api/tasks';

const useStats = () =>
  useQuery(['stats'], fetchStats, {
    staleTime: 1000 * 60
  });

export default useStats;
