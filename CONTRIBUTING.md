# Como contribuir

Obrigado por considerar contribuir com o Roadmap DevOps! Este projeto fica melhor com a experiência de mais gente.

## Formas de contribuir

- **Corrigir ou melhorar um guia** em `/docs` — links quebrados, recursos desatualizados, explicações pouco claras.
- **Sugerir um novo tópico ou recurso** — edite `app/data/roadmap.json` e o guia correspondente em `/docs`.
- **Melhorar o app** — ajustes de acessibilidade, responsividade ou performance em `/app`.
- **Traduzir** o conteúdo para outro idioma.

## Processo

1. Faça um fork do repositório.
2. Crie uma branch descritiva: `git checkout -b docs/atualiza-recursos-kubernetes`.
3. Faça suas alterações. Se estiver editando `roadmap.json`, garanta que o arquivo continua sendo um JSON válido:
   ```bash
   python3 -c "import json; json.load(open('app/data/roadmap.json'))"
   ```
4. Se possível, teste o app localmente (veja a seção "Como rodar localmente" no README).
5. Abra um Pull Request explicando o que mudou e por quê.

## Diretrizes de conteúdo

- Priorize documentação oficial como fonte de recursos recomendados.
- Mantenha os objetivos de aprendizado concretos e verificáveis (algo que dá para marcar como concluído).
- Evite recomendar ferramentas pagas como único caminho — sempre que possível, indique uma alternativa gratuita ou com camada gratuita.

## Código de conduta

Seja respeitoso. Críticas construtivas são bem-vindas; hostilidade não.
