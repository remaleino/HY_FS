import { useEffect, useState } from 'react'
import axios from 'axios'
const start = 'https://api.openweathermap.org/data/2.5/weather?'
const apiKey = '&appid=' + process.env.REACT_APP_API_KEY

const CountryInformation = ({ country }) => {
    const [weather, setWeather] = useState([])
    const [showWeather, setShow] = useState(false)

    const { latlng } = country.capitalInfo
    const lat = 'lat=' + latlng[0]
    const lng = '&lon=' + latlng[1]
    const languages = Object.keys(country.languages)
    const link = start + lat + lng + apiKey
    useEffect(() => {
        function loadData() {
            axios
                .get(link)
                .then(res => {
                    setWeather(res.data)
                    setShow(true)
                })
        }
        loadData()
    }, [])
    const displayWeather = () => {
        const toCel = (weather.main.temp - 273.15).toFixed(2)
        const icon = weather.weather[0].icon
        const iconAdress = `http://openweathermap.org/img/wn/${icon}@2x.png`
        return (
            <div>
                <div>temperature {toCel} Celcius</div>
                <img src={iconAdress} alt='weatherIcon' />
                <div>wind {weather.wind.speed} m/s</div>
            </div>
        )
    }
    return (
        <div>
            <h1>{country.name.official}</h1>
            <div>capital {country.capital.join(" ")}</div>
            <div>area {country.area}</div>
            <h4>languages:</h4>
            <ul>
                {languages.map((language, i) => <li key={i}>{country.languages[language]}</li>)}
            </ul>
            <img src={country.flags.png} alt="flag" style={{ border: "1px solid black" }} />
            <h2>Weather in {country.capital}</h2>
            <div>
                {showWeather
                    ? displayWeather()
                    : 'weather data is loading'}
            </div>

        </div>
    )
}
export default CountryInformation