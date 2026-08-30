# Roadmap DevOps

> As anotações que fui escrevendo enquanto estudava DevOps, organizadas em uma trilha de 7 etapas — publicando porque teria adiantado muito se eu tivesse achado algo assim quando comecei.

**[→ Acessar a trilha interativa](https://Isac-Andrade.github.io/DevOps-Roadmap/)** 

---

## Sobre este repositório

Comecei a estudar DevOps sem saber muito bem por onde ir — tentei pular direto pra Kubernetes duas vezes e voltei pra estaca zero as duas. O que funcionou, no fim, foi seguir uma ordem que respeitasse os fundamentos, e ir documentando o que aprendia, os erros que cometia no meio do caminho, e o que eu queria ter lido antes de tropeçar em cada coisa.

Este repositório é isso, organizado: um guia por etapa (`/docs`), escrito em primeira pessoa mesmo, com os erros que cometi e o que fez sentido pra mim entender cada conceito não é um manual genérico, é mais parecido com um caderno de estudo. E um app (`/app`) pra acompanhar o progresso, porque marcar item concluído ajuda a manter o ritmo.

Se você está começando agora, espero que isso poupe algumas das voltas que eu dei.

## As 7 etapas

| # | Etapa | Carga horária | Documentação |
|---|-------|:---:|---|
| 01 | Fundamentos — Linux, redes, Git e Python | ~40h | [docs/01-fundamentos.md](./docs/01-fundamentos.md) |
| 02 | Cloud computing — IAM, redes e serviços gerenciados | ~30h | [docs/02-cloud-computing.md](./docs/02-cloud-computing.md) |
| 03 | Containers — Docker e Kubernetes | ~35h | [docs/03-containers.md](./docs/03-containers.md) |
| 04 | CI/CD — integração e entrega contínuas | ~22h | [docs/04-ci-cd.md](./docs/04-ci-cd.md) |
| 05 | Infraestrutura como código — Terraform e Ansible | ~25h | [docs/05-infraestrutura-como-codigo.md](./docs/05-infraestrutura-como-codigo.md) |
| 06 | Observabilidade — métricas, logs e alertas | ~20h | [docs/06-observabilidade.md](./docs/06-observabilidade.md) |
| 07 | Segurança — DevSecOps na prática | ~18h | [docs/07-seguranca.md](./docs/07-seguranca.md) |

**Total:  37 tópicos.**

## Como uso esses guias (e recomendo usar)

Cada arquivo em `/docs` segue mais ou menos a mesma estrutura:

1. **Por que essa etapa importa** — o contexto real, geralmente amarrado a algum tropeço meu.
2. **Os conceitos**, explicados com exemplo de código e, quando ajuda, um diagrama.
3. **Erros que eu cometi** — os tropeços de verdade, pra você não precisar repetir.
4. **Exercício prático**, com um passo de checagem no final pra saber se deu certo.
5. **Perguntas que eu me faço** — com resposta escondida, pra testar antes de conferir.
6. **Termos e links pra aprofundar**, pra quando o guia não for suficiente.

O que funcionou pra mim: ler a etapa, fazer o exercício antes de olhar as respostas das perguntas, e só marcar como concluído no app depois de sentir que consigo explicar o conceito pra outra pessoa, não só reconhecer o termo.

## Estrutura do repositório

```
devops-roadmap/
├── .github/workflows/deploy.yml   # publica app/ no GitHub Pages a cada push na main
├── docs/                          # guia detalhado de cada etapa (markdown)
├── app/
│   ├── index.html
│   ├── assets/
│   │   ├── style.css
│   │   └── app.js
│   └── data/
│       └── roadmap.json           # fonte única de dados do roadmap, usada pelo app
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

O `app/data/roadmap.json` é a fonte única de verdade dos dados (etapas, tópicos, carga horária). O app lê esse arquivo em tempo de execução — para adicionar ou editar um tópico, basta editar o JSON.

## Como rodar localmente

O app é HTML/CSS/JS puro, sem build step. Como ele carrega dados via `fetch`, precisa ser servido por um servidor local (não abra o `index.html` diretamente com `file://`):

```bash
cd app
python3 -m http.server 8080
# depois acesse http://localhost:8080
```

Ou, com Node instalado:

```bash
npx serve app
```

## Como contribuir

Contribuições são bem-vindas — correções nos guias, novos recursos recomendados, melhorias no app. Veja [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.
