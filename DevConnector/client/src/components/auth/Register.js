import React,{Fragment,useState} from 'react'
import {connect} from 'react-redux';
import FormGroup from './../FormGroup';
import {Link} from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import PropTypes from 'prop-types'




const Register = ({setAlert}) => {
    
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2 : ''

    });
    const {name,email,password,password2} = formData;
    const formGroupProps = [
        {type:'text',placeholder:'Name',value:name,name:'name'},
        {type:'email',placeholder:'Email Address',value:email,name:'email'},
        {type:'password',placeholder:'Password',value:password,name:'password'},
        {type:'password',placeholder:'Confirm Password',value:password2,name:'password2'},
];

    const onChangeValue = e => {setFormData({...formData,[e.target.name]:e.target.value})};
    const onSubmitForm = async e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('Passwords do not match!','danger');
        }else{
            console.log('success');
        }
    }

    return (
        <Fragment>
      
    <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={onSubmitForm}>
            {
           formGroupProps.map(formGroup=><FormGroup required onChange={onChangeValue} key={formGroup.name} {...formGroup}/>)     
            }
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert : PropTypes.func.isRequired
}



export default connect(null,{setAlert})(Register);