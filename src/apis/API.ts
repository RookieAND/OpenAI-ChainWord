import { Configuration, OpenAIApi } from 'openai';
import { VITE_OPENAI_API_KEY } from '@/constants';

type ApiResult = ApiSuccess | ApiError;

interface ApiSuccess {
  isSuccess: true;
  result: string | undefined;
}

interface ApiError {
  isSuccess: false;
  errMsg?: string;
}

const configuration = new Configuration({
  organization: 'org-R8fytlj2lAQqY9pxOju4hlBO',
  apiKey: VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const createCompletion = async (message: string): Promise<ApiResult> => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${message} is existed in Korean? and it is Noun? tell me if it is True, or False`,
    max_tokens: 2048,
    temperature: 0.2,
  });
  if (response.data?.choices) {
    const isExist = response.data.choices[0].text?.trim() === 'True';
    if (isExist) return { isSuccess: true, result: undefined };
  }
  return {
    isSuccess: false,
    errMsg: 'Api 요청을 불러오는 과정에서 문제가 발생했습니다.',
  };
};

export const getNextWord = async (firstWord: string): Promise<ApiResult> => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `tell me one korean noun by starting '${firstWord}'. it's length is more than 2 and less than 4.`,
    temperature: 0.2,
  });
  if (response.data?.choices) {
    return { isSuccess: true, result: response.data.choices[0].text?.trim() };
  }
  return { isSuccess: false };
};
