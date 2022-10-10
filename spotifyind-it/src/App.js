import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import musicLogo from './musicLogo.jpg';
import { iframe as IframeHTMLAttributes } from 'react';

//CONNECTING TO SPOTIFY
const CLIENT_ID = "6f6ca476a4ec4917afbc5dca5c668772";
const CLIENT_SECRET = "2f02a4c3207d4768a2624e0af093e504";

function Main() {
  const [searchInput, setSearchInput] = useState(""); //contantly keeps track of what the user enters into the search bar
  const [accessToken, setAccessToken] = useState(""); //sets the accessToken
  const [songs, setTracks] = useState(""); //sets the songs that is returned by the search
  const [artistID, setArtistID] = useState("");
  const [songID, setSongID] = useState("");
  const [genre, setGenre] = useState("");
  const [recs, setRecs] = useState("");
  var at = false;

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
      console.log(accessToken);
      at = true;
  }, []);

  //ARTIST
  //Searches for the artist, gets their artist Id and then searches for songs of that artist Id
  async function searchArtist()
  {
    console.log("Search for: " + searchInput); //printind for debugging
    
    //first thing we need is the artist id: make a get request to find the artist ID
    var searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken 
      }
    }
    //makes the search request and obtains artist id
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
    .then(r => r.json())
    .then(data => {
      return data.artists.items[0].id;})
      
    //THEN using that artist ID, we make another get statements for the album/song
    var retSongs = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?market=US', searchParams)
    .then(r => r.json())
    .then(data => {
      setTracks(data.tracks);
    })
  }

  // SONG
  //Uses a fetch statement to search for a song
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
    .then(data => {
      setTracks(data.tracks.items)
    })
           
  }

  

  //this next section allows one search input show at once
  //Using a use state, I ensure that when the Search for Artist button is clicked the right method and ouput is used
  const [isShownArtist, setIsShownArtist] = useState(false);

  const handleClickArtist = event => {
    setSearchInput("");
    setTracks("");
    setIsShownArtist(true);
    setIsShownSong(false);
    
  };

  //similar as above but for song
  const [isShownSong, setIsShownSong] = useState(false);

  const handleClickSong = event => {
    setSearchInput("");
    setTracks("");
    setIsShownSong(true);
    setIsShownArtist(false);
  };

  //HTML
  return (
    <div className="App">
    
    <img src={musicLogo} className="logo"/>
    <Button onClick={handleClickArtist}>Search for Artist</Button>
    <Button onClick={handleClickSong}>Search for Song</Button>

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
       <h3>Song you searched for: <span>{searchInput}</span></h3>
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
                  <Card.Text className="details">Released:{song.album.release_date}</Card.Text>
                  <Button href={song.external_urls.spotify} target="_blank">Play</Button>
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
       <h3>Artist you searched for: <span>{searchInput}</span></h3>
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
                  <Button href={song.external_urls.spotify} target="_blank">Play</Button>
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
