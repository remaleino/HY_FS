import { useState } from 'react'


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
const StatisticLine = ({ text, value }) => {
  return <tr><td>{text}</td><td>{value}</td></tr>
}
const Statistics = ({ good, neutral, bad }) => {
  const summ = good - bad
  const quantity = good + neutral + bad
  if (quantity === 0) {
    return <div>
      <p>No feedback given</p>
    </div>
  }
  const average = summ / quantity
  const positive = good / quantity * 100
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={quantity} />
        <StatisticLine text="average" value={average.toFixed(1)} />
        <StatisticLine text="positive" value={(positive.toFixed(1)) + ' %'} />
      </tbody>
    </table>
  )
}
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }
  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }
  const handleBad = () => {
    setBad(bad + 1)
  }
  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App