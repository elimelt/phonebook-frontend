import { useState, useEffect } from 'react'
import Entries from './components/Entries'
import Search from './components/Search'
import AddEntry from './components/AddEntry'
import personsService from './services/persons'
import Notification from './components/Notification'
import './index.css'


const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('first name')
    const [newNumber, setNewNumber] = useState('(xxx) xxx-xxxx')
    const [searchQ, setSearchQ] = useState('')
    const [currPersons, setNewCurrPersons] = useState([])
    const [currMessage, setCurrMessage] = useState(null)
  
    useEffect(() => {
        personsService
            .getAll()
            .then(people => { 
                setPersons(people)
                const filtered = people.filter(person => fits(person.name, searchQ))
                setNewCurrPersons(filtered)
            })
    }, [searchQ, currMessage])

    // useEffect(() => {
    //     console.log('per', persons)
    //     if (persons) {
    //         const filtered = persons.filter(person => fits(person.name, searchQ))
    //         setNewCurrPersons(filtered)
    //     }
    // }, [persons, searchQ])

    const addEntry = (event) => {
        event.preventDefault()
        console.log('initial persons', persons);
        if (persons.some(p => p.number === newNumber)) 
            alert(`record for ${newName} or ${newNumber} is already in the phonebook`)
        else if (persons.some((person) => person.name === newName)) {
            if (window.confirm(`${newName} is already in the phone book. Replace number?`)){
                const i = persons.findIndex(person => person.name === newName)
                personsService
                    .update(persons[i].id, {name: newName, number: newNumber, id: persons[i].id})
                    .then(newPerson => { 
                        //console.log('new person',newPerson)
                        const newPersons = persons.map((person, index) => {
                            return (i === index) ? newPerson : person   
                        })
                        newPersons[i] = newPerson
                        //console.log('p', persons)
                        //console.log('new persons', newPersons)
                        if (Object.keys(persons).length !== 0 ) {
                            setPersons(newPersons)
                            const filtered = persons.filter(person => fits(person.name, searchQ))
                            setNewCurrPersons(filtered)
                        }
                        setCurrMessage({text: 'success', messageClass: 'success'})
                        setTimeout(() => setCurrMessage(null), 1000)
                    }).catch(err => {
                        setCurrMessage({text: 'error name already removed', messageClass: 'error'})
                        setTimeout(() => setCurrMessage(null), 1000)
                    })
                personsService.getAll().then(people => setPersons(people))
            }
            
        }else {
            let newP = {
                name: newName, 
                number: newNumber, 
            }
            console.log('0', newP)
            //setPersons(persons.concat(newObj))
            personsService
                .create(newP)
                .then(newObj => {
                    newP = newObj
                    // console.log('1/2', newObj)
                    // console.log('1', persons)
                    // const newPeople = [...persons, newObj]
                    // console.log('newpeople', newPeople)
                    // setPersons(newPeople)
                    // console.log('2', persons)
                    // console.log('3', currPersons)
                    // const filtered = persons.filter(person => fits(person.name, searchQ))
                    // setNewCurrPersons(filtered)
                    // console.log('4', currPersons)
                })
            const newPeople = [...persons, newP]
            console.log('newpeople', newPeople)
            setPersons(newPeople)
            console.log('2', persons)
            console.log('3', currPersons)
            const filtered = persons.filter(person => fits(person.name, searchQ))
            setNewCurrPersons(filtered)
            
            setCurrMessage({text: 'success', messageClass: 'success'})
            setTimeout(() => setCurrMessage(null), 1000)
        }
        setNewName('')
        setNewNumber('')
    }

    const inputNameChange = (event) => {
        setNewName(event.target.value)
    }

    const inputNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const fits = (str, value) => str.toLowerCase().includes(value.toLowerCase());

    const searchChange = (event) => {
        setSearchQ(event.target.value)
        const filtered = persons.filter(person => fits(person.name, searchQ))
        setNewCurrPersons(filtered)
        console.log('persons ', persons)
        console.log('currPersons ', currPersons)
    }

    const deleteEntry = id => {

        const p = persons.find(person => person.id === id)
        if (window.confirm(`are you sure you want to delete ${p.name}`)){
            //console.log('pre', persons)
            const newPersons = persons.filter(person => person.id !== id)
            //console.log('post', newPersons)
            personsService.deletePerson(id)
            setPersons(newPersons)
            const filtered = newPersons.filter(person => fits(person.name, searchQ))
            //console.log('f', filtered)
            //console.log('currP', currPersons)
            setNewCurrPersons(filtered)
            //console.log('postP', currPersons)
        }
    }

    return (
      <div>
        <Notification message={currMessage}/>
        <h1>Phonebook</h1>
        <Search searchChange={searchChange}/>
        <AddEntry 
            addEntry={addEntry} 
            newName={newName} 
            newNumber={newNumber}
            inputNameChange={inputNameChange}
            inputNumberChange={inputNumberChange}
        />
        <Entries persons={currPersons} totalPersons={persons} handleDelete={deleteEntry}/>
      </div>
    )
  }
export default App