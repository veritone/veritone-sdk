import React from 'react';
import {  object, arrayOf, objectOf, any } from 'prop-types';
import Folder from './Folder';
import CollapsibleFolder from './CollapsibleFolder';




export default class FolderList extends React.Component {
  static propTypes = {
    list: arrayOf(object),
  };

  static defaultProps = {

  };

  sortList = (list) => {
   return list.sort((a, b) => {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;

    })

  }



  render() {
    let { list } = this.props

    if(!list){
      return <div/>;
    }
    return this.sortList(list).map((folder) => {
      let key  =  folder.treeObjectId;

      if (folder.childFolders && folder.childFolders.count > 0){
        return <CollapsibleFolder key={key} folder={folder}  />;
      } else {
        return <Folder  key={key} folder={folder}/>;
      }
    });
  }
}


  

  
