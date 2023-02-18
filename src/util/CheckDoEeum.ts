const HANGUL_FIRST_CODE = '가'.charCodeAt(0);
const HANGUL_LAST_CODE = '힣'.charCodeAt(0);
const JONGSEONG = 'Xㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

export const CheckDoEeum = (word: string) => {
  let char = word.charCodeAt(0);
  if (char < HANGUL_FIRST_CODE || char > HANGUL_LAST_CODE) return word;
  switch (0 | ((char - HANGUL_FIRST_CODE) / JONGSEONG.length)) {
    // 녀, 뇨, 뉴, 니 => 여, 요, 유, 니
    case 48:
    case 54:
    case 59:
    case 62:
      char += 5292;
      break;
    // 랴, 려, 례, 료, 류, 리 => 야, 여, 예, 요, 유, 이
    case 107:
    case 111:
    case 112:
    case 117:
    case 122:
    case 125:
      char += 3528;
      break;
    // 라, 래, 로, 뢰, 루, 르 => 아, 애, 오, 외, 우, 으
    case 105:
    case 106:
    case 113:
    case 116:
    case 118:
    case 123:
      char -= 1764;
      break;
  }
  return String.fromCharCode(char) + word.slice(1);
};
