## Prerequisites
node.js (<= v16)

## Install

1. Install [Node.js](https://nodejs.org/en/)

2. Init & Start
```
npm install
npm start
```

Go to `localhost:3000` in your web browser. 

## How to use
1. 메일로 전달받은 급여 명세서 파일을 다운로드 하고, 직접 실행한 브라우저에 업로드하세요.
2. 급여명세서를 열기 위한 비밀번호를 입력하세요.

## Introduction
Mac OS X 에서 급여명세서를 간편하게 확인할 수 없어서 방법을 찾던 도중 enghqii님 [블로그](https://enghqii.tistory.com/42)와 [소스코드](https://github.com/enghqii)를 발견하고 실행해봤습니다.
실행 중 몇 가지 오류를 발견해 수정하고 배포하였습니다.

급여명세서 형식이 이전과 다른 것으로 미루어 보아 사용하는 솔루션이 바뀐 것으로 예상됩니다.
더존 이라는 기업의 ERP 솔루션을 사용하는 것 같습니다.

본 애플리케이션은 해당 기업의 암호화 프로그램을 분석해 별도 애플리케이션의 도움 없이도 복호화할 수 있도록 구현되어 있습니다.
분석 과정에 관심이 있으신 분들께서는 위에 링크해둔 블로그를 보시면 이해에 많은 도움이 될 것으로 생각합니다.

~~ActiveX... 이젠 보내줄 때도 되지 않았나...~~
