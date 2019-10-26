import React,{Fragment,useState} from 'react'
import FormGroup from './../FormGroup';
import {Link} from 'react-router-dom';

const Login = () => {
    const [formData,setFormData] = useState({
        email:'',
        password:''

    });
    const {email,password} = formData;
    const formGroupProps = [
        {type:'email',placeholder:'Email Address',value:email,name:'email'},
        {type:'password',placeholder:'Password',value:password,name:'password'}
];

    const onChangeValue = e => {setFormData({...formData,[e.target.name]:e.target.value})};
    const onSubmitForm = async e => {
        e.preventDefault();
        console.log('success');
    }

    return (
        <Fragment>

    <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i>Sign In To Your Account</p>
        <form className="form" onSubmit={onSubmitForm}>
            {
           formGroupProps.map(formGroup=><FormGroup required onChange={onChangeValue} key={formGroup.name} {...formGroup}/>)     
            }
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Dont Have An Account? <Link to="/register">Sign Up</Link>
        </p>
        </Fragment>
    )
}

export default Login
