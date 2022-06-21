import { useState, useEffect } from 'react'
import useService from './services/persons'
import Filter from './components/Filter'
import Form from './components/Form'
import Person from './components/Person'
import Notification from './components/Notification'

// npx json-server --port=3001 --watch db.json

const success = {
  color: 'green'
}
const error = {
  color: 'red'
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [statusMessage, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    useService
      .getAll()
      .then(res => {
        setPersons(res)
      })
      .catch(e => console.log(e))
  }, [])
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }
  const deleteIdOf = (objectId) => {
    useService
      .deletePerson(objectId)
      .then(() => {
        const copy = [...persons]
        copy.splice(copy.findIndex(({ id }) => id === objectId), 1)
        setPersons(copy)
        setMessage('Deleted object from the phonebook.')
        setStatus(success)
        setTimeout(() => {
          setMessage(null)
          setStatus(null)
        }, 4000)
      })
      .catch(err => {
        setMessage(err.message)
        setStatus(error)
        setTimeout(() => {
          setMessage(null)
          setStatus(null)
        }, 4000)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newObject = {
      name: newName,
      number: newNumber
    }
    const searchObject = persons.find(e => e.name === newName)
    if (searchObject === undefined) {
      useService
        .create(newObject)
        .then(res => {
          setPersons(persons.concat(res))
          setMessage(`Added ${res.name} to the phonebook`)
          setStatus(success)
          setTimeout(() => {
            setMessage(null)
            setStatus(null)
          }, 4000)
        })
        .catch(err => {
          setMessage(err.message)
          setStatus(error)
          setTimeout(() => {
            setMessage(null)
            setStatus(null)
          }, 4000)
        })
    } else if (searchObject.name === newName && searchObject.number === newNumber) {
      alert(`${newName} is already added to the phonebook`)
    } else if (searchObject.name === newName) {
      const sent = `${newName} is already added to the phonebook, replace the old number with a new one?`
      if (window.confirm(sent)) {
        useService
          .update(searchObject.id, newObject)
          .then(res => {
            const copy = [...persons]
            const objIndx = copy.findIndex((obj => obj.id === res.id))
            copy[objIndx].number = newNumber
            setPersons(copy)
            setMessage(`Updated ${res.name} information.`)
            setStatus(success)
            setTimeout(() => {
              setMessage(null)
              setStatus(null)
            }, 4000)
          })
          .catch(err => {
            setMessage(err.message)
            setStatus(error)
            setTimeout(() => {
              setMessage(null)
              setStatus(null)
            }, 4000)
          })
      }
    }
    setNewName('')
    setNewNumber('')
  }
  const handleFilter = (event) => {
    if (event.target.value !== '') {
      setShowAll(false)
    } else {
      setShowAll(true)
    }
    setNewFilter(event.target.value)
  }
  const showPersons = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={statusMessage} status={status} />
      <Filter newFilter={newFilter} changeEvent={handleFilter} />
      <h2>Add a new</h2>
      <Form addPerson={addPerson} name={[newName, handleNewName]} number={[newNumber, handleNewNumber]} />
      {showPersons.map(person =>
        <Person key={person.id}
          name={person.name}
          number={person.number}
          deletePerson={() => deleteIdOf(person.id)} />
      )}
    </div>
  )

}

export default App