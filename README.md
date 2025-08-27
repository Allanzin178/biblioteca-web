<a id="readme-top"></a>

### Instalação

1. Clone o repositorio
   ```sh
   git clone https://github.com/Allanzin178/biblioteca-web.git
   ```

2. Crie um .env com as seguintes informações: 
   ```env
   DB_PASSWORD = <SUA_SENHA_DO_MYSQL_AQUI>
   SECRET_JWT = <SEU_CODIGO_JWT_AQUI>
   ```

3. Instale as dependencias no NPM
   ```sh
   cd biblioteca-web
   npm install
   ```

4. Rode no banco de dados o conteudo do arquivo `biblioteca_mysql.sql`

5. Agora inicie o projeto com o comando
   ```sh
   npm run dev
   ```

6. Após isso, no seu console deve ter esses logs:
   ```sh
   Servidor on!
   Conectado ao banco!
   ```

4. Acesse o projeto na porta 3000, na pagina de login
   [http://localhost:3000/pages/login.html](http://localhost:3000/pages/login.html)

5. Mude o url do repositorio remoto no git para evitar pushes acidentais
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirma as mudanças
   ```

<p align="right">(<a href="#readme-top">Topo</a>)</p>

## Uso

Esse projeto foi desenvolvido com proposito de servir como um sistema de biblioteca experimental.

<p align="right">(<a href="#readme-top">Topo</a>)</p>

## Link

Link do projeto: [https://github.com/Allanzin178/biblioteca-web](https://github.com/Allanzin178/biblioteca-web)

<p align="right">(<a href="#readme-top">Topo</a>)</p>
