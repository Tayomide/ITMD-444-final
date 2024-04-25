import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../hooks/AuthContext'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import emailjs from "@emailjs/browser";

const Conference = () => {
  const params = useParams()
  const [conference, setConference] = useState(null)
  const { months, days, user, token } = useContext(AuthContext)

  const [role, setRole] = useState("attendee")

  useEffect(() => {
    console.log(role)
  }, [role])

  emailjs.init({
    publicKey: "AxPxZbeBlBHCGYuHi"
  })

  const formatStamp = (stamp) => {
    console.log(stamp)
    const date = new Date(Number(stamp))
    console.log(date)
    return months[date.getMonth()] + " "+ date.getDate() + " " + days[date.getDay()]
  }
  const getConferece = async () => {
    if(!token)return
    await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query Conference($conferenceId: String!) {
          conference(conferenceId: $conferenceId) {
            creator {
              username
              email
            }
            description
            endDate
            startDate
            name
            location
          }
        }`,
        variables: {
          conferenceId: params.id
        }
      })
    }).then(res => res.json())
    .then((data) => setConference(data.data.conference))
    .catch(console.log)
  }

  const joinConference = async (role, conference) => {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation JoinConference($userId: String!, $conferenceId: String!, $role: Status!) {
            joinConference(userId: $userId, conferenceId: $conferenceId, role: $role) {
              conferenceId
            }
          }
        `,
        variables: {
          "userId": user.id,
          "conferenceId": params.id,
          "role": role
        }
      })
    })
    .then(() => {
      console.log(user)
      if(user?.email?.length){
        var templateParams = {
          to_email: user.email,
          to_name: user.username,
          from_name: "Conference Manager",
          conference_name: conference.name,
          conference_date: formatStamp(conference.startDate),
          conference_organizer: conference.creator.username
        };
        emailjs.send("service_mf80wp7", "template_0gxu52s", templateParams).then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
          },
          function (err) {
            console.log("FAILED...", err);
          }
        );
      }
    })
  }

  useEffect(() => {
    getConferece()
  }, [])

  useEffect(() => {
    console.log(conference)
  }, [conference])
  return (
    conference ?
    <Container>
      <h2>{conference.name}</h2>
      <span>{conference.location}</span>
      <p>{conference.description}</p>
      <p>From {formatStamp(conference.startDate)} to {formatStamp(conference.endDate)}</p>
      <p>Created by {conference.creator.username}</p> {/* Add a link if there's time */}
      <select onInput={(e) => setRole(e.target.value)} defaultValue={role}>
        <option name="attendee" value="attendee">Attendee</option>
        <option name="speaker" value="speaker">Speaker</option>
      </select>
      <button onClick={() => {
        joinConference(role, conference)
      }}>Join Conference</button>
    </Container> : <div>
      <p><Link to="/login">Login</Link> to access this page</p>
    </div>
  )
}

export default Conference

const Container = styled.div``