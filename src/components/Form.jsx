import { useState } from "react"
import { FORMS } from "../Form-Datas.js"

export default function Form() {
    const [formName, setFormName] = useState('login');
    const [inputs, setInputs] = useState(()=> {return createInputsStorage(formName)});
    const [submissionMess, setSubmissionMess] = useState();

    const form = {...FORMS[formName]};
    const btnsNames = [...form.btns];
    const inputsNames = [...form.inputs];

    
    function createInputsStorage(formName) {
        const inputs = {};

        FORMS[formName].inputs.forEach(name => {
            inputs[name.toLowerCase()] = '';
        });
        return inputs;
    }

    function handleInputs(event) {
        const name = event.target.name;
        const value = event.target.value;
        
        setInputs((inputs)=> {
            const newInputs  = {...inputs, [name]: value};
            return newInputs;
        })
    }

    function deriveInputs(inputsNames, formName, inputs) {
        return inputsNames.map((name)=> {
            const type = (name !== 'Email') && (name !== 'Password') ? 'text' : name.toLowerCase();
            const key = `${name}-${formName}`;
            const value = inputs[name.toLowerCase()];
            return <input 
                type={type} 
                placeholder={name} 
                name={name.toLowerCase()} 
                key={key} 
                value={value} 
                className="tab"
                onChange={handleInputs}/>
        });
    }

    function handleFormSub(event) {
        event.preventDefault();
        const invalidInputs = getInvalidInputs(inputs);
        const mess = returnSubmissionRes(invalidInputs);
        console.log(inputs)
        setSubmissionMess(mess);
    }

    function getInvalidInputs(inputs) {
        const  MIN_PASS = 8;
        const invalidInputs = [];

        for (const [key, value] of Object.entries(inputs)) {
            if (key === 'email') { 
                isEmailValid(value) ? true : invalidInputs.push(key);
            } 
            if (key === 'password') { 
                isPasswordValid(value, MIN_PASS) ? true : invalidInputs.push(key);
            }
            if (key !== 'password' && key !== 'email') {
                value.trim() === '' ? invalidInputs.push(key) : null ;
            }
        }
        return invalidInputs;
    }

    function isEmailValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isPasswordValid(pwd, min) {
        return pwd.trim().length >= min;
    }

    function returnSubmissionRes(invalidInputs) {
        if (invalidInputs.length > 0) {
            const errorList = [];
            
            invalidInputs.map((inputName)=> {
                let errorMess = '';
                inputName === 'email' ? errorMess = '* Email format is invalid.' : '';
                inputName === 'password' ? errorMess = '* Password should be at least 8 characters long.' : '';
                inputName !== 'email' && inputName !== 'password' ? errorMess = `* Fill ${inputName} field.` : '';
                errorList.push(errorMess);
            })

            return(
                <ul className="flexColumnCenter">
                    {errorList.map((error, index)=> {
                        const key = `${index}-error`;
                        return <li key={key}>{error}</li>
                    })}
                </ul>
            )
        }

        return(<p className="submissionMess">Submitting info, please wait...</p>)
    }

    function handleFormName(formName) {
        const nextFormName = formName === 'login' ? 'register' : 'login';
        setFormName(nextFormName);
        setSubmissionMess('');
        setInputs(createInputsStorage(nextFormName));
    }
 
    return(
        <div className="formWindow flexColumnCenter" onSubmit={(event)=> {handleFormSub(event)}}>
            <h2>{form.title}</h2>
            <form className="flexColumnCenter">
                {deriveInputs(inputsNames, formName, inputs)}
                <button className="tab" type="submit">{btnsNames[0]}</button>
            </form>
            {submissionMess}
            <p>
                <span>{form.question}</span>
                <button type="button" onClick={()=> {handleFormName(formName)}}>{btnsNames[1]}</button>
            </p>
        </div>
    )
}

