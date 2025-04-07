
## 필요 패키지 설치
```bash
npm install aws-sdk serverless-http express multer crypto
```

## 배포
```bash
serverless deploy
```

## 배포삭제
```bash
serverless remove
```




## 로컬에서 테스트 해보기

```bash
npm install serverless-offline --save-dev

```

```yaml
plugins:
  - serverless-offline
```

```bash
serverless offline
```

## API end point
https://0q7pd90v95.execute-api.ap-northeast-2.amazonaws.com/prod/upload