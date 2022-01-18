import './App.css';
import { Link } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <nav>
                <Link to="/login">Login</Link>
            </nav>
        </div>
    );
}
    
export default App;
    