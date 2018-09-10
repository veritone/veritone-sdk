import React, { Fragment } from 'react';
import { string, func, arrayOf, shape } from 'prop-types';

// import cx from 'classnames';
// import styles from '../../../styles.scss';

// @material-ui/core
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';


import EngineButton from '../../components/EngineButton';
import { engineCategoryMapToModal } from '../../EngineModelInfo';


class SearchBarContainer extends React.Component{

    // validating prop types
    static propTypes = {
      engineCategories: arrayOf(
        shape({
          id: string,
          name: string,
          iconClass: string,
          title: string,
          subtitle: string
        })
      ),
      onClose: func,
      onAdd: func,
    };

    // creating default props
    static defaultProps = {
    };

    constructor(props){
        super(props)

        this.openModalRef = React.createRef();

        this.state = {
          open: false,
          selectedEngine: this.props.engineCategories[0],
        };
    }

     //-------------------------------------------------------------
      // close the dialog
      handleCancel = () => {
        if (this.props.onClose){
          this.props.onClose()
        } else {
          console.log('onClose - no handle')
        }
      }

     //-------------------------------------------------------------
      // pass the search item back to parent
      handleAdd = () => {
          console.log(this.openModalRef.returnValue())
          if (this.props.onAdd) {
            this.props.onAdd(this.openModalRef.returnValue())
          } else {
            console.log('onAdd - no handle')
          }
          
      };
     //-------------------------------------------------------------
      // update the UI based on the selected engine
      handleEngineClick = (id) => {
        this.updateEngineSelection(id)
      };
    
      //-------------------------------------------------------------
      // update
      updateEngineSelection(id){
        const engine = this.props.engineCategories.find( (element) => {
          return (element.id === id )
        })
    
        if (engine) {
          console.log('update engine selection: ', engine.name)
          this.setState({ 
            selectedEngine: engine
          });
        }
    
      }
      //-------------------------------------------------------------
      getCurrentModal() {
        return engineCategoryMapToModal[this.state.selectedEngine.id].modal;
      }
    
      //-------------------------------------------------------------
      // render supported engine button
    _renderEngineButton(){
        return(
            <div >
            {
                this.props.engineCategories.map(engine => (
                    <EngineButton 
                      key={engine.id}
                      engineCategory={engine} 
                      selectedColor={ engine.id === this.state.selectedEngine.id ? "primary" : undefined }
                      color={ engine.id === this.state.selectedEngine.id ? 'blue' : undefined }
                      onClick={this.handleEngineClick}/>
                ))
            }
            </div>
        )
    }

    //-------------------------------------------------------------
    // render selected engine avator
    _renderAvatar(iconClass){
      return(
        <Avatar >
          <Icon className={iconClass} size={'2em'}/>
        </Avatar>
      )
    }

    //-------------------------------------------------------------
    // rebder Close and Add butons
    _renderCloseAdd(){
      return(
        <Fragment>
          <Button
            onClick={this.handleCancel}
            style={{ marginLeft: 'auto' }}
            color="primary"
          >
          Close
        </Button>
        <Button onClick={this.handleAdd} color="primary">
          Add
        </Button>
      </Fragment>
      )
    }

    // main render
    render(){

        const Modal = this.getCurrentModal()

        return(
            <Card  style={{ width: 900 }}>
            <CardHeader
              avatar={ this._renderAvatar(this.state.selectedEngine.iconClass)}
              action={ this._renderEngineButton() }
              title={this.state.selectedEngine.title}
              subheader={this.state.selectedEngine.subtitle}
              style={{ marginTop: 0, marginRight: 0 }}
            />
            <CardContent>
              { Modal ? (
                  <Modal 
                    engineCategoryId={this.state.selectedEngine.id}
                    ref={ this.openModalRef }
                    onCancel={this.handleCancel} 
                    add={this.handleAdd}
                  /> 
                ): null
              }
            </CardContent>
            <CardActions style={{ padding: '1em' }}>
              {this._renderCloseAdd()}
            </CardActions>
          </Card>
        )
    }
}

export  default SearchBarContainer;