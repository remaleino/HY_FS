const Filter = ({ newFilter, changeEvent }) => {
    return (
        <div>filter shown with <input value={newFilter} onChange={changeEvent} /></div>
    )
}
export default Filter