import { createCompletion, getNextWord } from '@/apis/API';
import { useState } from 'react';

function App() {
  const [word, setWord] = useState('');
  const [usedWord, setUsedWord] = useState<Set<string>>(new Set());

  const handleWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typedWord = event.target.value;
    setWord(
      typedWord.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/gi, ''),
    );
  };

  const sendQuestion = async () => {
    if (word.length === 0) {
      return;
    }
    const response = await createCompletion(word);
    if (!response.isSuccess) {
      console.log('AI 에게 답변을 받아오는데 실패했습니다.');
      return;
    }
    console.log(word.at(-1));
    const newWord = await getNewWord(word.at(-1) as string);
    if (!newWord) {
      console.log('문제가 발생하였습니다.');
      return;
    }
    setUsedWord((prevWord) => new Set([...prevWord, newWord]));
  };

  const getNewWord = async (char: string) => {
    const newWordRes = await getNextWord(char.at(-1) as string);
    if (!newWordRes.isSuccess) {
      console.log('AI 에게 답변을 받아오는데 실패했습니다.');
      return undefined;
    }
    const newWord = newWordRes.result as string;
    if (newWord in usedWord) {
      console.log('이미 이전에 존재하는 단어를 받아왔습니다.');
      getNewWord(char);
      return;
    }
    return newWord;
  };

  return (
    <div className="App">
      <input value={word} onChange={handleWord}></input>
      <button onClick={sendQuestion}>Test Send Quiz To Open AI</button>
    </div>
  );
}

export default App;
