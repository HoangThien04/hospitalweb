import { useState, useEffect } from 'react';
import './administrator.css';
import ManageDoctors from './components/Contents/ManageDoctors/ManageDoctors';

const Administrator = () => {
    const [ showNav, setShowNav ] = useState(false);
    const [toggleState, setToggleState] = useState(1);
    return (
        <div>
            <ManageDoctors />
        </div>
    );
}
export default Administrator