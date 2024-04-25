import { useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Input, InputLabel, TextField, TextareaAutosize } from '@mui/material';
import { AuthContext } from '../hooks/AuthContext';
import ErrorBlob from '../components/ErrorBlob';
import { useNavigate } from 'react-router-dom';
import Textarea from '@mui/joy/Textarea';


const CreateConference = () => {
  const { user } = useContext(AuthContext)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(dayjs(new Date().toJSON()))
  const [endDate, setEndDate] = useState(dayjs(new Date().toJSON()))
  const [errorBlob, setErrorBlob] = useState()
  const navigate = useNavigate()

  const createConference = async (name, location, startDate, endDate, description) => {
    if(!name || !location || !location?.length || !name?.length || !startDate || !endDate || !description || !description?.length){
      setErrorBlob({
        title: "Missing Field",
        message: "Please fill in all fields."
      })
      return
    }
    if(!user?.id?.length){
      setErrorBlob({
        title: "Unauthorized",
        message: "You must be logged in to create a conference."
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
          mutation CreateConference($name: String!, $location: String!, $creatorId: String!, $startDate: String!, $endDate: String!, $description: String!) {
            createConference(name: $name, location: $location, creatorId: $creatorId, startDate: $startDate, endDate: $endDate, description: $description) {
              creator {
                username
              }
            }
          }
        `,
        variables: {
          name,
          location,
          creatorId: user.id,
          startDate: startDate.toJSON(),
          endDate: endDate.toJSON(),
          description
        }
      })
    })
    .then(res => res.json())

    if(result.errors){
      setErrorBlob({
        title: "Error",
        message: result.errors[0].message
      })
      return
    }
    navigate("/conferences")
  }
  return (
    <Container>
      <h1>Create Conference</h1>
      {errorBlob?.title && <ErrorBlob {...errorBlob} />}
      <ul>
        <li>
          <TextField variant="outlined" label="Conference Name" value={name} onInput={(e) => {
            if(errorBlob)setErrorBlob()
            setName(e.target.value)
          }} fullWidth required/>
          
          {/* <input type='text' placeholder='Type here' value={name} onInput={(e) => {
            if(errorBlob)setErrorBlob()
            setName(e.target.value)}
          } /> */}
        </li>
        <li>
          <TextField label='Location' value={location} onInput={(e) => {
            if(errorBlob)setErrorBlob()
            setLocation(e.target.value)}
          } fullWidth required/>
          {/* <input type='text' placeholder='Type here' value={location} onInput={(e) => {
            if(errorBlob)setErrorBlob()
            setLocation(e.target.value)}
          } /> */}
        </li>
        <li>
          <Textarea placeholder='Place a description for your conference' value={description} onInput={(e) => {
            if(errorBlob)setErrorBlob()
            setDescription(e.target.value)}
          } fullWidth required minRows={3}/>
          {/* <input type='text' placeholder='Type here' value={location} onInput={(e) => {
            if(errorBlob)setErrorBlob()
            setLocation(e.target.value)}
          } /> */}
        </li>
        <li>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Conference Start Date" value={startDate} onChange={(newValue) => {
              if(errorBlob)setErrorBlob()
              setStartDate(newValue)}
            } fullWidth/>
          </LocalizationProvider>
        </li>
        <li>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Conference End Date" value={endDate} onChange={(newValue) => {
              if(errorBlob)setErrorBlob()
              setEndDate(newValue)}
            }/>
          </LocalizationProvider>
        </li>
      </ul>
      <button onClick={() => createConference(name, location, startDate, endDate, description)}>Create Conference</button>
    </Container>
  )
}

export default CreateConference

const Container = styled.div`
  height: 100vh;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin: 0 auto;
  padding: 0 2em;
  h1{
    font-size: 2em;
    color: var(--md-sys-color-on-background);
  }
  ul{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
    li{
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
  }
  > button{
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
`