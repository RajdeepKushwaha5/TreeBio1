# Vercel CLI Deployment Instructions

## Install Vercel CLI
npm i -g vercel

## Login to Vercel
vercel login

## Deploy from project directory
cd d:\treebio-master
vercel

## Follow prompts:
# ? Set up and deploy "d:\treebio-master"? [Y/n] y
# ? Which scope do you want to deploy to? [your-username]
# ? Link to existing project? [y/N] n
# ? What's your project's name? treebio
# ? In which directory is your code located? ./
# Local settings detected in vercel.json:
# Auto-detected Project Settings (Next.js):
# ? Want to override the settings? [y/N] n

## Production deployment
vercel --prod
