import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

//CONNECTING TO SPOTIFY
const CLIENT_ID = "6f6ca476a4ec4917afbc5dca5c668772";
const CLIENT_SECRET = "2f02a4c3207d4768a2624e0af093e504";

function Main() {
  const [searchInput, setSearchInput] = useState(""); //contantly keeps track of what the user enters into the search bar
  const [accessToken, setAccessToken] = useState(""); //sets the accessToken
  const [songs, setTracks] = useState(""); //sets the songs that is returned by the search


  //initializes the spotify api by getting the token
  useEffect(() => {
    //API Access token
    var authParameters = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "grant_type=client_credentials&client_id=" + CLIENT_ID +"&client_secret=" + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, []);

  //ARTIST
  async function searchArtist()
  {
    console.log("Search for: " + searchInput);
    
    //first thing we need is the artist id: make a get request to find the artist ID
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken 
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
    .then(r => r.json())
    .then(data => {return data.artists.items[0].id})
    
    console.log("Artist ID is:" + artistID)
     
    //THEN using that artist ID, we make another get statements for the album/song
    var retSongs = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?market=US', searchParams)
    .then(r => r.json())
    .then(data => {
      console.log(data);
      setTracks(data.tracks);
      
    })
  }

  // SONG
  async function searchSong()
  {
    console.log("Search for: " + searchInput);
    
    //first thing we need is the artist id: make a get request to find the artist ID
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken 
      }
    }
    var songName = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track', searchParams)
    .then(r => r.json())
    .then(data => {console.log(data);
      setTracks(data.tracks.items);
    })
           
  }

  const [isShownArtist, setIsShownArtist] = useState(false);

  const handleClickArtist = event => {
    setIsShownArtist(current => !current);
    
  };

  const [isShownSong, setIsShownSong] = useState(false);

  const handleClickSong = event => {
    setIsShownSong(current => !current);
  };

  console.log(songs);
  return (
    <div className="App">
    
    <Button onClick={handleClickArtist}>Search for Artist</Button>
    <Button onClick={handleClickSong}>Search for Song</Button>
    <a href='./main.js'>main</a>
    
    {/* ARTIST */}
    {isShownSong && (
    <div className="artist">
      <Container className='mt-3 searchBar'> 
        <InputGroup className='mb-3' size= 'lg'>
          <FormControl
            placeholder = "Search for Song"
            type= "input"
            onKeyPress={event => {
              if(event.key == "Enter")
              {
                searchSong();
              }
            }}
            onChange = {event => setSearchInput(event.target.value)} //sets the variable
          />
          <Button onClick= {searchSong}>
            Search
          </Button>
        </InputGroup>
      </Container> 
      {/* end search bar */}
      <div className='search'>
       <h3>You searched for: <span>{searchInput}</span></h3>
      </div>

      <Container className='results'>
        <Row className='mx-2 row row-cols-5'>
          {Array.from(songs).map( (song,i) => {
            console.log(song);
            return (
              <Card className='mx-3 mb-2 card'>
                <Card.Img src = {song.album.images[0].url} className='mt-2'/>
                <Card.Body className='cardBody'>
                  <Card.Title className="songName">{song.name}</Card.Title>
                  <Card.Text className="details">Artist: {song.artists[0].name}</Card.Text>
                  <Card.Text className="details">Album: {song.album.name}</Card.Text>
                </Card.Body>
              </Card>
            )})}
        </Row>
      </Container>
      {/* end results */}
    </div>
    )}


    {/* SONG */}
    {isShownArtist && (
    <div className="artist">
      <Container className='mt-3 searchBar'> 
        <InputGroup className='mb-3' size= 'lg'>
          <FormControl
            placeholder = "Search for Artist"
            type= "input"
            onKeyPress={event => {
              if(event.key == "Enter")
              {
                searchArtist();
              }
            }}
            onChange = {event => setSearchInput(event.target.value)} //sets the variable
          />
          <Button onClick= {searchArtist}>
            Search
          </Button>
        </InputGroup>
      </Container> 
      {/* end search bar */}
      <div className='search'>
       <h3>You searched for: <span>{searchInput}</span></h3>
      </div>

      <Container className='results'>
        <Row className='mx-2 row row-cols-5'>
          {Array.from(songs).map( (song,i) => {
            console.log(song);
            return (
              <Card className='mx-3 mb-2 card'>
                <Card.Img src = {song.album.images[0].url} className='mt-2'/>
                <Card.Body className='cardBody'>
                  <Card.Title className="songName">{song.name}</Card.Title>
                  <Card.Text className="details">{song.album.name}</Card.Text>
                </Card.Body>
              </Card>
            )})}
        </Row>
      </Container>
      {/* end results */}
    </div>
    )}
    </div>
  );
}

export default Main;
