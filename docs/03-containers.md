# 03 · Containers

**Tempo que gastei aqui:** ~35h (Kubernetes sozinho comeu boa parte disso) · **Pré-requisito:** [02 · Cloud computing](./02-cloud-computing.md) · **Próxima:** [04 · CI/CD →](./04-ci-cd.md)

## Por que essa etapa doeu mais que as outras

"Na minha máquina funciona" foi literalmente uma frase que eu disse em voz alta pro meu monitor antes de entender container de verdade. O problema nunca era a aplicação — era que ela dependia de uma versão de biblioteca que só existia no meu notebook. Container resolve isso empacotando tudo junto. Kubernetes eu levei mais tempo pra engolir, porque parecia complexidade desnecessária até eu ter que gerenciar mais de três instâncias da mesma aplicação ao mesmo tempo — aí fez sentido.

```mermaid
flowchart LR
    A[Dockerfile] --> B[Imagem]
    B --> C[Registro de imagens]
    C --> D[Pod no Kubernetes]
    D --> E[Deployment]
    E --> F[Service]
    F --> G[Ingress / tráfego externo]
```

## Imagens e Dockerfile

Uma imagem é montada em camadas, e o Docker reaproveita as que não mudaram entre builds. Isso eu só entendi na prática quando meu build começou a demorar 4 minutos toda vez que eu mudava uma linha de código — porque eu tinha escrito o Dockerfile na ordem errada.

```dockerfile
FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

O truque é copiar `package*.json` e instalar dependência *antes* de copiar o resto do código. Assim, se eu só mudo código da aplicação (não as dependências), o Docker reaproveita a camada do `npm ci` — que era exatamente a parte lenta do meu build de 4 minutos. Depois de corrigir a ordem, caiu pra uns 15 segundos.

## docker-compose

Quando a aplicação passa a precisar de mais de um container — a API e um banco, no meu caso — o compose descreve tudo num arquivo só e sobe junto, já em rede.

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    depends_on: [db]

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: pass
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

Isso aqui me confundiu na primeira vez: a API conecta no banco usando `db` como host, não `localhost`. Fiquei um tempo tentando entender por que `localhost:5432` não funcionava de dentro do container da API — porque cada serviço do compose enxerga os outros pelo nome, numa rede interna própria, e `localhost` ali dentro é o próprio container da API, não o do banco.

## Pods e deployments no Kubernetes

Um pod é a menor peça que o Kubernetes mexe — geralmente um container. E pods morrem. De propósito, às vezes — o Kubernetes mata e recria pod o tempo todo como parte normal de operação. Por isso você quase nunca cria pod direto; você cria um deployment, que descreve quantas réplicas devem existir, e o Kubernetes garante isso sozinho.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: registro.exemplo.com/api:1.4.0
          ports: [{ containerPort: 3000 }]
```

A primeira vez que eu matei um pod de propósito só pra ver o que acontecia (`kubectl delete pod`), e vi outro subir sozinho em segundos, foi o momento que Kubernetes deixou de parecer mágico assustador e virou só "ah, é isso que ele faz".

## Services, ingress e volumes

Como pod troca de IP interno toda hora, você nunca aponta direto pra ele. Um Service cria um endereço fixo que distribui tráfego entre os pods certos. Um Ingress fica acima disso, roteando tráfego externo por domínio ou caminho pro Service certo. E volume resolve o problema de container ser efêmero — dado que precisa sobreviver a um restart (tipo banco de dados) precisa estar num volume, não dentro do container em si.

Eu esqueci disso uma vez: subi um banco de dados sem volume, o pod reiniciou por qualquer motivo bobo, e todo o dado que eu tinha inserido pra teste sumiu junto. Lição aprendida rápido.

## Helm charts

Editar dezenas de YAML na mão não escala — eu tentei manter isso manualmente por um tempo antes de desistir. Helm empacota tudo num "chart" com valores parametrizáveis.

```bash
helm install minha-api ./chart --set image.tag=1.4.0
helm upgrade minha-api ./chart --set image.tag=1.5.0
helm rollback minha-api 1   # volta pra revisão anterior
```

`helm rollback` foi o comando que me fez confiar em usar Helm de verdade — saber que dá pra voltar atrás com um comando só tira um peso enorme.

## Registro e versionamento de imagens

Nunca uso `latest` em produção, depois de uma vez confundir qual versão estava rodando de fato porque três imagens diferentes tinham essa mesma tag ao longo da semana. Uso versão semântica (`1.4.0`) ou o hash do commit — assim "qual versão tá no ar" sempre tem resposta exata, sem depender de lembrar quando foi o último build.

## Imagens enxutas

Imagem menor sobe mais rápido e tem menos coisa que pode dar errado. Multi-stage build foi a técnica que mais reduziu o tamanho das minhas imagens — separar o estágio que compila do estágio que só roda o resultado final.

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o app .

FROM scratch
COPY --from=builder /src/app /app
ENTRYPOINT ["/app"]
```

A imagem final não carrega o SDK do Go inteiro, só o binário compilado. Diferença de tamanho foi de quase 900MB pra menos de 20MB, no meu caso.

## Erros que eu cometi

- Container rodando como root sem necessidade — o Dockerfile acima já corrige isso com `USER node`, mas o meu primeiro não tinha.
- `latest` em produção, e depois não sabendo dizer qual versão estava realmente rodando.
- Sem `requests`/`limits` de CPU e memória nos pods — um vazamento de memória numa aplicação minha quase derrubou o nó inteiro do cluster.
- Achar que só o Deployment já expunha a aplicação — sem Service e Ingress, ninguém de fora consegue falar com o pod.

## Exercício prático

1. Escreve um Dockerfile multi-stage pra uma aplicação simples, imagem final baseada em `slim` ou `alpine`.
2. Escreve um `docker-compose.yml` com aplicação e banco, sobe com `docker compose up`.
3. Instala um cluster local (`kind` ou `minikube`), escreve um Deployment com 2 réplicas.
4. Cria um Service `ClusterIP` e um Ingress apontando pra ele.
5. **Confere:** deleta um pod na mão (`kubectl delete pod <nome>`) e observa outro subir sozinho — esse foi o momento que fez clique pra mim, espero que faça pra você também.

## Perguntas que eu me faço

<details>
<summary>Por que quase nunca criar pod direto, e sim um Deployment?</summary>

Pod é efêmero e pode falhar a qualquer momento — é esperado. Deployment descreve quantas réplicas devem existir, e o Kubernetes recria pod sozinho sempre que a realidade diverge disso. É essa reação automática que dá ao cluster a capacidade de se autocurar.
</details>

<details>
<summary>Qual problema o multi-stage build resolve, na prática?</summary>

Separa o ambiente que compila (pesado, cheio de ferramenta) do ambiente que só executa o resultado (enxuto). No meu caso isso derrubou uma imagem de quase 900MB pra menos de 20MB.
</details>

## Termos que tive que procurar mais de uma vez

| Termo | O que significa |
|---|---|
| Pod | Menor unidade executável no Kubernetes |
| Deployment | Garante N réplicas de um pod no estado desejado |
| Service | Endereço fixo que distribui tráfego entre pods |
| Ingress | Roteamento de tráfego HTTP externo pro Service certo |
| Multi-stage build | Dockerfile com vários estágios, pra gerar imagem final menor |

## Onde eu fui aprofundar

- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Helm Docs](https://helm.sh/docs/)

---
**Próxima etapa:** [04 · CI/CD →](./04-ci-cd.md)
