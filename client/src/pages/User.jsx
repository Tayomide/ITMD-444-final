import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../hooks/AuthContext'
import { useNavigate } from 'react-router-dom'
import ErrorBlob from "../components/ErrorBlob"

const User = () => {
  const { user, setUser } = useContext(AuthContext)
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const[errorBlob, setErrorBlob] = useState()

  const navigate = useNavigate()

  const handleUpdate = async (username, email) => {
    if(!username?.length || !email?.length){
      setErrorBlob({
        title: "Invalid Credentials",
        message: "Please enter a valid username and email."
      })
      return
    }
    const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation JoinConference($username: String!, $email: String!, $userId: String!) {
          updateUser(username: $username, email: $email, userId: $userId) {
            id
            createdAt
            username
            email
          }
        }
        `,
        variables: {
          email: email,
          username: username,
          userId: user.id
        }
      })
    })
    .then(res => res.json())

    if(result?.errors){
      setErrorBlob({
        title: "Invalid Credentials",
        message: "Please enter a valid username and email."
      })
      return
    }
    setUser(result.data.updateUser)
    navigate("/")
  }


  useEffect(() => {
    setUserName(user.username || '')
    setEmail(user.email || '')
  }, [])

  return (user && 
    <Container>
      <div className="content-container">
        <h3>Update User Information</h3>
        {errorBlob?.title && <ErrorBlob {...errorBlob} />}
        <ul>
          <li>
            <p>Username</p>
            <input type='text' placeholder='Type here' value={username} onInput={(e) => {
              if(errorBlob)setErrorBlob()
              setUserName(e.target.value)}
            } />
          </li>
          <li>
            <p>Email</p>
            <input type='text' placeholder='Type here' value={email} onInput={(e) => {
              if(errorBlob)setErrorBlob()
              setEmail(e.target.value)}
            } />
          </li>
        </ul>
        <button onClick={() => handleUpdate(username, email)}>Update</button>
      </div>
    </Container>
  )
}

export default User

const Container = styled.div`
  padding: 1em 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  .content-container {
    width: 500px;
    padding: 0 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1em;
    h3{
      font-weight: 800;
      line-height: 20px;
      font-size: 2em;
      text-align: center;
      color: var(--md-sys-color-on-background);
      padding-bottom: 0.5em;
    }
    ul{
      display: flex;
      flex-direction: column;
      gap: 1em;
      width: 100%;
      li{
        p{
          font-size: 14px;
          line-height: 1.5em;
          color: var(--md-sys-color-on-background);
        }
        input{
          padding: 16px;
          border: 1px solid #CCC;
          border-radius: 8px;
          width: 100%;
          outline: 0;
          &:focus-within, &:focus-visible{
            outline:2px solid var(--md-sys-color-primary);
            border-color: transparent;
          }
        }
      }
    }
    button{
      width: 100%;
      border-radius: 100px;
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border: 0;
      padding: 0.6em;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      line-height: 24px;
      font-size: 0.85em;
      &:hover{
        filter: brightness(90%);
      }
    }
    .divider{
      height: 0;
      width: 100%;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }
    .external-login{
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.7em;
      button{
        & > svg{
          fill:  var(--md-sys-color-on-secondary-container);
        }
        &:hover{
          filter: brightness(90%)
        }
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background-color: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }
    }
    .signup-redirect{
      color: var(--md-sys-color-on-background);
      a{
        color: var(--md-sys-color-primary);
        text-decoration: none;
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
  @media screen and (max-width: 700px) {
    .content-container{
      padding: 0 20px;
    }
  }
`