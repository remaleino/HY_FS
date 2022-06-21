import axios from 'axios'
import { useState, useEffect } from 'react'
import CountryInformation from './components/CountryInformation'


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setFilter] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [filteredData, setFilteredData] = useState()

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(res => {
        setCountries(res.data)
        setFilteredData(res.data)
        setDataLoaded(true)
      })
  }, [])

  const handleFilter = (event) => {
    const input = event.target.value
    const filteredList = countries.filter((country) => country.name.official.toLowerCase().includes(input))
    setFilter(input)
    setFilteredData(filteredList)
  }

  const setSelected = (props) => {
    setFilteredData([props])
  }

  const displayData = () => {
    if (filteredData.length > 10) {
      return (
        <div>Too many matches, spesify another filter</div>
      )
    } else if (filteredData.length > 1) {
      return (
        <div>
          {filteredData.map((country, i) => <div key={i}>{country.name.official}<Button handleClick={() => setSelected(country)} text="show" /></div>)}
        </div>
      )
    } else if (filteredData.length > 0) {
      return (
        <CountryInformation country={filteredData[0]} />
      )
    }
  }
  return (
    <div>
      <div>
        {!dataLoaded
          ? 'loading data...'
          : <div>find countries<input value={newFilter} onChange={handleFilter} /></div>}
      </div>
      <div>
        {filteredData
          ? displayData()
          : ''
        }
      </div>
    </div>
  )
}

export default App
