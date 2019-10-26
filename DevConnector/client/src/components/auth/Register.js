import React,{Fragment,useState} from 'react'
import FormGroup from './../FormGroup';

const Register = () => {
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
    const onSubmitForm = e => {
        e.preventDefault();
        if(password !== password2){
            console.log('Passwords do not match!');
        }else{
            console.log(formData);
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
          Already have an account? <a href="login.html">Sign In</a>
        </p>
        </Fragment>
    )
}

export default Register
