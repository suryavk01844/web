# Deploying CineMatch to GitHub Pages

1. Push this project to the `main` branch of your GitHub repo
   (make sure the `.github` folder is included).
2. Repo -> Settings -> Pages -> Source: **GitHub Actions**.
3. Repo -> Settings -> Secrets and variables -> Actions -> New repository secret:
   - Name: `VITE_TMDB_API_KEY`
   - Value: your TMDB API key or Read Access Token
4. Push (or re-run the workflow from the Actions tab). When it turns green, the site is live.

Local development: copy `.env.example` to `.env`, add your key, run `npm install` then `npm run dev`.
