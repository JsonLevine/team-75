import { useState } from 'react'


function Results() {
    const data = [
        { username: 'jason', workout: 0, water: 0, meditation: 0, reading: 0 },
        { username: 'gabby', workout: 0, water: 0, meditation: 0, reading: 0 },
    ];

const [results, setResults] = useState(data);

  return (
    <div>
        <h1>Final Results:</h1>

    </div>
  )
}

export default Results