import { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { AuthContext } from "../hooks/AuthContext"

const Conferences = () => {
  const [conferences, setConferences] = useState([])
  const { months, days } = useContext(AuthContext)
  const getConferences = async () => {
    const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Query {
            allConferences {
              name
              id
              startDate
              creator {
                username
              }
            }
          }
        `
      })
    })
    .then(res => res.json())
    console.log(result)
    if(result.data?.allConferences){
      setConferences(result.data?.allConferences || [])
    }
    return result
  }

  useEffect(() => {
    getConferences()
  }, [])
  
  return (
    <Container>
      <h1>Conferences</h1>
      <Link to="/conference/create">Create Conference</Link>
      {
        conferences.map(conference => {
          console.log(conference.startDate)
          const date = new Date(Number(conference.startDate))
          console.log(date, date.getMonth(), date.getDate(), date.getDay(), months, days)
          return (
            <div key={conference.id}>
              <Link to={`/conference/${conference.id}`}>
                <h1>{conference.name}</h1>
              </Link>
              <p>Created by {conference.creator.username} happening on {months[date.getMonth()]} {date.getDate()}, {days[date.getDay()]}</p>
            </div>
          )
        })
      }
    </Container>
  )
}

export default Conferences

const Container = styled.div``