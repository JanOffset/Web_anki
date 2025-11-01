import LoginScreen from "./Login/LoginScreen.jsx"
import RegisterScreen from "./Login/RegisterScreen.jsx"
import DecksScreen from "./Decks/userDeck.jsx"
import { BrowserRouter as Router,Route, Routes} from 'react-router-dom'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginScreen/>}/>
                <Route path="/register" element={<RegisterScreen/>}/>
                <Route path="/decks" element={<DecksScreen/>}/>
            </Routes>
        </Router>
    )
}