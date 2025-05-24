import{BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import ReservationPage from './pages/ReservationPage';
import ReservationSuivi from './pages/ReservationSuivi';
import DocumentScan from './pages/DocumentScan';
import Paiement from './pages/Paiement';
import ServiceSuivi from './pages/ServiceSuivi';
import SuiviFacture from './pages/FactureSuivi';
import Reservations from './pages/Reservations';
import ReservationDetail from './pages/ReservationDetail';
import CheckinSuivie from './pages/CheckInSuivie';
import AjoutCheckin from './pages/AjoutCheckin';
import SuivieFactureRecep from './pages/FactureSuivieRecp';
import DashboardRecep from './pages/ReceptionnisteDashboard';
import ChambreDetail from './pages/ChambreDetail';
import GeneralPage from './pages/PageGenerale';
import Dashboard from "./components/Dashboard";
import RegistrationSuccess from "./components/RegistrationSuccess";
import Unauthorized from "./components/unauthorized";
import Users from "./components/Users";
import AddUser from "./components/addUser";
import BasePage from "./components/BasePage"
import { EditUser } from "./components/editUser";
import { Chambres } from "./components/Chambres";
import { Services } from "./components/Services";
import { UserProfile } from "./components/UserProfile";
import { UserServices } from "./components/userServices";
import { PaymentSuccess }  from "./components/payment-success"
import { SignUp } from "./components/signUp"
import { LogIn } from "./components/login";
import CheckOutSuivie from "./pages/CheckOutSuivi";

function App(){
    return (
        <Router>
            <Routes>
               
                  
                 <Route path="/homePage" element={<GeneralPage/>}/>
                <Route path="/booking" element={<BookingPage/>}/>
                <Route path="/reservation-form" element={<ReservationPage/>}/>
                <Route path="/mes-reservations" element={<ReservationSuivi/>}/>
                <Route path="/check-in/:reservationId" element={<DocumentScan />} />
                <Route path="/paiement/:reservationId" element={<Paiement></Paiement>}/>
             
                <Route path="/suivi-service" element={<ServiceSuivi />} />
                <Route path="/suivi-facture" element={<SuiviFacture />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/reservationDetail/:id" element={<ReservationDetail />} />
                <Route path="/checkin" element={<CheckinSuivie />} />
                <Route path="/ajoutcheckin/:id_reservation" element={<AjoutCheckin />} />
                <Route path="/checkOut" element={<CheckOutSuivie />} />
                <Route path="/suivi-facture-recep" element={<SuivieFactureRecep/>} />
                <Route path="/dashboard-recep" element={<DashboardRecep/>} />
                <Route path="/chambreDetailPage/:chambreId" element={<ChambreDetail />} />
                <Route path="/login" element={<LogIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/RegistrationSuccess" element={<RegistrationSuccess />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/unauthorized" element={<Unauthorized/>}/>
          <Route path="/users" element={<Users />} />
          <Route path="/addUser" element={<AddUser />}/>
          <Route path="/BasePage" element={<BasePage />}/>
          <Route path="/UserProfile" element={<UserProfile />}/>
          <Route path="/editUser" element={<EditUser />}/>
          <Route path="/Chambres" element={<Chambres />}/>
          <Route path="/Services" element={<Services />}/>
          <Route path="/Services-sejour/:reservationId/:checkoutId" element= {<UserServices/>}/>
          <Route path="/checkout-payment-success/:checkoutId" element= {<PaymentSuccess/>}/>
            </Routes>
        </Router>
        
    )
}

export default App;