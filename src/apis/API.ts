import { Configuration, OpenAIApi } from 'openai';
import { VITE_OPENAI_API_KEY } from '@/constants';

interface ApiResult {
  isSuccess: boolean;
  result: string | undefined;
}

const configuration = new Configuration({
  organization: 'org-R8fytlj2lAQqY9pxOju4hlBO',
  apiKey: VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const createCompletion = async (message: string): Promise<ApiResult> => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `'${message}' 이라는 단어가 실제 쓰이는지 boolean 값으로 말해줘.`,
    max_tokens: 4096,
    temperature: 0,
  });
  if (response.data?.choices) {
    const isExist = response.data.choices[0].text?.trim() === 'True';
    return { isSuccess: isExist, result: message };
  }
  return { isSuccess: false, result: undefined };
};

export const getNextWord = async (firstWord: string): Promise<ApiResult> => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `'${firstWord}' 로 시작하는 명사 단어를 하나 말해줘.`,
    max_tokens: 4096,
    temperature: 0,
  });
  if (response.data?.choices) {
    return { isSuccess: true, result: response.data.choices[0].text?.trim() };
  }
  return { isSuccess: false, result: undefined };
};
