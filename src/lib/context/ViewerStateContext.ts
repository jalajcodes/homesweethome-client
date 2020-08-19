import { createContext } from 'react';
import { Viewer } from '../types';

interface viewerContextType {
	viewer: Viewer;
	setViewer: (value: Viewer) => void;
}

// Here, I used not-null assertion operator to save checking for undefined values everytime.
const ViewerContext = createContext<viewerContextType>(undefined!);

export default ViewerContext;
