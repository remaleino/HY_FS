
const Person = ({ name, number, deletePerson }) => {
    const deleteWindow = () => {
        if (window.confirm(`Delete ${name}?`)) {
            deletePerson()
        }
    }
    return (
        <h4>{name} {number} <button onClick={deleteWindow}>delete</button></h4>
    )
}

export default Person