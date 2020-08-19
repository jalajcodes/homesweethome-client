import { useContext } from 'react';
import ViewerStateContext from './ViewerStateContext';

const useViewerState = () => useContext(ViewerStateContext);

export default useViewerState;
