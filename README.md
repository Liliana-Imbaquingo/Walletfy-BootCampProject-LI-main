
# Walletfy

## Description

Welcome to your new app Walletfy!
Walletfy is an application that simulates a digital wallet where the user can register the flow of its money through the time, the user can add or update incomes/expenses distribuited by months. Each month is showed with the trasactions that have been done, the total incomes, total expenses, the monthly result and the global amount(accumulated). Also the user can enter an initial amount that represents the money the user has at the beginning of the transactions and it will be added to the global of each month.
Also you can search the expenses/incomes by year or month and chat with the assistant WalletAI to ask about data of this application.

### Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) and [Mantine](https://mantine.dev/) for styling.

### Validation

This project uses  [Zod](https://zod.dev/v4) for creating and validating types

### Format Date

This project uses [Day.js](https://day.js.org/) to manipulate format dates.

### Global State

This project uses  [Zustand](https://www.npmjs.com/package/zustand) for global states like mode: dark/light.

### Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### LLM

This project uses IA through  WEB-LLM to develop a chat where the user can make consults.

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

Now you can use `useQuery` to fetch your data.

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## Execution

To run locally you need a development environment, this project was developed using VS code. Then is necessary to install the libraries named before:

```bash
npm install
npm i --save-dev vite-tsconfig-paths 
npm i --save-dev @types/node
npm i zod
npm install tailwindcss @tailwindcss/vite
npm i tailwind-merge
npm i clsx
npm install @tanstack/react-router
npm i @tanstack/react-query
npm i @mantine/core @mantine/hooks 
npm i react-dayjs
npm i zustand
```

## Deploy

To deploy in a navigator
First, you have to upload the project in a repository in git-hub
To deploy the app in the CloudFlare you have to:

1.Create an account in [CloudFlare](https://www.cloudflare.com/es-es/)

2.Go to Compute(Workers)

3.Click in tab: Pages

4.In the section Import an existing Git repository, click in Get started

5.In the tab GitHub, click in Connect GitHub

6.Click in Install &Authorize

7.Select a repository

8.CLick in Begin Setup

9.Choose Production branch

10.Chose Frameworkpreset: React(vite)

11.Click in Save and Deploy
