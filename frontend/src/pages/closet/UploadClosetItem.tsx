import UploadItem from "@/features/closet/components/UploadItem";
import PossibleMatches from "@/features/closet/components/PossibleMatches";
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

const UploadClosetItem = () => {
  const location = useLocation();
  // react to path changes
  const showMatches = useMemo(() => location.pathname.endsWith('/matches'), [location.pathname]);

  return showMatches ? <PossibleMatches /> : <UploadItem />;
};

export default UploadClosetItem;