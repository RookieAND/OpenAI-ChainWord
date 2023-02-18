import { createCompletion, getNextWord } from '@/apis/API';
import { useState } from 'react';
import { CheckDoEeum } from './util/CheckDoEeum';

function App() {
  const [word, setWord] = useState('');
  const [usedWord, setUsedWord] = useState<Set<string>>(new Set());

  const handleWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typedWord = event.target.value;
    if (typedWord.length > 3) return;
    setWord(
      typedWord.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/gi, ''),
    );
  };

  const EnterWord = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && word.length < 4) {
      sendQuestion();
    }
  };

  const applyDoEeum = () => {
    setWord(CheckDoEeum(word));
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
    setUsedWord((prevWord) => new Set([...prevWord, word]));
    const newWord = await getNewWord(word.at(-1) as string);
    if (!newWord) {
      console.log('문제가 발생하였습니다.');
      return;
    }
    setWord(newWord.at(-1) as string);
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
      <input value={word} onKeyDown={EnterWord} onChange={handleWord}></input>
      <button onClick={sendQuestion}>단어 말하기</button>
      <button onClick={applyDoEeum}>두음법칙 적용하기</button>
      <h5>현재까지 이야기 한 단어 : {Array.from(usedWord).length}</h5>
      <div>
        {Array.from(usedWord).map((keyword: string, idx: number) => (
          <p>
            {idx % 2 == 0 ? '나' : 'AI'} : {keyword}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
