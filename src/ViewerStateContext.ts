import { createContext } from 'react';
import { Viewer } from './lib/types';

interface viewerContextType {
	viewer: Viewer;
	setViewer: (value: Viewer) => void;
}

const ViewerContext = createContext<viewerContextType | null>(null);

export default ViewerContext;
