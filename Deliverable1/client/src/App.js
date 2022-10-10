// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import {useState,useEffect} from 'react';

const CLIENT_ID = "6f6ca476a4ec4917afbc5dca5c668772";
const CLIENT_SECRET = "2f02a4c3207d4768a2624e0af093e504";

function App() {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    var param = {
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
     body: 'grant_type=client_credentials & client_id=' +CLIENT_ID + '& client_secrent= ' + CLIENT_SECRET,

    }
    fetch('https://accounts.spotify.com/api/token',param)
    .then(result => JSON.stringify(result))
    .then(data => console.log(data))
  }, []);

  return (
    <div className="App">
      <br/> 
     <Container>
      <div className='headingBar'>
        <img src={require('./myLogo.png')} className = "logo" />
        <h3>SpotiFYND it</h3>
        <a>.</a>
      </div>
     </Container>
     <br/>
     <Container>
      <InputGroup className = "mb-3" size='lg'>
        <FormControl
        placeholder="Search"
        type ="input"
        onKeyPress={event => {
          if(event.key == "Enter")
          {
            console.log("Pressed Enter");
          }
        }}
        onChange = {event => setSearchInput(event.target.value)}
        />
        <Button onClick={event => {console.log("Clicked Button")}}>Search</Button>
      </InputGroup>
     </Container>
     <Container>
      <Row className='mx-2 row row-cols-4'>
        <Card>
          <Card.Img src='#'/>
          <Card.Body>
            <Card.Title>Song Name</Card.Title>
          </Card.Body>
        </Card>
      </Row> 
     </Container>
    </div>
  );
}

export default App;
