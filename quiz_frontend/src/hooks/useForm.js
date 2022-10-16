import React,{useState} from 'react'

export default function useForm(getFreshModel) {
  const [values, setValues] = useState(getFreshModel);
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e)=>{
    const {name, value} = e.target;
    setValues({...values, [name]:value});
  }
  
  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange
  }
}
