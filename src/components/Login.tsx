import React from 'react';
import { IonButton, IonIcon, IonInput, IonTitle } from '@ionic/react';
import { sparkles, arrowBack, mail, paperPlane, arrowForward, add } from 'ionicons/icons';
import './Login.css';
import { useMaskito } from '@maskito/react';
import { validateField } from '@dakasa/mfe-utils';
import axios from 'axios';
import process from 'process';

type RegisterParams = {
  birthday: string,
  email: string,
  name: string,
  password: string,
  phoneNumber: string,
  username: string,
  address: string,
  avatar: string,
}

class FetchIdentities {
  static async register(register: RegisterParams) {
    try {
      validateField.email(register.email);
      validateField.noSpecialChar("name", register.name);
      validateField.birthday(register.birthday);
      validateField.password(register.password);
      validateField.username(register.username);

      const config = {
        headers: {
          'Access-Control-Allow-Origin': `http://${import.meta.env.VITE_REACT_APP_DOMAIN}:${import.meta.env.VITE_REACT_APP_PORT}`,
          'Access-Control-Allow-Methods': "DELETE, POST, GET, OPTIONS",
          'Access-Control-Allow-Headers': "Content-Type, Authorization, X-Requested-With",
        }
      }

      axios.post(`http://${import.meta.env.VITE_REACT_APP_DOMAIN}:${import.meta.env.VITE_REACT_APP_PORT}/api/register`, register, config)
      .then((response) => {
        console.log(response);
        alert(response.data);
      })
      .then((error) => {
        alert(error);
      });

    } catch(err) {
      alert(err)
    }
  }
}

const ContainerForm: React.FC = () => {
  const [forms, setForms] = React.useState('');
  let ComponentForm;

  switch (forms) {
    case "recovery1":
      ComponentForm = <RecoveryPart1 setForms={setForms}></RecoveryPart1>;
      break;

    case "recovery2":
      ComponentForm = <RecoveryPart2 setForms={setForms}></RecoveryPart2>;
      break;

    case "register":
      ComponentForm = <Register setForms={setForms}></Register>;
      break;

    default:
      ComponentForm = <Login setForms={setForms}></Login>;
      break;
  }

  return (
    <div id="container">
      <h1 className='logo'>DaKasa</h1>
      {ComponentForm}
    </div>
  );
};

interface navigateFormProps {
  setForms(forms: string): void;
}

const Login: React.FC<navigateFormProps> = (props) => {
  return (
    <div className="forms" id="login">
      <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Username'></IonInput>
      <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Senha' type='password'></IonInput>
      <IonButton className="sendForm" color="secondary" onClick={() => props.setForms("register")}>
        Enviar
        <IonIcon slot='end' icon={paperPlane} />
      </IonButton>
      <p className="changeForm" onClick={() => props.setForms("recovery1")}>Esqueceu as credenciais?</p>
      <br /><br/>
      <IonButton shape='round' onClick={() => props.setForms("register")}>
        Criar uma conta
        <IonIcon slot='end' icon={sparkles} />
      </IonButton>
    </div>
  )
}

const Register: React.FC<navigateFormProps> = (props) => {
  const Next = (<IonButton className="sendForm" color="secondary" onClick={() => NextOrSend()}>Próximo<IonIcon slot='end' icon={arrowForward} /></IonButton>);
  const [component, setComponent] = React.useState(Next);
  const [previewImage, setPreviewImage] = React.useState('');
  const [validateEmail, setValidateEmail] = React.useState<Error | "">();
  const [validatePassword, setValidatePassword] = React.useState<Error | "">();
  const [validateCopyPassword, setValidateCopyPassword] = React.useState<Error | "">();
  const [validateName, setValidateName] = React.useState<Error | "">();
  const [validateUsername, setValidateUsername] = React.useState<Error | "">();
  const [validateDate, setValidateDate] = React.useState<Error | "">();
  const [isEmailTouched, setIsEmailTouched] = React.useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = React.useState(false);
  const [isCopyPasswordTouched, setIsCopyPasswordTouched] = React.useState(false);
  const [isNameTouched, setIsNameTouched] = React.useState(false);
  const [isUsernameTouched, setIsUsernameTouched] = React.useState(false);
  const [isDateTouched, setIsDateTouched] = React.useState(false);

  const NextOrSend = async () => {
    const parent = document.getElementById("registerContainer") as HTMLElement;
    const getClasses = document.getElementsByClassName("stepIncomplete");
    const steps = document.getElementsByClassName("registerStep").length;
    const gl = getClasses.length - 1;
    if (gl == 0) {
      const avatar = (document.getElementById("insertAvatar") as HTMLInputElement).files
      let base64Avatar = "";
      
      // TO DO: Add in [mfe-utils] media validation
      // if (avatar) {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(avatar[0]);
      //   reader.onload = function () {
      //     console.log(reader.result);
      //   };
      //   reader.onerror = function (error) {
      //     console.log('Error: ', error);
      //   };
      // }

      const register: RegisterParams = {
        username: (document.getElementById("usernameField") as HTMLInputElement).value,
        email: (document.getElementById("emailField") as HTMLInputElement).value,
        password: (document.getElementById("passwordField") as HTMLInputElement).value,
        name: (document.getElementById("nameField") as HTMLInputElement).value,
        birthday: (document.getElementById("birthdayField") as HTMLInputElement).value,
        phoneNumber: (document.getElementById("phoneNum") as HTMLInputElement).value,
        address: (document.getElementById("addressField") as HTMLInputElement).value,
        avatar: base64Avatar,
        
      }

      await FetchIdentities.register(register);
      return;
    }

    parent.style.marginLeft = `-${200 * (steps - gl)}%`;
    getClasses[0].classList.remove("stepIncomplete");
    if (gl == 1) {
      setComponent(
        <div id="backOrNext">
          <IonButton className="intermediaryBtn" color="secondary" onClick={() => Back()}>
            <IonIcon slot='start' icon={arrowBack} />
            Voltar
          </IonButton>
          <IonButton className="intermediaryBtn" color="tertiary" onClick={() => NextOrSend()}>
            Enviar
            <IonIcon slot='end' icon={paperPlane} />
          </IonButton>
        </div>
      )
      return;
    }

    setComponent(
      <div id="backOrNext">
        <IonButton className="intermediaryBtn" color="secondary" onClick={() => Back()}>
          <IonIcon slot='start' icon={arrowBack} />
          Voltar
        </IonButton>
        <IonButton className="intermediaryBtn" color="secondary" onClick={() => NextOrSend()}>
          Próximo
          <IonIcon slot='end' icon={arrowForward} />
        </IonButton>
      </div>
    );
  }

  const Back = () => {
    const parent = document.getElementById("registerContainer") as HTMLElement;
    const getClasses = document.getElementsByClassName("stepIncomplete");
    const steps = document.getElementsByClassName("registerStep");

    steps[steps.length - getClasses.length - 1].classList.add("stepIncomplete");
    parent.style.marginLeft = `-${200 * (steps.length - getClasses.length)}%`;

    if (getClasses.length == steps.length) {
      setComponent(Next);
      return;
    }

    setComponent(
      <div id="backOrNext">
        <IonButton className="intermediaryBtn" color="secondary" onClick={() => Back()}>
          <IonIcon slot='start' icon={arrowBack} />
          Voltar
        </IonButton>
        <IonButton className="intermediaryBtn" color="secondary" onClick={() => NextOrSend()}>
          Próximo
          <IonIcon slot='end' icon={arrowForward} />
        </IonButton>
      </div>
    );
  }

  const imagePreview = () => {
    const content = document.getElementById("insertAvatar") as HTMLInputElement;
    const c = document.getElementById("changeAvatar") as HTMLElement;

    if (!content.files || !content.files[0]) {return;}
    c.style.opacity = '0';
    setPreviewImage(URL.createObjectURL(content.files[0]))
  }

  const validationMask = useMaskito({
    options: {
      mask: ['5', '5', '9', ...Array(8).fill(/\d/)],
    },
  });

  const insertRefPhoneNum = () => {
    const validation = document.getElementById("phoneNum") as HTMLInputElement;
    validationMask(validation);
  }

  const validate = (
    ev: Event, 
    update: React.Dispatch<React.SetStateAction<"" | Error | undefined>>, 
    func: Function,
    key: string | false = false) => 
  {
    const value = (ev.target as HTMLInputElement).value;
    setValidateEmail(undefined);
    if (value === '') return;
    const err = key ? func(key, value) : func(value);
    !err ? update("") : update(err);
  };

  const markTouched = (touch: React.Dispatch<React.SetStateAction<boolean>>) => {
    touch(true);
  };

  const samePassword = () => {
    const pw = document.getElementById("passwordField") as HTMLInputElement;
    const cpw = document.getElementById("passwordCopyField") as HTMLInputElement;

    if (pw.value != cpw.value) {
      return new Error("A confirmação da senha tem que ser identica a senha");
    }
  }

  return (
    <div className="forms" id="login">
      <div id='registerContainer'>
        <div className='registerStep stepIncomplete'>
          <div id="avatar">
            <img src={previewImage} id="newAvatar"/>
            <label htmlFor="insertAvatar" id="changeAvatar">
              <IonIcon icon={add}/>
              <span id="changeAvatarText">Adicione um Avatar</span>
            </label>
            <input type="file" accept='img/*' id="insertAvatar" onChange={imagePreview}/>
          </div>
          <IonInput
            value='.-g10'
            id="usernameField"
            className={`field ${validateUsername === "" && 'ion-valid'} ${validateUsername != "" && 'ion-invalid'} ${isUsernameTouched && 'ion-touched'}`}
            color="dark" 
            labelPlacement="floating" 
            fill="solid" 
            label='Username'
            errorText={validateUsername instanceof Error ? validateUsername.message : validateUsername}
            onIonInput={(event) => validate(event, setValidateUsername, validateField.username)}
            onIonBlur={() => markTouched(setIsUsernameTouched)}
          />
        </div>
        <div className='registerStep stepIncomplete'>
          <IonInput
            value='giovanni@gmail.com'
            id="emailField"
            className={`field ${validateEmail === "" && 'ion-valid'} ${validateEmail != "" && 'ion-invalid'} ${isEmailTouched && 'ion-touched'}`} 
            color="dark"
            labelPlacement="floating" 
            fill="solid" 
            label='Email' 
            type='email'
            errorText={validateEmail instanceof Error ? validateEmail.message : validateEmail}
            onIonInput={(event) => validate(event, setValidateEmail, validateField.email)}
            onIonBlur={() => markTouched(setIsEmailTouched)}
          />
          <IonInput 
            value='55981750155'
            id="phoneNum" 
            className='field' 
            labelPlacement="floating" 
            fill="solid" 
            label='Número Celular' 
            placeholder='55912345678' 
            color="dark" 
            onIonInput={insertRefPhoneNum}
          />
          <IonInput
            value="Potato123*"
            id="passwordField"
            className={`field ${validatePassword === "" && 'ion-valid'} ${validatePassword != "" && 'ion-invalid'} ${isPasswordTouched && 'ion-touched'}`} 
            color="dark" 
            labelPlacement="floating" 
            fill="solid" 
            label='Senha' 
            type='password'
            errorText={validatePassword instanceof Error ? validatePassword.message : validatePassword}
            onIonInput={(event) => validate(event, setValidatePassword, validateField.password)}
            onIonBlur={() => markTouched(setIsPasswordTouched)}
          />
          <IonInput
            value="Potato123*"
            className={`field ${validateCopyPassword === "" && 'ion-valid'} ${validateCopyPassword != "" && 'ion-invalid'} ${isCopyPasswordTouched && 'ion-touched'}`} 
            id="passwordCopyField"
            color="dark"
            labelPlacement="floating" 
            fill="solid" 
            label='Confirmar senha' 
            type='password'
            errorText={validateCopyPassword instanceof Error ? validateCopyPassword.message : validateCopyPassword}
            onIonInput={(event) => validate(event, setValidateCopyPassword, samePassword)}
            onIonBlur={() => markTouched(setIsCopyPasswordTouched)}
          />
        </div>
        <div className='registerStep stepIncomplete'>
          <IonInput 
            value="Giovanni Martins"
            id="nameField"
            className={`field ${validateName === "" && 'ion-valid'} ${validateName != "" && 'ion-invalid'} ${isNameTouched && 'ion-touched'}`}
            color="dark" 
            labelPlacement="floating" 
            fill="solid" 
            label='Nome Completo'
            errorText={validateName instanceof Error ? validateName.message : validateName}
            onIonInput={(event) => validate(event, setValidateName, validateField.noSpecialChar, "name")}
            onIonBlur={() => markTouched(setIsNameTouched)}
          />
          <IonInput
            value="2002-11-05"
            id="birthdayField"
            className={`field ${validateDate === "" && 'ion-valid'} ${validateDate != "" && 'ion-invalid'} ${isDateTouched && 'ion-touched'}`}
            color="dark"
            labelPlacement="floating" 
            fill="solid" 
            label='Data de Nascimento' 
            type='date'
            errorText={validateDate instanceof Error ? validateDate.message : validateDate}
            onIonInput={(event) => validate(event, setValidateDate, validateField.birthday)}
            onIonBlur={() => markTouched(setIsDateTouched)}
          />
          <IonInput value="Rua dos peixinhos" id="addressField" color="dark" className='field' labelPlacement="floating" fill="solid" label='Endereço'></IonInput>
        </div>
      </div>
      {component}
      <br /><br />
      <IonButton shape='round' size='small' onClick={() => props.setForms("")}>
        <IonIcon slot='start' icon={arrowBack} />
        Voltar para o login
      </IonButton>
    </div>
  )
}

const RecoveryPart1: React.FC<navigateFormProps> = (props) => {
  return (
    <div className="forms" id="recoveryPart1">
      <br></br><br></br>
      <IonTitle>Bora recuperar essa conta?</IonTitle>
      <br></br>
      <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Email' type='email'></IonInput>
      <IonButton className="sendForm" color="secondary" onClick={() => props.setForms("recovery2")}>
        Enviar
        <IonIcon slot='end' icon={paperPlane} />
      </IonButton>
      <br /><br />
      <IonButton shape='round' size='small' onClick={() => props.setForms("")}>
        <IonIcon slot='start' icon={arrowBack} />
        Voltar
      </IonButton>
    </div>
  )
}

const RecoveryPart2: React.FC<navigateFormProps> = (props) => {
  const validationMask = useMaskito({
    options: {
      mask: [...Array(6).fill(/\d/)],
    },
  });

  const insertRefValidation = () => {
    const validation = document.getElementById("validationField") as HTMLElement;
    validationMask(validation);
  }
  
  return (
    <div className="forms" id="login">
      <IonInput id="validationField" onInput={insertRefValidation} color="dark" className='field' labelPlacement="floating" fill="solid" label='Validação' placeholder='000000'></IonInput>
      <IonButton className="sendForm" color="secondary" onClick={() => props.setForms("")}>
        Enviar
        <IonIcon slot='end' icon={paperPlane} />
      </IonButton>
      <br /><br />
      <IonButton shape='round' size='small' onClick={() => props.setForms("recovery1")}>
        Inserir outro email
        <IonIcon slot='end' icon={mail} />
      </IonButton>
    </div>
  )
}

export default ContainerForm;
