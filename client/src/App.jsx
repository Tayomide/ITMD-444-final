import { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import styled from "styled-components"
import { AuthContext } from "./hooks/AuthContext.js"
import Signup from "./pages/Signup.jsx"
import Conferences from "./pages/Conferences.jsx"
import CreateConference from "./pages/CreateConference.jsx"
import Conference from "./pages/Conference.jsx"
import User from "./pages/User.jsx"

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null)
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")) || null)
  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token))
    if(token?.length)setIsAuthenticated(true)
  }, [token])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const login = async (username, password) => {
    const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation LoginUser($username: String!, $password: String!) {
          loginUser(username: $username, password: $password) {
            token
            user {
              id
              createdAt
              username
              email
            }
          }
        }
        `,
        variables: {
          username,
          password
        }
      })
    })
    .then(res => res.json())
    if(result.data?.loginUser?.token){
      setUser(result.data?.loginUser?.user)
      setToken(result.data?.loginUser?.token)
    }
    return result
  }
  const signup = async (username, password) => {
    const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation SignupUser($username: String!, $password: String!) {
          signupUser(username: $username, password: $password) {
            createdAt
            id
            username
            email
          }
        }
        `,
        variables: {
          username,
          password
        }
      })
    })
    .then(res => res.json())
    console.log(result)
    if(result.data?.loginUser){
      setUser(result.data?.loginUser?.user)
    }
    return result
  }
  const logout = () => {
    setUser(null)
    setToken(null)
  }
  useEffect(() => {
    document.documentElement.classList.add('light');
    fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${import.meta.env.VITE_GEO_API_KEY}&location=Chicago,IL&maxResults=5`)
    .then(res => res.json())
    .then(data => {
      const latLng = data.results[0].locations[0].latLng
      fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latLng.lat}&lon=${latLng.lng}&appid=${import.meta.env.VITE_API_KEY}`)
      .then(res => res.json())
      .then(data =>  console.log(data))
    })
   
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      setLoading,
      isAuthenticated,
      setIsAuthenticated,
      login,
      logout,
      signup,
      token,
      setToken,
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }}>
      <Container>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/conference/create" element={<CreateConference />} />
          <Route exact path="/conferences" element={<Conferences />} />
          <Route exact path="/conference/:id" element={<Conference />} />
          <Route exact path="/user" element={<User />} />
        </Routes>
      </Container>
    </AuthContext.Provider>
  )
}

export default App

const Container = styled.div`
  #meta-description{
    position: fixed;
    font-size: 0.9em;
    top: 100px;
    padding: 0.6em;
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border-radius: 10px;
    z-index: 100;
    &.active{
      display: block;
    }
  }
`
