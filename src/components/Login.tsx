import React from 'react';
import { IonButton, IonIcon, IonInput, IonTitle } from '@ionic/react';
import { sparkles, arrowBack, mail, paperPlane, arrowForward, add } from 'ionicons/icons';
import './Login.css';
import { useMaskito } from '@maskito/react';

type RegisterParams = {
  birthday: string,
  email: string,
  name: string,
  password: string,
  phoneNumber: number,
  username: string
}

class validateField {
  static email(email: string): Error | void {
    const r = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!r.test(email)) {
      return new Error(`O email ${email} não é válido`);
    }
  }

  static username(username: string): Error | void {
    const r = /^[\.\-\w]{3,13}$/

    if (!r.test(username)) {
      return new Error(`O usuário ${username} não é válido`);
    }
  }

  static password(password: string): Error | void {
    let hasUpper: boolean = false; 
    let hasLower: boolean = false;
    let hasNum: boolean = false;
    let hasSpecialChar: Boolean = false;

    if (password.length < 8) {
      return new Error(`A senha precisa ser mais comprida`);
    }

    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      switch (true) {
        case char == char.toUpperCase():
          hasUpper = true;
          break;
      
        case char == char.toLowerCase():
          hasLower = true;
          break;
        
        case char >= '0' && char <= '9':
          hasNum = true;
          break;
        
        case /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(char):
          hasSpecialChar = true;
          break;
      }
    }

    if (!hasUpper) {
      return new Error(`Senha precisa ter ao menos uma letras maiúsculas`);
    }
  
    if (!hasLower) {
      return new Error(`Senha precisa ter ao menos uma letra minúscula`);
    }
  
    if (!hasNum) {
      return new Error(`Senha precisa ter ao menos um número`);
    }
  
    if (!hasSpecialChar) {
      return new Error(`Senha precisa ter ao menos um caractere especial`);
    }
  }
}

class FetchIdentities {
  static register(register: RegisterParams) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
    const usernameRegex = /^[\.\-\w]{3,13}$/
  }
}

const ContainerForm: React.FC = () => {
  const [forms, setForms] = React.useState('')
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

interface LoginProps {
  setForms(forms: string): void;
}

const Login: React.FC<LoginProps> = (props) => {
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

const Register: React.FC<LoginProps> = (props) => {
  const Next = (<IonButton className="sendForm" color="secondary" onClick={() => NextOrSend()}>Próximo<IonIcon slot='end' icon={arrowForward} /></IonButton>);
  const [component, setComponent] = React.useState(Next);
  const [previewImage, setPreviewImage] = React.useState('');
  const NextOrSend = () => {
    const parent = document.getElementById("registerContainer") as HTMLElement;
    const getClasses = document.getElementsByClassName("stepIncomplete");
    const steps = document.getElementsByClassName("registerStep").length;
    const gl = getClasses.length - 1;
    if (gl == 0) {
      alert("send");
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
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Username'></IonInput>
        </div>
        <div className='registerStep stepIncomplete'>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Email' type='email'></IonInput>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Número Celular' placeholder='912345678'></IonInput>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Senha' type='password'></IonInput>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Confirmar senha' type='password'></IonInput>
        </div>
        <div className='registerStep stepIncomplete'>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Nome Completo'></IonInput>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Username'></IonInput>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Data de Nascimento' type='date'></IonInput>
          <IonInput color="dark" className='field' labelPlacement="floating" fill="solid" label='Endereço'></IonInput>
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

const RecoveryPart1: React.FC<LoginProps> = (props) => {
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

const RecoveryPart2: React.FC<LoginProps> = (props) => {
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
