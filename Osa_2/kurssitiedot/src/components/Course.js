const Course = ({ course }) => {
    const Header = (props) => {
        return (
            <div>
                <h1>{props.course}</h1>
            </div>
        )
    }
    const Part = ({ name, exercises }) => <div><p>{name} {exercises}</p></div>

    const Content = ({ list }) => {
        return (
            <div>
                {list.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
            </div>
        )
    }
    const Total = ({ list }) => {
        const total = list.map(part => part.exercises)
        return (
            <div>
                <h4>Total of {total.reduce((pV, nV) => pV + nV, 0)} exercises</h4>
            </div>
        )
    }
    return (
        <div>
            <Header course={course.name} />
            <Content list={course.parts} />
            <Total list={course.parts} />
        </div>
    )
}
export default Course