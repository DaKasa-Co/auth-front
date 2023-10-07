import { IonContent, IonPage } from '@ionic/react';
import ContainerForm from '../components/Login';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage id="page">
      <IonContent fullscreen>
        <ContainerForm />
      </IonContent>
    </IonPage>
  );
};

export default Home;
