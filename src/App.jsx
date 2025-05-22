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
import Dashboard from './pages/ReceptionnisteDashboard';
import ChambreDetail from './pages/ChambreDetail';
import GeneralPage from './pages/PageGenerale';

function App(){
    return (
        <Router>
            <Routes>
               
                  
                 <Route path="/homePage" element={<GeneralPage/>}/>
                <Route path="/booking" element={<BookingPage/>}/>
                <Route path="/reservation-form" element={<ReservationPage/>}/>
                <Route path="/mes-reservations/:userId" element={<ReservationSuivi/>}/>
                <Route path="/check-in/:reservationId" element={<DocumentScan />} />
                <Route path="/paiement/:reservationId" element={<Paiement></Paiement>}/>
             
                <Route path="/suivi-service/:userId" element={<ServiceSuivi />} />
                <Route path="/suivi-facture/:userId" element={<SuiviFacture />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/reservationDetail/:id" element={<ReservationDetail />} />
                <Route path="/checkin" element={<CheckinSuivie />} />
                <Route path="/ajoutcheckin/:id_reservation" element={<AjoutCheckin />} />
                <Route path="/suivi-facture-recep" element={<SuivieFactureRecep/>} />
                <Route path="/dashboard-recep" element={<Dashboard/>} />
                <Route path="/chambreDetailPage/:chambreId" element={<ChambreDetail />} />
            </Routes>
        </Router>
        
    )
}

export default App;