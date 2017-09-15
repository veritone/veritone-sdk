import { Promise } from 'es6-promise';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

class VeritoneWidget {
    /**
     * @constructor
     * @param {object} parameters - Parameters to be passed as initialization parameters to the component
     */
    constructor(type, parameters) {
        this.type = type;
        // uncomment this if you want to expose the React component externally
        //parameters.ref= (instance) => { this.ref = instance; }; 
        this.parameters = parameters;
    }

    static MOUNT_ERROR = "Mount point is not a DOM Element";
    static UNMOUNT_WARNING = "Unmount point is not a DOM Element";

    static isDOMElement(node) {
        if(typeof node == "object" && "nodeType" in node && node.nodeType === 1 && node.cloneNode){
            return true;
        } else {
            return false;
        }
    }

    /**
     * Mount the component
     * @param {object} mountPoint - DOM element to mount the component. Children in the dom element will be destroyed!
     * @returns {Promise<null>} Promise resolved when component is mounted and rendered
     */
    mount = async (mountPoint) => {
        if(this._mountPoint) {
            await destroy();
        }

        const promiseToMount = new Promise( (resolve, reject) => {

            // Make sure the mount point is a DOM element
            if(!VeritoneWidget.isDOMElement(mountPoint)) {
                console.error(MOUNT_ERROR, mountPoint);
                reject(MOUNT_ERROR);    
            }

            this._mountPoint = mountPoint;
            const reactElement = createElement(this.type, this.parameters);
            render( reactElement, mountPoint, () => {
                resolve();
            } );
        });

        return promiseToMount;
    }

    /**
     * Destroys the component
     * @returns {Promise<Boolean>} Promise resolved with true / false (unmount successful?) when original component is unmounted.
     */
     destroy = () => {
        const promiseToUnmount = new Promise( (resolve, reject) => {         
            if(!VeritoneWidget.isDOMElement(mountPoint)) {
                console.warn(UNMOUNT_WARNING);
                this._mountPoint = undefined;
                reject(UNMOUNT_WARNING);    
            }

            let unmounted = unmountComponentAtNode(this._mountPoint);
            this._mountPoint = undefined;  
            resolve(unmounted);
        });

        return promiseToUnmount;
     }
}

export default VeritoneWidget;