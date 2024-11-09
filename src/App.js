import './App.css';
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('')
  const [withoutNumbers, setWitoutNumbers] =useState(true)
  const [uniqueWords, setUniqueWords] =useState(true)
  const [caseSensitive, setCaseSensitive] =useState(true)
  const [total, setTotal] = useState(0)

  async function handleWithoutNumbers(e) {
    const newWithouNumbers = e.target.checked
    setWitoutNumbers(newWithouNumbers)
    await countWords(newWithouNumbers, uniqueWords, caseSensitive)
  }

  async function handleUniqueWords(e) {
    const newUniqueWords = e.target.checked
    setUniqueWords(newUniqueWords)
    await countWords(withoutNumbers, newUniqueWords, caseSensitive)
  }

  async function handleCaseSensitive(e) {
    const newCaseSensitive = e.target.checked
    setCaseSensitive(newCaseSensitive)
    await countWords(withoutNumbers, uniqueWords, newCaseSensitive)
  }

  async function initialCount() {
    await countWords(withoutNumbers, uniqueWords, caseSensitive)
  }

  function countWords(localWithoutNumbers, localUniqueWords, localCaseSensitive) {
    (async () => {
      const server_url = 'http://localhost:8080/count-words'
      await fetch(server_url, {
          method: "POST",
          headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({text:text, withoutNumbers: localWithoutNumbers,
                                uniqueWords: localUniqueWords, caseSensitive: localCaseSensitive}),
          Cache: 'default'
      })
      .then(res => {
          if (!res.ok) {
              console.log(res.statusText)
          }
          res.json()
          .then(data => {
              const newTotal = data.words
              setTotal(newTotal)
              const divId = document.getElementById('result')
              divId.innerHTML = "Word Count is " + newTotal
              console.log(total)
              console.log(newTotal)
          })
      })
      .catch(error => {
          console.log(error)
      })
    })();
  }

  function updateText(e) {
    setText(e.target.value)
  }

  return (
    <div className='art-card'>
      <div className='intro'>
        <h1>Words Counter</h1>
        <p>Enter a text to get number of words</p>
      </div>
      <textarea onChange={updateText} className="area-text"/>
      <div className='check-boxes'>
        <div>
          <label className='label'>
            <input type="checkbox" id="without-numbers" checked={withoutNumbers}
              className="check-box" onChange={(e) => handleWithoutNumbers(e)}/>
            <span>&nbsp;</span>Without Numbers
          </label>
        </div>
        <div>
          <label className='label'>
            <input type="checkbox" id="unique-words" checked={uniqueWords}
              className="check-box" onChange={(e) => handleUniqueWords(e)}/>
            <span>&nbsp;</span>Unique Words
          </label>
        </div>
        <div>
          <label className='label'>
            <input type="checkbox" id="case-sensitive" checked={caseSensitive}
              className="check-box" onChange={(e) => handleCaseSensitive(e)}/>
            <span>&nbsp;</span>Case Sensitive
          </label>
        </div>
      </div>
      <button onClick={initialCount} className='count-btn'>Count Words</button>
      <div id="result" className='result'></div>
    </div>
  )
}