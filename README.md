# Cecil-IA Labs · Open Source Observatory

Portal open source da organização [cecil-ia-labs](https://github.com/cecil-ia-labs), publicado em **https://cecil-ia-labs.github.io/**.

**Objetivo:** apresentar projetos de pesquisa, ferramentas, bibliotecas e conteúdos abertos da Cecil-IA Labs. É independente do site institucional [cecilialabs.com](https://www.cecilialabs.com/) e não substitui o GitHub Pages de projetos individuais, como [`/lattes2orcid/`](https://cecil-ia-labs.github.io/lattes2orcid/).

## Identidade visual

Tema claro editorial com a paleta **Sunset Coral `#FF7A63`**, **Magenta `#E445A2`**, **Violet `#7A5CFF`** e texto **Midnight Navy `#0D1438`**. A paleta foi inspirada na direção Similens v2, mas o portal mantém identidade orbital e logo próprios. Cores saturadas são usadas em detalhes, hierarquia e visualização, não em superfícies de texto longas. Tipografia Inter com fallback para fontes do sistema, sem fontes externas.

## Recursos

- Portal estático responsivo e acessível, sem dependências externas de runtime.
- Interface em português e inglês, com seleção persistida no navegador.
- Busca, filtros por área e cartões com links para repositórios e publicações.
- Catálogo editável em [`data/projects.json`](data/projects.json), inicialmente com **9 repositórios públicos confirmados**.
- GitHub Actions com testes e publicação no GitHub Pages.
- HTML semântico, respeito a `prefers-reduced-motion` e URLs `https` nos links externos.

## Estrutura

```text
.
├── .github/workflows/deploy.yml   # testes e deploy em GitHub Pages
├── .nojekyll                      # impede processamento pelo Jekyll
├── 404.html                       # página de erro personalizada
├── assets/favicon.svg             # identidade vetorial orbital
├── data/projects.json             # catálogo curado PT/EN
├── index.html                     # landing page
├── scripts/app.js                 # traduções, filtros e renderização
├── scripts/serve.mjs              # servidor local Node.js
├── styles.css                     # layout e responsividade
├── tests/site.test.mjs            # consistência do catálogo
├── robots.txt
└── sitemap.xml
```

## Desenvolvimento local

**Requisito:** Node.js 22 ou superior. Não há `npm install` necessário.

```bash
npm test
npm run serve
# http://localhost:8080
```

> Abra pela URL do servidor e não como `file://`, porque a aplicação busca o catálogo JSON via `fetch`.

## Implantação inicial (repositório de organização)

1. Em `https://github.com/organizations/cecil-ia-labs/repositories/new`, crie um repositório **público** chamado exatamente `cecil-ia-labs.github.io` na organização `cecil-ia-labs`. Não adicione README, licença ou `.gitignore` na criação se pretende enviar todos estes arquivos.
2. Extraia os arquivos na raiz de um diretório local e execute:

   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: launch Cecil-IA Labs open source portal"
   git remote add origin https://github.com/cecil-ia-labs/cecil-ia-labs.github.io.git
   git push -u origin main
   ```

3. No GitHub, abra **Settings → Pages → Build and deployment → Source: GitHub Actions**. Verifique também se a organização permite Pages e workflows.
4. Abra **Actions → Publish Cecil-IA Labs portal → Run workflow**, selecione `main` e confirme a execução. A publicação é manual por padrão, para controlar o uso de Actions.
5. Visite `https://cecil-ia-labs.github.io/`.

O workflow usa apenas permissões `contents: read`, `pages: write` e `id-token: write`. Não exige tokens adicionais, DNS personalizado, serviço externo ou secrets.

## Atualizar o catálogo

O arquivo `data/projects.json` contém um item por projeto:

```json
{
  "id": "nome-do-repo",
  "name": "Nome público do projeto",
  "category": "tools",
  "featured": false,
  "kind": "repository",
  "description": {
    "pt": "Descrição em português.",
    "en": "English description."
  },
  "tags": ["TypeScript", "CLI"],
  "repository": "https://github.com/cecil-ia-labs/nome-do-repo",
  "website": "https://exemplo.org/"
}
```

Categorias disponíveis: `research`, `ai`, `tools`, `libraries`, `education`. `website` é opcional. As categorias e descrições são editoriais; confirme fatos e URLs antes de publicá-los. Use `kind: "fork"` quando houver upstream distinto e mantenha as atribuições no projeto original. **Não inclua repositórios privados.**

Depois de editar, execute `npm test` e faça push em `main`. Para publicar a versão atualizada, execute manualmente **Actions → Publish Cecil-IA Labs portal → Run workflow**.

## Escopo e privacidade

O portal não coleta dados, não exige autenticação e não inclui analytics. A preferência de idioma é salva apenas no `localStorage` do dispositivo. O GitHub Pages pode registrar acessos conforme sua própria política de serviço. Cada link externo tem seus próprios termos e políticas.

O catálogo é **curado**, e não uma listagem automática de toda a organização. Isso impede a publicação acidental de projetos privados ou a exibição sem revisão de metadados e descrições.

## Licença

Código deste portal sob [MIT](LICENSE). Licenças e atribuições de cada projeto vinculado permanecem as definidas nos respectivos repositórios; a licença deste portal não se estende automaticamente a eles.